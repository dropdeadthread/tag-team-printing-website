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
        const username = '419372';
        const apiKey = '5d49715b-56f6-433b-9b45-380862878174';
        const authHeader = 'Basic ' + btoa(`${username}:${apiKey}`);

        const response = await fetch(`${BASE_URL}/specs/${styleNumber}`, {
          headers: { Authorization: authHeader }
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
