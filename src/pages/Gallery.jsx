import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../api";
import "./Gallery.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

function extractYoutubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function getMediaArray(item) {
  if (item.media && item.media.length > 0) return item.media;
  const imgs = item.images || (item.image ? [item.image] : []);
  return imgs.map((img) => ({ type: "image", url: img }));
}

function hasVideoContent(media) {
  return media.some((m) => m.type === "video" || m.type === "youtube");
}

function CardThumbnail({ media, title }) {
  // Prefer first image for thumbnail
  const firstImage = media.find((m) => m.type === "image");
  if (firstImage) {
    return (
      <div className="gallery-card-thumb-wrap">
        <img
          src={`${UPLOADS_URL}/${firstImage.url}`}
          alt={title}
          className="gallery-img-single"
        />
        {hasVideoContent(media) && (
          <span className="gallery-card-play-icon">&#9654;</span>
        )}
      </div>
    );
  }

  // Fallback: YouTube thumbnail
  const firstYt = media.find((m) => m.type === "youtube");
  if (firstYt) {
    const ytId = extractYoutubeId(firstYt.url);
    if (ytId) {
      return (
        <div className="gallery-card-thumb-wrap">
          <img
            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`}
            alt={title}
            className="gallery-img-single"
          />
          <span className="gallery-card-play-icon">&#9654;</span>
        </div>
      );
    }
  }

  // Fallback: video placeholder
  const firstVideo = media.find((m) => m.type === "video");
  if (firstVideo) {
    return (
      <div className="gallery-card-thumb-wrap gallery-card-video-placeholder">
        <span className="gallery-card-play-icon" style={{ position: "static", transform: "none" }}>&#9654;</span>
      </div>
    );
  }

  return null;
}

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState("");

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`${BASE_URL}/gallery`);
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  // Collect all unique tags for filter buttons
  const allTags = [...new Set(items.flatMap((item) => item.tags || []))];

  // Filter items by selected tag
  const filtered = activeTag
    ? items.filter((item) => (item.tags || []).includes(activeTag))
    : items;

  if (loading) return <p className="gallery-loading">Loading gallery...</p>;

  return (
    <div className="gallery-page">
      <Helmet>
        <title>Gallery | OneMind Market</title>
        <meta
          name="description"
          content="Browse curated photos and videos from OneMind Market."
        />
        <link rel="canonical" href="https://onemindmarket.in/gallery" />
      </Helmet>

      <div className="gallery-hero">
        <h1>Gallery</h1>
        <p>Browse our curated photo & video collection</p>
      </div>

      {/* Tag filter bar */}
      {allTags.length > 0 && (
        <div className="gallery-tags-bar">
          <button
            className={`gallery-tag-btn ${activeTag === "" ? "active" : ""}`}
            onClick={() => setActiveTag("")}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`gallery-tag-btn ${activeTag === tag ? "active" : ""}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="gallery-empty">No photos or videos available yet.</p>
      ) : (
        <div className="gallery-grid">
          {filtered.map((item) => {
            const media = getMediaArray(item);
            return (
              <Link
                key={item._id}
                to={`/gallery/${item.slug}`}
                className="gallery-card-link"
              >
                <div className="gallery-card">
                  <CardThumbnail media={media} title={item.title} />
                  <div className="gallery-card-info">
                    <h3>{item.title}</h3>
                    {item.caption && (
                      <p className="gallery-caption">{item.caption}</p>
                    )}
                    {item.tags && item.tags.length > 0 && (
                      <div className="gallery-tags">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="gallery-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Gallery;
