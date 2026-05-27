import React from "react";
import { FaHandshake, FaSeedling, FaUsers } from "react-icons/fa";
import { MdLocationOn, MdTrendingUp } from "react-icons/md";
import "./about.css";

const About = () => {
  return (
    <div className="about-page">
      
      <section className="about-hero">
        <h1>About One Mind Market</h1><br></br>
              <img src="/onemindDesign.gif" alt="img" height="80px" width="300px" /><br></br><br></br>
        <p className="about-tagline">
          A referral-driven search ecosystem rooted in trust, culture, and collaboration.
        </p>
      </section>

      {/* MAIN CONTENT */}
      <section className="about-content">
        <p>
          <strong>One Mind Market</strong> is a referral-driven ecosystem for native
          entrepreneurs, local business owners, and young creators who believe
          in building from their roots.
        </p>

        <p>
          It brings people together through trust, shared values, and real
          collaboration — forming meaningful connections that grow into
          partnerships, communities, and long-term impact.
        </p>

        <p>
          By blending entrepreneurship with cultural pride and collective growth,
          One Mind Market supports a new generation of builders who strengthen
          local economies while staying connected to their identity.
        </p>
      </section>

      {/* CORE VALUES */}
      <section className="about-values">

        <div className="value-card">
          <FaHandshake className="value-icon" />
          <h3>Trust-Based Referrals</h3>
          <p>
            Every listing is built on real connections, recommendations, and
            credibility.
          </p>
        </div>

        <div className="value-card">
          <FaSeedling className="value-icon" />
          <h3>Rooted Entrepreneurship</h3>
          <p>
            Grow businesses without losing cultural identity or local values.
          </p>
        </div>

        <div className="value-card">
          <FaUsers className="value-icon" />
          <h3>Community First</h3>
          <p>
            We build ecosystems, not just directories — people matter first.
          </p>
        </div>

      </section>

      {/* IMPACT STRIP */}
      <section className="about-impact">
        <div className="impact-item">
          <MdLocationOn />
          <span>Local Businesses Empowered</span>
        </div>

        <div className="impact-item">
          <MdTrendingUp />
          <span>Organic Growth Through Referrals</span>
        </div>
      </section>

    </div>
  );
};

export default About;
