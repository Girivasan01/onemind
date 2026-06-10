import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BASE_URL } from "../api";
import "./Articles.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch(`${BASE_URL}/articles`);
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <p className="articles-loading">Loading articles...</p>;

  return (
    <div className="articles-page">
      <Helmet>
        <title>Articles | OneMind Market</title>
        <meta name="description" content="Read articles and stories from OneMind Market — tips, insights, and guides for local businesses." />
        <link rel="canonical" href="https://onemindmarket.in/articles" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Articles | OneMind Market",
            description: "Articles and stories from OneMind Market",
            url: "https://onemindmarket.in/articles",
            publisher: {
              "@type": "Organization",
              name: "OneMind Market",
              url: "https://onemindmarket.in"
            }
          })}
        </script>
      </Helmet>

      <div className="articles-hero">
        <h1>Articles</h1>
        <p>Stories and insights from our community</p>
      </div>

      {articles.length === 0 ? (
        <p className="articles-empty">No articles available yet.</p>
      ) : (
        <div className="articles-list">
          {articles.map((article) => (
            <div key={article._id} className="article-card">
              <Link to={`/articles/${article.slug}`} className="article-card-link">
                {article.featuredImage && (
                  <img
                    src={`${UPLOADS_URL}/${article.featuredImage}`}
                    alt={article.title}
                    className="article-thumbnail"
                  />
                )}
                <div className="article-content">
                  <h2>{article.title}</h2>
                  <div className="article-date">
                    {new Date(article.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  {article.tags && article.tags.length > 0 && (
                    <div className="article-tags">
                      {article.tags.map((tag, i) => (
                        <span key={i} className="article-tag-chip">{tag}</span>
                      ))}
                    </div>
                  )}
                  <p className="article-excerpt">
                    {article.excerpt
                      ? (article.excerpt.length > 250 ? article.excerpt.substring(0, 250) + "..." : article.excerpt)
                      : ""}
                  </p>
                  <span className="article-read-more">Read More</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Articles;
