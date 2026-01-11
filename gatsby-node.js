const path = require('path');
const fetch = require('node-fetch');
exports.sourceNodes = async ({
  actions,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;
  const BASE_URL = 'https://api-ca.ssactivewear.com/v2/styles/';

  // Get environment variables inside the function to ensure they're available
  const username = process.env.SNS_API_USERNAME;
  const password = process.env.SNS_API_KEY;
  const basicAuth =
    username && password
      ? Buffer.from(`${username}:${password}`).toString('base64')
      : null;

  console.log('🔍 Debug - Environment variables:');
  console.log('SNS_API_USERNAME:', username ? 'SET' : 'MISSING');
  console.log('SNS_API_KEY:', password ? 'SET' : 'MISSING');
  console.log('🔍 Debug - Values:');
  console.log('SNS_API_USERNAME value:', username);
  console.log(
    'SNS_API_KEY value:',
    password ? password.substring(0, 8) + '...' : 'MISSING',
  );
  console.log(
    '🔍 Debug - Basic Auth:',
    basicAuth ? basicAuth.substring(0, 20) + '...' : 'NOT CREATED',
  );

  // Validate environment variables
  if (!username || !password) {
    console.warn(
      'Missing S&S API credentials. Using local fallback data from data/all_styles_raw.json',
    );

    // Load from local JSON file as fallback
    try {
      const fs = require('fs');
      const pathModule = require('path');
      const filePath = pathModule.resolve('./data/all_styles_raw.json');
      const rawData = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(rawData);

      // Use same filtering logic as when API is available
      const selectedBrands = [
        'Gildan',
        'JERZEES',
        'BELLA + CANVAS',
        'Next Level',
        'Hanes',
        'Comfort Colors',
        'Threadfast Apparel',
        'M&O', // Adding M&O brand
        'Richardson',
        'YP Classics',
        'Valucap',
      ];
      // Category IDs: 21=T-Shirts, 36=Hoodies, 400=Crewnecks, 38=Full-Zips, 56=Long Sleeves, 11=Headwear, 64=Tank Tops
      // Removed: 9=Youth
      const selectedCategories = ['21', '36', '400', '38', '56', '11', '64'];

      // Debug: Count filtering stages
      let debugCounts = {
        total: data.length,
        brandMatch: 0,
        categoryMatch: 0,
        afterYouthFilter: 0,
        headwearFiltered: 0,
        final: 0,
      };

      const filteredData = data
        .filter((item) => {
          const brandMatch =
            selectedBrands.includes(item.BrandName) ||
            selectedBrands.includes(item.brandName);

          if (brandMatch) debugCounts.brandMatch++;

          const categoryMatch =
            item.categories &&
            selectedCategories.some((catId) =>
              item.categories
                .split(',')
                .map((id) => id.trim())
                .includes(catId),
            );

          if (brandMatch && categoryMatch) debugCounts.categoryMatch++;

          // Filter out youth/baby products by title (category 9 filter removed - too aggressive)
          const title = (item.title || '').toLowerCase();
          const isYouthOrBaby =
            title.includes('youth') ||
            title.includes('toddler') ||
            title.includes('infant') ||
            title.includes('baby') ||
            title.includes('onesie');

          if (brandMatch && categoryMatch && !isYouthOrBaby)
            debugCounts.afterYouthFilter++;

          // REMOVED: 5-panel only filter was too restrictive - now allowing all headwear from category 11
          const passes = brandMatch && categoryMatch && !isYouthOrBaby;
          if (passes) debugCounts.final++;
          return passes;
        })
        .sort((a, b) => {
          // Sort by brand first, then by title - ensures consistent ordering
          if (a.brandName !== b.brandName) {
            return (a.brandName || '').localeCompare(b.brandName || '');
          }
          return (a.title || '').localeCompare(b.title || '');
        }); // Removed .slice() limit to include ALL matching products

      console.log('\n📊 FILTERING DEBUG (Local File):');
      console.log(`Total products: ${debugCounts.total}`);
      console.log(`✓ Brand match: ${debugCounts.brandMatch}`);
      console.log(`✓ Brand + Category match: ${debugCounts.categoryMatch}`);
      console.log(`✓ After youth filter: ${debugCounts.afterYouthFilter}`);
      console.log(`✗ Headwear filtered out: ${debugCounts.headwearFiltered}`);
      console.log(`✓ FINAL: ${debugCounts.final}`);
      console.log(
        `Loaded ${data.length} total products from local file, ${filteredData.length} from selected brands\n`,
      );

      filteredData.forEach((item) => {
        createNode({
          ...item,
          id: createNodeId(`ss-product-${item.styleID || item.styleCode}`),
          parent: null,
          children: [],
          internal: {
            type: 'SsProduct',
            contentDigest: createContentDigest(item),
          },
        });
      });

      return; // Exit early since we've loaded from local file
    } catch (fallbackErr) {
      console.error('Error loading local fallback data:', fallbackErr);
      return;
    }
  }

  try {
    const response = await fetch(BASE_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${basicAuth}`,
        'User-Agent': 'TagTeamPrinting/1.0',
        'Content-Type': 'application/json',
      },
    });

    console.log('🔍 S&S API Debug:');
    console.log('- Response status:', response.status);
    console.log('- Response statusText:', response.statusText);
    console.log('- Response headers:', Object.fromEntries(response.headers));

    // Check response status before parsing
    let data;
    if (!response.ok) {
      console.error(`S&S API error: ${response.status} ${response.statusText}`);
      console.error(
        'Response headers:',
        Object.fromEntries(response.headers.entries()),
      );
      console.warn(
        'S&S API request failed, falling back to local cached data...',
      );

      // Fall back to local JSON file
      try {
        const fs = require('fs');
        const pathModule = require('path');
        const filePath = pathModule.resolve('./data/all_styles_raw.json');
        const rawData = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(rawData);
        console.log(
          `Loaded ${data.length} products from local fallback file due to API error`,
        );
      } catch (fileError) {
        console.error('Failed to read local fallback file:', fileError);
        throw new Error(
          `S&S API failed (${response.status}) and no local fallback available`,
        );
      }
    } else {
      data = await response.json();
    }
    console.log('- Response data type:', typeof data);
    console.log(
      '- Response data preview:',
      JSON.stringify(data).substring(0, 200) + '...',
    );

    if (!Array.isArray(data)) {
      console.error('Unexpected S&S API response:', data);
      return;
    }

    // Filter for only your selected brands and categories
    const selectedBrands = [
      'Gildan',
      'JERZEES',
      'BELLA + CANVAS',
      'Next Level',
      'Hanes',
      'Comfort Colors',
      'Threadfast Apparel',
      'M&O', // Adding M&O brand
      // Hat specialist brands for headwear category
      'Richardson',
      'YP Classics',
      'Valucap',
    ]; // Popular, reliable brands with correct names
    // Category IDs: 21=T-Shirts, 36=Hoodies, 400=Crewnecks, 38=Full-Zips, 56=Long Sleeves, 11=Headwear, 64=Tank Tops
    // Removed: 9=Youth
    const selectedCategories = ['21', '36', '400', '38', '56', '11', '64'];

    // Debug: Count filtering stages
    let debugCounts = {
      total: data.length,
      brandMatch: 0,
      categoryMatch: 0,
      afterYouthFilter: 0,
      headwearFiltered: 0,
      final: 0,
    };

    const filteredData = data
      .filter((item) => {
        const brandMatch =
          selectedBrands.includes(item.BrandName) ||
          selectedBrands.includes(item.brandName);

        if (brandMatch) debugCounts.brandMatch++;

        const categoryMatch =
          item.categories &&
          selectedCategories.some((catId) =>
            item.categories
              .split(',')
              .map((id) => id.trim())
              .includes(catId),
          );

        if (brandMatch && categoryMatch) debugCounts.categoryMatch++;

        // Filter out youth/baby products by title (category 9 filter removed - too aggressive)
        const title = (item.title || '').toLowerCase();
        const isYouthOrBaby =
          title.includes('youth') ||
          title.includes('toddler') ||
          title.includes('infant') ||
          title.includes('baby') ||
          title.includes('onesie');

        if (brandMatch && categoryMatch && !isYouthOrBaby)
          debugCounts.afterYouthFilter++;

        // REMOVED: 5-panel only filter was too restrictive - now allowing all headwear from category 11
        const passes = brandMatch && categoryMatch && !isYouthOrBaby;
        if (passes) debugCounts.final++;
        return passes;
      })
      .sort((a, b) => {
        // Sort by brand first, then by title - ensures consistent ordering
        if (a.brandName !== b.brandName) {
          return (a.brandName || '').localeCompare(b.brandName || '');
        }
        return (a.title || '').localeCompare(b.title || '');
      }); // Removed .slice() limit to include ALL matching products

    console.log('\n📊 FILTERING DEBUG (API Data):');
    console.log(`Total products: ${debugCounts.total}`);
    console.log(`✓ Brand match: ${debugCounts.brandMatch}`);
    console.log(`✓ Brand + Category match: ${debugCounts.categoryMatch}`);
    console.log(`✓ After youth filter: ${debugCounts.afterYouthFilter}`);
    console.log(`✗ Headwear filtered out: ${debugCounts.headwearFiltered}`);
    console.log(`✓ FINAL: ${debugCounts.final}`);
    console.log(
      `Fetched ${data.length} total products, ${filteredData.length} from selected brands\n`,
    );

    filteredData.forEach((item) => {
      createNode({
        ...item,
        id: createNodeId(`ss-product-${item.styleID || item.styleCode}`),
        parent: null,
        children: [],
        internal: {
          type: 'SsProduct',
          contentDigest: createContentDigest(item),
        },
      });
    });
  } catch (err) {
    console.error('Error fetching S&S products:', err);
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;
  const fs = require('fs');

  const slugify = (value) =>
    (value || '')
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  const getBrandLogoUrl = (brandImage) => {
    if (!brandImage) return null;

    const fileName = (brandImage.match(/[^/\\]+$/) || [null])[0];
    if (!fileName) return null;

    const diskPath = path.resolve('./static/images/Brands', fileName);
    if (!fs.existsSync(diskPath)) return null;

    return `/images/Brands/${fileName}`;
  };

  try {
    // Create category pages with corrected categorization
    const categories = [
      { id: '21', slug: 't-shirts', name: 'T-Shirts' },
      { id: '36', slug: 'hoodies', name: 'Hoodies' },
      { id: '400', slug: 'crewnecks', name: 'Crewnecks' },
      { id: '38', slug: 'zip-ups', name: 'Full-Zips' },
      { id: '56', slug: 'long-sleeves', name: 'Long Sleeves' },
      { id: '11', slug: 'headwear', name: 'Headwear' },
      { id: '64', slug: 'tank-tops', name: 'Tank Tops' },
    ];

    categories.forEach((category) => {
      createPage({
        path: `/category/${category.slug}`,
        component: path.resolve(`src/templates/CategoryTemplate.jsx`),
        context: {
          categoryId: category.id,
          categorySlug: category.slug,
          categoryName: category.name,
        },
      });
    });

    // Query all products for creating individual product pages
    const result = await graphql(`
      query {
        allSsProduct {
          nodes {
            id
            styleID
            styleName
            brandName
            title
            description
            baseCategory
            categories
            styleImage
            brandImage
          }
        }
      }
    `);

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return;
    }

    // Create brand pages (curated list)
    const curatedBrands = new Set([
      'Gildan',
      'JERZEES',
      'BELLA + CANVAS',
      'Next Level',
      'Hanes',
      'Comfort Colors',
      'Threadfast Apparel',
      'M&O',
      'Richardson',
      'YP Classics',
      'Valucap',
    ]);

    const createdBrandPages = new Set();
    result.data.allSsProduct.nodes.forEach((product) => {
      const brandName = product.brandName;
      if (!brandName || !curatedBrands.has(brandName)) return;
      if (createdBrandPages.has(brandName)) return;

      const brandSlug = slugify(brandName);
      if (!brandSlug) return;

      const brandPath = `/brand/${brandSlug}/`;
      createPage({
        path: brandPath,
        component: path.resolve(`src/templates/BrandProductsTemplate.jsx`),
        context: {
          brandName,
          brandSlug,
          brandLogoUrl: getBrandLogoUrl(product.brandImage),
          canonicalPath: brandPath,
        },
      });

      createdBrandPages.add(brandName);
    });

    // Create individual product pages
    result.data.allSsProduct.nodes.forEach((product) => {
      const styleID = product.styleID;
      const baseName = product.title || product.styleName;
      const slug = slugify(baseName);

      if (!styleID || !slug) return;

      const legacyPath = product.styleName
        ? `/products/${product.styleName}`
        : null;
      const newPath = `/products/${styleID}/${slug}/`;

      createPage({
        path: newPath,
        component: path.resolve(`src/templates/SimpleProductPageTemplate.jsx`),
        context: {
          id: product.id,
          styleID: product.styleID,
          styleCode: product.styleName,
          brandName: product.brandName,
          slug,
          canonicalPath: newPath,
          initialProduct: {
            styleID: product.styleID,
            styleName: product.styleName,
            brandName: product.brandName,
            title: product.title,
            description: product.description,
            baseCategory: product.baseCategory,
            categories: product.categories,
            styleImage: product.styleImage,
            brandImage: product.brandImage,
          },
        },
      });

      if (legacyPath && legacyPath !== newPath) {
        createRedirect({
          fromPath: legacyPath,
          toPath: newPath,
          isPermanent: true,
          redirectInBrowser: true,
        });
      }

      console.log(
        `Created product page: ${newPath} (${product.brandName || ''} ${product.styleName || ''}, styleID: ${product.styleID})`,
      );
    });
  } catch (error) {
    console.error('Error in createPages:', error);
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type SsProduct implements Node {
      styleID: Int
      partNumber: String
      brandName: String
      styleName: String
      uniqueStyleName: String
      title: String
      description: String
      baseCategory: String
      categories: String
      catalogPageNumber: String
      newStyle: Boolean
      comparableGroup: Int
      companionGroup: Int
      brandImage: String
      styleImage: String
      prop65Chemicals: String
      noeRetailing: Boolean
      boxRequired: Boolean
      sustainableStyle: Boolean
    }
  `);
};

// Copy data files to public directory after build
exports.onPostBuild = async ({ reporter }) => {
  const fs = require('fs-extra');
  const path = require('path');

  try {
    // Ensure public/data directory exists
    await fs.ensureDir('./public/data');

    // Copy all_styles_raw.json to public directory
    await fs.copy(
      './data/all_styles_raw.json',
      './public/data/all_styles_raw.json',
    );

    // Copy reviews.json to public directory
    await fs.copy('./data/reviews.json', './public/data/reviews.json');

    // Provide a root-level sitemap.xml convenience file.
    // gatsby-plugin-sitemap outputs an index at public/sitemap/sitemap-index.xml.
    // Some tooling/checklists expect /sitemap.xml.
    const sitemapIndexPath = path.resolve('./public/sitemap/sitemap-index.xml');
    const sitemapRootPath = path.resolve('./public/sitemap.xml');
    if (await fs.pathExists(sitemapIndexPath)) {
      if (await fs.pathExists(sitemapRootPath)) {
        const existing = await fs.stat(sitemapRootPath);
        if (existing.isDirectory()) {
          await fs.remove(sitemapRootPath);
        }
      }
      await fs.copy(sitemapIndexPath, sitemapRootPath);
    }

    reporter.info('Successfully copied data files to public directory');
  } catch (error) {
    reporter.error('Failed to copy data files:', error);
  }
};

// Defer SSR for client-only pages
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // Defer upload page from SSR (client-only, requires token parameter)
  if (page.path.match(/^\/upload/)) {
    page.defer = true;
    createPage(page);
  }
};
