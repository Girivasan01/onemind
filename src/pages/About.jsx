import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FaWhatsapp } from "react-icons/fa";
import "./about.css";

const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || "919000000000";

const About = () => {
  const [form, setForm] = useState({
    name: "",
    brandName: "",
    businessCategory: "",
    contactNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWhatsAppRedirect = (e) => {
    e.preventDefault();

    const message = encodeURIComponent(
      `*New Enquiry from OneMind Market Website*\n\n` +
      `*Name:* ${form.name}\n` +
      `*Brand Name:* ${form.brandName}\n` +
      `*Business Category:* ${form.businessCategory}\n` +
      `*Contact Number:* ${form.contactNumber}\n` +
      `*Email:* ${form.email}`
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="about-page">
      <Helmet>
        <title>About Us | OneMind Market</title>
        <meta
          name="description"
          content="Learn about OneMind Market - a referral-driven ecosystem for native entrepreneurs, local business owners, and young creators."
        />
        <link rel="canonical" href="https://onemindmarket.in/about" />
      </Helmet>

      {/* SECTION 1: ABOUT US */}
      <section className="about-hero">
        <h1>ABOUT US</h1>
        <img
          src="/onemindDesign.gif"
          alt="OneMind Design"
          className="about-hero-gif"
        />
        <p className="about-tagline">
          A referral-driven search ecosystem rooted in trust, culture, and
          collaboration.
        </p>
      </section>

      {/* SECTION 2: FOUNDER'S MESSAGE */}
      <section className="about-section founder-section">
        <h2>FOUNDER'S MESSAGE</h2>
        <div className="founder-content">
          <p>
            At One Mind Market, my vision is to build a strong ecosystem where
            native entrepreneurs can connect, collaborate, and grow together. I
            believe that when local business owners support each other with
            trust, knowledge, and genuine opportunities, the entire business
            community becomes stronger.
          </p>
          <p>
            One Mind Market was created as a platform exclusively for native
            entrepreneurs. It is not designed for franchise chains or large
            corporate companies, but for independent business owners who are
            building and growing their own ventures.
          </p>
          <p>
            Our goal is to create a trusted community where entrepreneurs
            exchange business referrals, share knowledge, and help each other
            grow in a structured and meaningful way. Through the One Mind Market
            search engine, people can easily discover verified local businesses
            within our network.
          </p>
          <p>
            I strongly believe that empowering native entrepreneurs is the key
            to building a stronger and more self-reliant business community. One
            Mind Market is our step toward making that vision a reality.
          </p>
          <p className="founder-sign-off">
            Regards,
            <br />
            <strong>Suresh Bose</strong>
            <br />
            Founder &ndash; One Mind Market
          </p>
        </div>
      </section>

      {/* SECTION 3: WHAT IS ONE MIND MARKET? */}
      <section className="about-section whatisomm-section">
        <h2>WHAT IS ONE MIND MARKET?</h2>
        <div className="whatisomm-content">
          <p>
            <strong>One Mind Market</strong> is a business networking, learning,
            and discovery platform created exclusively for native entrepreneurs
            who run and grow their own independent businesses. The purpose of the
            platform is to bring local business owners into one trusted ecosystem
            where they can connect, collaborate, and grow together.
          </p>
          <p>
            Within the community, entrepreneurs build strong professional
            relationships and support each other by sharing genuine business
            referrals. This creates consistent business opportunities and helps
            members expand their networks through trust and credibility. One Mind
            Market also focuses on entrepreneur development through dedicated
            knowledge-sharing sessions where members learn practical strategies,
            real business experiences, and growth insights from fellow
            entrepreneurs.
          </p>
          <p>
            To strengthen visibility for local businesses, the One Mind Market
            Search Engine allows people to easily discover verified businesses
            and services within the network. This helps customers find reliable
            local entrepreneurs while giving members a powerful digital presence.
          </p>
          <p>
            Unlike platforms that include large corporate companies or franchise
            chains, One Mind Market is designed only for native entrepreneurs who
            are building their own ventures. By supporting independent businesses
            and encouraging collaboration, the platform aims to strengthen the
            local economy, create more opportunities, and generate employment
            through the growth of native entrepreneurship.
          </p>
        </div>
      </section>

      {/* SECTION 4: CONTACT US */}
      <section className="about-section contact-section">
        <h2>CONTACT US</h2>
        <form className="contact-form" onSubmit={handleWhatsAppRedirect}>
          <div className="contact-field">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="brandName">Brand Name</label>
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={form.brandName}
              onChange={handleChange}
              placeholder="Your brand or business name"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="businessCategory">Business Category</label>
            <input
              type="text"
              id="businessCategory"
              name="businessCategory"
              value={form.businessCategory}
              onChange={handleChange}
              placeholder="e.g., Restaurant, Salon, Builder"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
            />
          </div>

          <div className="contact-field">
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <button type="submit" className="whatsapp-btn">
            <FaWhatsapp className="whatsapp-icon" />
            Send via WhatsApp
          </button>
        </form>
      </section>
    </div>
  );
};

export default About;
