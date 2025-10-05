import * as React from 'react'
import Layout from '../components/Layout'
import { Link } from 'gatsby'

const NotFoundPage = () => {
  return (
    <Layout>
      <div style={{ 
        textAlign: 'center', 
        paddingTop: '180px', 
        paddingBottom: '3rem',
        color: '#fff5d1' 
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Page Not Found</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Sorry, we couldn't find what you were looking for.
        </p>
        <Link 
          to="/" 
          style={{ 
            background: '#c32b14', 
            color: '#fff5d1', 
            padding: '1rem 2rem', 
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          Go Home
        </Link>
      </div>
    </Layout>
  )
}

export default NotFoundPage
