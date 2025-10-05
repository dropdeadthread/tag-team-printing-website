// Helper to get category navigation links

export const categoryLinks = [
  {
    id: "21",
    slug: "t-shirts", 
    name: "T-Shirts",
    path: "/category/t-shirts"
  },
  {
    id: "36",
    slug: "hoodies",
    name: "Hoodies",
    path: "/category/hoodies"
  },
  {
    id: "400",
    slug: "crewnecks",
    name: "Crewnecks",
    path: "/category/crewnecks"
  },
  {
    id: "38",
    slug: "zip-ups",
    name: "Full-Zips", 
    path: "/category/zip-ups"
  },
  {
    id: "56",
    slug: "long-sleeves",
    name: "Long Sleeves",
    path: "/category/long-sleeves"
  },
  {
    id: "11", 
    slug: "headwear",
    name: "Headwear",
    path: "/category/headwear"
  },
  {
    id: "64",
    slug: "tank-tops", 
    name: "Tank Tops",
    path: "/category/tank-tops"
  }
];

export const getCategoryBySlug = (slug) => {
  return categoryLinks.find(cat => cat.slug === slug);
};

export const getCategoryById = (id) => {
  return categoryLinks.find(cat => cat.id === id);
};
