// ContactForm.jsx
import React, { useState } from "react";

const ContactForm = () => {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [msg, setMsg] = useState("");

  const handleChange = e => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/contact-submit.js", {
      method: "POST",
      body: JSON.stringify(fields),
    });
    const data = await res.json();
    setMsg(res.ok ? "Message sent!" : data.error || "Error");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={fields.name} onChange={handleChange} placeholder="Name" />
      <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" />
      <textarea name="message" value={fields.message} onChange={handleChange} placeholder="Message" />
      <button type="submit">Send</button>
      {msg && <div>{msg}</div>}
    </form>
  );
};

export default ContactForm;