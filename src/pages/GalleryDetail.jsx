import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
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

function Slider({ media, title }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const timerRef = useRef(null);

  const currentItem = media[currentIndex];

  // Stop current media before switching slides
  const stopCurrentMedia = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (iframeRef.current) {
      try {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          "*"
        );
      } catch (e) {
        // ignore cross-origin errors
      }
    }
  }, []);

  const goToSlide = useCallback(
    (idx) => {
      stopCurrentMedia();
      setCurrentIndex(idx);
    },
    [stopCurrentMedia]
  );

  const goPrev = useCallback(() => {
    goToSlide(currentIndex === 0 ? media.length - 1 : currentIndex - 1);
  }, [currentIndex, media.length, goToSlide]);

  const goNext = useCallback(() => {
    goToSlide(currentIndex === media.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, media.length, goToSlide]);

  // Auto-rotate only on image slides
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (media.length <= 1) return;
    if (currentItem && currentItem.type !== "image") return; // pause auto-rotation on video/youtube

    timerRef.current = setInterval(() => {
      setCurrentIndex((i) => (i === media.length - 1 ? 0 : i + 1));
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [media, currentItem]);

  if (!media || media.length === 0) return null;

  const renderSlide = (item, idx) => {
    if (item.type === "video") {
      return (
        <video
          ref={idx === currentIndex ? videoRef : null}
          key={`video-${idx}`}
          src={`${UPLOADS_URL}/${item.url}`}
          controls
          className="gallery-detail-slider-media"
          preload="metadata"
        />
      );
    }
    if (item.type === "youtube") {
      const ytId = extractYoutubeId(item.url);
      return (
        <iframe
          ref={idx === currentIndex ? iframeRef : null}
          key={`yt-${idx}-${currentIndex}`}
          src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1`}
          title={`${title || "Video"} - ${idx + 1}`}
          className="gallery-detail-slider-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }
    // Default: image
    return (
      <img
        key={`img-${idx}`}
        src={`${UPLOADS_URL}/${item.url}`}
        alt={`${title || "Gallery"} - ${idx + 1}`}
        className="gallery-detail-slider-img"
      />
    );
  };

  if (media.length === 1) {
    return (
      <div className="gallery-detail-slider">{renderSlide(media[0], 0)}</div>
    );
  }

  return (
    <div className="gallery-detail-slider">
      <button className="gallery-slider-btn gallery-slider-prev" onClick={goPrev}>
        &#8249;
      </button>
      {renderSlide(currentItem, currentIndex)}
      <button className="gallery-slider-btn gallery-slider-next" onClick={goNext}>
        &#8250;
      </button>
      <div className="gallery-slider-dots">
        {media.map((item, idx) => (
          <span
            key={idx}
            className={`gallery-slider-dot ${idx === currentIndex ? "active" : ""} ${item.type !== "image" ? "gallery-slider-dot-video" : ""}`}
            onClick={() => goToSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}

const GalleryDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`${BASE_URL}/gallery/slug/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [slug]);

  if (loading) return <p className="gallery-loading">Loading...</p>;
  if (!item) {
    return (
      <div className="gallery-page">
        <div className="gallery-detail-container">
          <p className="gallery-empty">Gallery item not found.</p>
          <Link to="/gallery" className="gallery-back-link">
            &larr; Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  // Build media array: prefer media[], fall back to images[]
  const media =
    item.media && item.media.length > 0
      ? item.media
      : (item.images || []).map((img) => ({ type: "image", url: img }));

  // For OG image: prefer first image-type item, then YouTube thumbnail
  let ogImage = null;
  const firstImage = media.find((m) => m.type === "image");
  if (firstImage) {
    ogImage = `${UPLOADS_URL}/${firstImage.url}`;
  } else {
    const firstYt = media.find((m) => m.type === "youtube");
    if (firstYt) {
      const ytId = extractYoutubeId(firstYt.url);
      if (ytId) ogImage = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  const canonicalUrl = `https://onemindmarket.in/gallery/${item.slug}`;

  return (
    <div className="gallery-page">
      <Helmet>
        <title>{item.title} | Gallery | OneMind Market</title>
        <meta name="description" content={item.caption || item.title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={item.title} />
        <meta property="og:description" content={item.caption || item.title} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="gallery-detail-container">
        <Link to="/gallery" className="gallery-back-link">
          &larr; Back to Gallery
        </Link>

        {media.length > 0 && <Slider media={media} title={item.title} />}

        <h1 className="gallery-detail-title">{item.title}</h1>

        {item.caption && (
          <p className="gallery-detail-caption">{item.caption}</p>
        )}

        {item.tags && item.tags.length > 0 && (
          <div className="gallery-detail-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="gallery-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryDetail;
