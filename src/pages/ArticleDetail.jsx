import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../api";
import "./Articles.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`${BASE_URL}/articles/slug/${slug}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <p className="articles-loading">Loading article...</p>;
  if (!article) {
    return (
      <div className="articles-page">
        <div className="article-detail-container">
          <p className="articles-empty">Article not found.</p>
          <Link to="/articles" className="article-back-link">Back to Articles</Link>
        </div>
      </div>
    );
  }

  const imageUrl = article.featuredImage ? `${UPLOADS_URL}/${article.featuredImage}` : null;
  const canonicalUrl = `https://onemindmarket.in/articles/${article.slug}`;

  return (
    <div className="articles-page">
      <Helmet>
        <title>{article.title} | OneMind Market</title>
        <meta name="description" content={article.excerpt || article.title} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt || article.title} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt || article.title} />
        {imageUrl && <meta name="twitter:image" content={imageUrl} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt || article.title,
            image: imageUrl || undefined,
            author: { "@type": "Person", name: article.author || "Admin" },
            datePublished: article.createdAt,
            dateModified: article.updatedAt,
            publisher: {
              "@type": "Organization",
              name: "OneMind Market",
              url: "https://onemindmarket.in"
            }
          })}
        </script>
      </Helmet>

      <div className="article-detail-container">
        <Link to="/articles" className="article-back-link">
          &larr; Back to Articles
        </Link>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={article.title}
            className="article-detail-image"
          />
        )}

        <h1 className="article-detail-title">{article.title}</h1>

        <div className="article-detail-meta">
          <span>{article.author || "Admin"}</span>
          <span>&middot;</span>
          <span>{new Date(article.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="article-detail-tags">
            {article.tags.map((tag, i) => (
              <span key={i} className="article-tag-chip">{tag}</span>
            ))}
          </div>
        )}

        <div
          className="article-detail-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
