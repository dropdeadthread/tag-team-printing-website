// src/utils/loadSquareSdk.js
export async function loadSquareSdk() {
    if (typeof window === 'undefined') return; // SSR Guard
  
    if (!document.getElementById('square-sdk')) {
      const script = document.createElement('script');
      script.id = 'square-sdk';
      script.src = "https://web.squarecdn.com/v1/square.js";
      script.async = true;
      document.body.appendChild(script);
  
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }
  }
  