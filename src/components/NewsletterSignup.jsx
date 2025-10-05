// NewsletterSignup.jsx
import React, { useState } from "react";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/newsletter-signup.js", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(res.ok ? "Subscribed!" : data.error || "Error");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" />
      <button type="submit">Subscribe</button>
      {msg && <div>{msg}</div>}
    </form>
  );
};

export default NewsletterSignup;