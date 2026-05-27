import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";

import "./ShopDetails.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const ShopDetails = () => {
  const { slug } = useParams();
  const [shop, setShop] = useState(null);
  const [photos1, setPhotos1] = useState([]);
  const [photos2, setPhotos2] = useState([]);
  const [photos3, setPhotos3] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchShop() {
      setLoading(true);
      try {
        // Determine if slug param is an ObjectId
        const isObjectId = (s) => /^[0-9a-fA-F]{24}$/.test(s);
        let customer = null;
        if (isObjectId(slug)) {
          const res = await fetch(`${BASE_URL}/customers/${slug}`);
          if (res.ok) customer = await res.json();
        } else {
          const res = await fetch(`${BASE_URL}/customers/slug/${encodeURIComponent(slug)}`);
          if (res.ok) customer = await res.json();
        }

        if (!customer) {
          setShop(null);
          setPhotos1([]);
          setPhotos2([]);
          setPhotos3([]);
          return;
        }

        setShop(customer);

        // fetch three photo groups separately for the three sliders using the resolved id
        const base = `${BASE_URL}/customers/${customer._id}/photos`;
        const [g1, g2, g3] = await Promise.all([
          fetch(`${base}?group=1`).then(r => (r.ok ? r.json() : [])).catch(() => []),
          fetch(`${base}?group=2`).then(r => (r.ok ? r.json() : [])).catch(() => []),
          fetch(`${base}?group=3`).then(r => (r.ok ? r.json() : [])).catch(() => [])
        ]);
        setPhotos1(Array.isArray(g1) ? g1 : []);
        setPhotos2(Array.isArray(g2) ? g2 : []);
        setPhotos3(Array.isArray(g3) ? g3 : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) fetchShop();
  }, [slug]);

  if (loading) return <p className="loading">Loading...</p>;
  if (!shop) return <p className="not-found">Shop not found.</p>;

  return (
    <div className="shop-details-container">

      <div className="shop-header">
        
      <img src={`${UPLOADS_URL}/${shop.shopPhoto}`} alt="business_logo" className="shop-main-image" />

        <div className="shop-info">

          <h1 className="shop_name">{shop.shopName}</h1>
          <div className="tags">
            <span>{shop.category?.name}</span>
            <span>{shop.location?.name}</span>
          </div>

          <div className="shop-short-details">
            <p><strong>Phone:</strong> {shop.shopPhone}</p>
            <p><strong>Email:</strong> {shop.email}</p>
            <p><strong>Address:</strong> {shop.address}</p>
            <p>
              <strong>Website:</strong>{' '}
              <a
                href={shop.website?.startsWith('http') ? shop.website : `https://${shop.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {shop.website}
              </a>
            </p>
            <button
          className="enquiry-btn"
          onClick={() => navigate(`/enquiry/${shop._id}`)}
        >
          Send Enquiry
        </button>
          </div>
        </div>
      </div>

      {shop.shopDescription && (
        <div className="shop-description-section">
          <h2>Business Description</h2>
          <p>{shop.shopDescription}</p>
        </div>
      )}

      {shop.shopArticle && (
        <div className="shop-article-section">
          <h2>Shop Article</h2>
          <p>{shop.shopArticle}</p>
        </div>
      )}

      <ThreeSliders photos1={photos1} photos2={photos2} photos3={photos3} />

      <div className="details-section">
        <h2>Owner Details</h2>
        <OwnerDetailsToggle shop={shop} />
      </div>

    </div>
  );
};

export default ShopDetails;

function Slider({ photos, label }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!photos || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [photos.length]);

  if (!photos || photos.length === 0) {
    return (
      <div className="slider-group empty">
        <div className="slider-placeholder">No images</div>
      </div>
    );
  }

  const goPrev = () => setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const goNext = () => setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <div className="slider-group">
      <div className="slider-single">
        <img
          src={`${UPLOADS_URL}/${photos[currentIndex]}`}
          alt={`shop-photo-${currentIndex}`}
          className="slider-image-cover"
        />
      </div>
    </div>
  );
}

function ThreeSliders({ photos1, photos2, photos3 }) {
  return (
    <div className="image-slider-section">
      <h3>Business Gallery</h3>
      <div className="three-sliders">
        <Slider photos={photos1} label="Gallery A" />
        <Slider photos={photos2} label="Gallery B" />
        <Slider photos={photos3} label="Gallery C" />
      </div>
    </div>
  );
}

function OwnerDetailsToggle({ shop }) {
  const [visible, setVisible] = useState(false);
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;
    if (visible) {
      // expand to content height
      container.style.maxHeight = content.scrollHeight + 'px';
      // allow inner to animate in
      requestAnimationFrame(() => content.classList.add('show'));
    } else {
      // hide inner then collapse
      content.classList.remove('show');
      setTimeout(() => {
        if (container) container.style.maxHeight = '0px';
      }, 220);
    }
  }, [visible]);

  return (
    <div className="owner-details-section">
      <button className="view-owner-btn" onClick={() => setVisible(v => !v)} aria-expanded={visible}>
        {visible ? 'Hide Owner Details' : 'View Owner Details'}
      </button>

      <div className="owner-container" ref={containerRef} style={{ maxHeight: 0 }}>
        {/* <h2>Owner Details</h2> */}
        <div className="owner-card" ref={contentRef}>
          {shop.ownerPhoto && (
            <img src={`${UPLOADS_URL}/${shop.ownerPhoto}`} alt="owner" className="owner-image" />
          )}
          <div>
            <p><strong>Owner Name:</strong> {shop.ownerName}</p>
            <p><strong>Owner Phone:</strong> {shop.ownerPhone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
