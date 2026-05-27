import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../api";
import "./SearchResults.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const SearchResults = () => {

  

  const [params] = useSearchParams();
  const [results, setResults] = useState([]);
  const [photosMap, setPhotosMap] = useState({});
  const [loading, setLoading] = useState(false);
    const [shop, setShop] = useState(null);
  const navigate = useNavigate();

  const q = params.get("q") || "";
  const categoryParam = params.get("category") || "";
  const locationParam = params.get("location") || "";

  useEffect(() => {
    async function updateUrlIfNeeded() {
      let needsUpdate = false;
      const newSearchParams = new URLSearchParams();
      if (q) newSearchParams.set("q", q);

      // Check category
      if (categoryParam && /^[0-9a-fA-F]{24}$/.test(categoryParam)) {
        // it's an ID, fetch the name
        try {
          const catRes = await fetch(`${BASE_URL}/categories/${categoryParam}`);
          if (catRes.ok) {
            const catData = await catRes.json();
            newSearchParams.set("category", catData.name.toLowerCase().replace(/\s+/g, '-'));
            needsUpdate = true;
          }
        } catch (err) {
          console.error('Failed to fetch category name', err);
        }
      } else if (categoryParam) {
        newSearchParams.set("category", categoryParam);
      }

      // Check location
      if (locationParam && /^[0-9a-fA-F]{24}$/.test(locationParam)) {
        // it's an ID, fetch the name
        try {
          const locRes = await fetch(`${BASE_URL}/locations/${locationParam}`);
          if (locRes.ok) {
            const locData = await locRes.json();
            newSearchParams.set("location", locData.name.toLowerCase().replace(/\s+/g, '-'));
            needsUpdate = true;
          }
        } catch (err) {
          console.error('Failed to fetch location name', err);
        }
      } else if (locationParam) {
        newSearchParams.set("location", locationParam);
      }

      if (needsUpdate) {
        navigate(`/search?${newSearchParams.toString()}`, { replace: true });
      }
    }
    updateUrlIfNeeded();
  }, [categoryParam, locationParam, q, navigate]);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        // resolve category param (could be ID or slug)
        let categoryId = categoryParam;
        if (categoryParam && !/^[0-9a-fA-F]{24}$/.test(categoryParam)) {
          // assume it's a slug; fetch category by slug first
          try {
            const catRes = await fetch(`${BASE_URL}/categories/slug/${encodeURIComponent(categoryParam)}`);
            if (catRes.ok) {
              const catData = await catRes.json();
              categoryId = catData._id;
            }
          } catch (err) {
            console.error('Failed to resolve category slug', err);
          }
        }

        // resolve location param (could be ID or slug)
        let locationId = locationParam;
        if (locationParam && !/^[0-9a-fA-F]{24}$/.test(locationParam)) {
          // assume it's a slug; fetch location by slug first
          try {
            const locRes = await fetch(`${BASE_URL}/locations/slug/${encodeURIComponent(locationParam)}`);
            if (locRes.ok) {
              const locData = await locRes.json();
              locationId = locData._id;
            }
          } catch (err) {
            console.error('Failed to resolve location slug', err);
          }
        }

        const url = new URL(`${BASE_URL}/customers`);
        if (q) url.searchParams.append("q", q);
        if (categoryId) url.searchParams.append("category", categoryId);
        if (locationId) url.searchParams.append("location", locationId);

        const res = await fetch(url);
        const data = await res.json();
        setResults(data);

        // Fetch photos for each result
        const photosPromises = data.map(async (r) => {
          const base = `${BASE_URL}/customers/${r._id}/photos`;
          const [g1, g2, g3] = await Promise.all([
            fetch(`${base}?group=1`).then(r => (r.ok ? r.json() : [])).catch(() => []),
            fetch(`${base}?group=2`).then(r => (r.ok ? r.json() : [])).catch(() => []),
            fetch(`${base}?group=3`).then(r => (r.ok ? r.json() : [])).catch(() => [])
          ]);
          return { id: r._id, photos1: g1, photos2: g2, photos3: g3 };
        });

        const photosResults = await Promise.all(photosPromises);
        const newPhotosMap = {};
        photosResults.forEach(({ id, photos1, photos2, photos3 }) => {
          newPhotosMap[id] = { photos1, photos2, photos3 };
        });
        setPhotosMap(newPhotosMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [q, categoryParam, locationParam]);

  return (
    <div className="search-results-container">

      <div className="search-header">
        <h2>Results</h2>
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <div className="results-list">
          {results.length === 0 ? (
            <p className="no-results">No results found.</p>
          ) : (
            results.map((r) => {
              const photos = photosMap[r._id] || { photos1: [], photos2: [], photos3: [] };
              return (
                <div key={r._id} className="shop-details-container" onClick={() => navigate(`/shop/${r.slug}`)} style={{ cursor: 'pointer' }}>

                  <div className="shop-header">
                    <img src={`${UPLOADS_URL}/${r.shopPhoto}`} alt="shop" className="shop-main-image" />

                    <div className="shop-info">
                      <h1 className="shop_name">{r.shopName}</h1>
                      <div className="tags">
                        <span>{r.category?.name}</span>
                        <span>{r.location?.name}</span>
                      </div>

                      <div className="shop-short-details">
                        <p><strong>Phone:</strong> {r.shopPhone}</p>
                        <p><strong>Email:</strong> {r.email}</p>
                        <p><strong>Address:</strong> {r.address}</p>
                        <p>
                          <strong>Website:</strong>{' '}
                          <a
                            href={r.website?.startsWith('http') ? r.website : `https://${r.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {r.website}
                          </a>
                        </p>
                        <button
                          className="enquiry-btn"
                          
                        >
                          Send Enquiry
                        </button>
                      </div>
                    </div>
                  </div>

                  {r.shopDescription && (
                    <div className="shop-description-section">
                      <h3>Business Description</h3>
                      <p className="business-description">{r.shopDescription}</p>
                    </div>
                  )}

                  {r.shopArticle && (
                    <div className="shop-article-section">
                      <h3>Business Article</h3>
                      <p className="business-article">{r.shopArticle}</p>
                    </div>
                  )}

                  <ThreeSliders photos1={photos.photos1} photos2={photos.photos2} photos3={photos.photos3} />

                  <div className="details-section">
                    <h2>Owner Details</h2>
                    <OwnerDetailsToggle shop={r} />
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

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
      container.style.maxHeight = content.scrollHeight + 'px';
      requestAnimationFrame(() => content.classList.add('show'));
    } else {
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

export default SearchResults;
