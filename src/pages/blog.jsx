import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
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
`;

const PageTitle = styled.h1`
  font-family: 'HawlersEightRough', 'Impact', 'Arial Black', sans-serif;
  color: #2563eb;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PageSubtitle = styled.p`
  text-align: center;
  color: #6b7280;
  font-family: 'Arial', sans-serif;
  font-size: 0.95rem;
  margin-bottom: 2.5rem;
`;

const PostCard = styled.article`
  border-bottom: 1px solid rgba(37, 99, 235, 0.2);
  padding: 1.5rem 0;

  &:last-child {
    border-bottom: none;
  }
`;

const PostDate = styled.span`
  font-family: 'Arial', sans-serif;
  font-size: 0.8rem;
  color: #9ca3af;
  display: block;
  margin-bottom: 0.3rem;
`;

const PostTitle = styled.h2`
  font-family: 'HawlersEightRough', 'Impact', sans-serif;
  color: #1a1a2e;
  font-size: 1.3rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    color: #2563eb;
  }
`;

const PostExcerpt = styled.p`
  color: #374151;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  line-height: 1.6;
`;

const ReadMore = styled(Link)`
  color: #2563eb;
  font-family: 'Arial', sans-serif;
  font-size: 0.9rem;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-family: 'Arial', sans-serif;
`;

const BlogFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/blog-posts.json')
      .then((res) => res.json())
      .then((data) => {
        const published = (Array.isArray(data) ? data : []).filter(
          (p) => p.status === 'published',
        );
        published.sort((a, b) => new Date(b.date) - new Date(a.date));
        setPosts(published);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <SEO
        title="Blog | Tag Team Printing — Screen Printing Tips & Shop Notes"
        description="Screen printing tips, garment guides, and shop updates from Tag Team Printing in Cornwall, Ontario."
        url="/blog"
        keywords="screen printing tips, custom apparel guide, Cornwall Ontario printing, band merch advice"
      />
      <PageContainer>
        <ContentCard>
          <PageTitle>The Tag Team Blog</PageTitle>
          <PageSubtitle>
            Screen printing tips, garment guides, and notes from the shop in
            Cornwall, Ontario.
          </PageSubtitle>

          {!loading && posts.length === 0 && (
            <EmptyState>
              <p>First post coming soon.</p>
            </EmptyState>
          )}

          {posts.map((post) => {
            const date = post.date
              ? new Date(post.date + 'T12:00:00').toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : '';
            return (
              <PostCard key={post.slug}>
                {date && <PostDate>{date}</PostDate>}
                <PostTitle>
                  <Link to={`/blog/${post.slug}/`}>{post.title}</Link>
                </PostTitle>
                {post.excerpt && <PostExcerpt>{post.excerpt}</PostExcerpt>}
                <ReadMore to={`/blog/${post.slug}/`}>Read more →</ReadMore>
              </PostCard>
            );
          })}
        </ContentCard>
      </PageContainer>
    </Layout>
  );
};

export default BlogFeed;
