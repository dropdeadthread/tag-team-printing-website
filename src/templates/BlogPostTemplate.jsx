/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 4rem 2rem 2rem 2rem;
  position: relative;
`;

const ContentCard = styled.div`
  max-width: 860px;
  margin: 4.5rem auto 0 auto;
  background: rgba(255, 245, 209, 0.95);
  border: 3px solid #2563eb;
  box-shadow:
    0 0 20px rgba(37, 99, 235, 0.15),
    inset 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 2.5rem 2rem;
  font-family: 'Georgia', serif;
  color: #1a1a2e;
  line-height: 1.7;
`;

const BackLink = styled(Link)`
  display: inline-block;
  color: #2563eb;
  font-family: 'Arial', sans-serif;
  font-size: 0.9rem;
  text-decoration: none;
  margin-bottom: 1.5rem;

  &:hover {
    text-decoration: underline;
  }
`;

const PostMeta = styled.div`
  font-family: 'Arial', sans-serif;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const KeywordTag = styled.span`
  background: #e0e7ff;
  color: #2563eb;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.8rem;
`;

const PostTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  line-height: 1.2;
`;

const PostBody = styled.div`
  h2 {
    font-family: 'HawlersEightRough', 'Impact', sans-serif;
    color: #1a1a2e;
    font-size: 1.3rem;
    margin: 2rem 0 0.75rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h3 {
    font-family: 'Arial', sans-serif;
    font-weight: bold;
    color: #2563eb;
    font-size: 1.05rem;
    margin: 1.5rem 0 0.5rem 0;
  }

  p {
    margin-bottom: 1rem;
  }

  ul,
  ol {
    margin: 0.5rem 0 1rem 1.5rem;
  }

  ul li,
  ol li {
    margin-bottom: 0.4rem;
  }

  strong {
    color: #1a1a2e;
  }

  a {
    color: #2563eb;
  }
`;

const CTABox = styled.div`
  margin-top: 2.5rem;
  padding: 1.5rem;
  background: #2563eb;
  border-radius: 8px;
  text-align: center;
  color: #fff;
`;

const CTALink = styled.a`
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #fff;
  color: #2563eb;
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background: #f0f4ff;
  }
`;

function inlineFormat(text) {
  const segments = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return segments.map((seg, i) => {
    if (/^\*\*[^*]+\*\*$/.test(seg)) {
      return <strong key={i}>{seg.slice(2, -2)}</strong>;
    }
    const link = seg.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      return (
        <a key={i} href={link[2]}>
          {link[1]}
        </a>
      );
    }
    return seg;
  });
}

function renderMarkdown(markdown) {
  if (!markdown) return null;
  const blocks = markdown.split(/\n\n+/);

  return blocks
    .map((block, i) => {
      const b = block.trim();
      if (!b) return null;

      // Skip H1 — displayed separately as PostTitle
      if (/^# /.test(b)) return null;

      if (/^## /.test(b)) {
        return <h2 key={i}>{b.replace(/^## /, '')}</h2>;
      }

      if (/^### /.test(b)) {
        return <h3 key={i}>{b.replace(/^### /, '')}</h3>;
      }

      if (/^[-*] /m.test(b)) {
        const items = b
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => /^[-*] /.test(l));
        if (items.length) {
          return (
            <ul key={i}>
              {items.map((item, j) => (
                <li key={j}>{inlineFormat(item.replace(/^[-*] /, ''))}</li>
              ))}
            </ul>
          );
        }
      }

      if (/^\d+\. /m.test(b)) {
        const items = b
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => /^\d+\. /.test(l));
        if (items.length) {
          return (
            <ol key={i}>
              {items.map((item, j) => (
                <li key={j}>{inlineFormat(item.replace(/^\d+\. /, ''))}</li>
              ))}
            </ol>
          );
        }
      }

      // Paragraph — join continued lines
      const lines = b
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      return (
        <p key={i}>
          {lines.map((line, j) => (
            <React.Fragment key={j}>
              {j > 0 && ' '}
              {inlineFormat(line)}
            </React.Fragment>
          ))}
        </p>
      );
    })
    .filter(Boolean);
}

const BlogPostTemplate = ({ pageContext }) => {
  const { post } = pageContext;

  const formattedDate = post.date
    ? new Date(post.date + 'T12:00:00').toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Tag Team Printing',
      url: 'https://tagteamprints.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tag Team Printing',
      url: 'https://tagteamprints.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tagteamprints.com/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tagteamprints.com/blog/${post.slug}/`,
    },
    description: post.excerpt || '',
    keywords: post.keyword || '',
  };

  return (
    <Layout>
      <SEO
        title={`${post.title} | Tag Team Printing`}
        description={post.excerpt || post.title}
        url={`/blog/${post.slug}/`}
        keywords={post.keyword || ''}
        schema={schema}
      />
      <PageContainer>
        <ContentCard>
          <BackLink to="/blog">← Back to Blog</BackLink>
          <PostMeta>
            {formattedDate && <span>{formattedDate}</span>}
            {post.keyword && <KeywordTag>{post.keyword}</KeywordTag>}
          </PostMeta>
          <PostTitle>{post.title}</PostTitle>
          <PostBody>{renderMarkdown(post.content)}</PostBody>
          <CTABox>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>
              Ready to get your order started?
            </p>
            <CTALink href="/order">Get a Free Quote</CTALink>
          </CTABox>
        </ContentCard>
      </PageContainer>
    </Layout>
  );
};

export default BlogPostTemplate;
