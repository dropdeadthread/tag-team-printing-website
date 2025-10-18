// src/hooks/useSpecs.js
import { useState, useEffect } from 'react';

const BASE_URL = 'https://api-ca.ssactivewear.com/v2';

export function useSpecs(styleNumber) {
  const [specs, setSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSpecs() {
      try {
        // Use environment variables for credentials
        const username =
          process.env.GATSBY_SNS_API_USERNAME || process.env.SNS_API_USERNAME;
        const apiKey =
          process.env.GATSBY_SNS_API_KEY || process.env.SNS_API_KEY;

        if (!username || !apiKey) {
          throw new Error('SNS API credentials not configured');
        }

        const authHeader = 'Basic ' + btoa(`${username}:${apiKey}`);

        const response = await fetch(`${BASE_URL}/specs/${styleNumber}`, {
          headers: { Authorization: authHeader },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch specs');
        }

        const data = await response.json();
        setSpecs(data);
      } catch (err) {
        setError(err.message);
        setSpecs(null);
      } finally {
        setLoading(false);
      }
    }

    if (styleNumber) fetchSpecs();
  }, [styleNumber]);

  return { specs, loading, error };
}
