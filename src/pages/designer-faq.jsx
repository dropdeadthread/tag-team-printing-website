import React from "react";
import Layout from "../components/Layout";
import { Link } from "gatsby";

const DesignerFAQ = () => {
  return (
    <Layout>
      <div
        style={{
          backgroundImage: "url(/images/website-blank-ripped-comic-page.png)",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          padding: "4rem 2rem",
          color: "#f5f5f5",
          fontFamily: "'Bebas Neue', 'Impact', sans-serif",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            textAlign: "center",
            marginBottom: "2rem",
            letterSpacing: "2px",
            textTransform: "uppercase",
            borderBottom: "4px solid #222",
            display: "inline-block",
            paddingBottom: "0.5rem",
          }}
        >
          Designer FAQ
        </h1>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            backgroundColor: "rgba(10, 10, 10, 0.85)",
            padding: "2rem",
            border: "2px solid #111",
            boxShadow: "0 0 20px rgba(0,0,0,0.6)",
          }}
        >
          {/* QUOTES & PRICING */}
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#0070d1" }}>How do I get a quote?</h2>
            <p>
              The fastest way to get an accurate quote is to fill out our <Link to="/contact" style={{ color: "#0070d1", fontWeight: "bold" }}>contact form</Link> with your design details, garment choices, and quantities. For custom projects outside standard products, you can also email us directly.
            </p>
            <Link
              to="/contact"
              style={{
                display: "inline-block",
                backgroundColor: "#0070d1",
                color: "#fff",
                padding: "0.6rem 1.2rem",
                fontWeight: "bold",
                marginTop: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Get a Quote
            </Link>
          </section>

          {/* DESIGN SERVICES */}
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#0070d1" }}>Do you offer design help?</h2>
            <p>
              Absolutely. Whether you need your existing artwork prepped for print or want a full custom design from scratch, our in-house designers can help. Technical file prep starts <strong>at $25/hr</strong>, while full creative projects start <strong>at $50/hr</strong>.
            </p>
          </section>

          {/* TURNAROUND */}
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#0070d1" }}>What's your turnaround time?</h2>
            <p>
              Standard production time is typically <strong>5–7 business days</strong> after art approval and receiving garments. During peak seasons (April–November), turnaround can extend to <strong>10–15 business days</strong>.
            </p>
          </section>

          {/* FILE SUBMISSION */}
          <section style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.8rem", color: "#0070d1" }}>What file formats do you accept?</h2>
            <p>
              For best results, send vector files: <code>.AI</code>, <code>.EPS</code>, or <code>.PDF</code> with text converted to outlines. For raster designs, send layered <code>.PSD</code> files at 300 DPI at actual print size.
            </p>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default DesignerFAQ;
