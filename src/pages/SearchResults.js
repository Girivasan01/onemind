import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiSearch } from "react-icons/fi";
import { BASE_URL } from "../api";
import "./SearchResults.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const SearchResults = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const q = params.get("q") || "";
  const categoryParam = params.get("category") || "";
  const locationParam = params.get("location") || "";

  // Build display text for the search bar
  const searchDisplayText = q || categoryParam || "Search";

  // Rewrite ObjectID params to slugs using results data
  useEffect(() => {
    if (loading || results.length === 0) return;

    let needsUpdate = false;
    const newSearchParams = new URLSearchParams();
    if (q) newSearchParams.set("q", q);

    const firstResult = results[0];

    if (categoryParam && /^[0-9a-fA-F]{24}$/.test(categoryParam)) {
      const slug = firstResult.category?.slug;
      if (slug) {
        newSearchParams.set("category", slug);
        needsUpdate = true;
      }
    } else if (categoryParam) {
      newSearchParams.set("category", categoryParam);
    }

    if (locationParam && /^[0-9a-fA-F]{24}$/.test(locationParam)) {
      const slug = firstResult.location?.slug;
      if (slug) {
        newSearchParams.set("location", slug);
        needsUpdate = true;
      }
    } else if (locationParam) {
      newSearchParams.set("location", locationParam);
    }

    if (needsUpdate) {
      navigate(`/search?${newSearchParams.toString()}`, { replace: true });
    }
  }, [loading, results, categoryParam, locationParam, q, navigate]);

  // Fetch paginated results
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        // Resolve category slug → ID
        let categoryId = categoryParam;
        if (categoryParam && !/^[0-9a-fA-F]{24}$/.test(categoryParam)) {
          try {
            const catRes = await fetch(`${BASE_URL}/categories/slug/${encodeURIComponent(categoryParam)}`);
            if (catRes.ok) {
              const catData = await catRes.json();
              categoryId = catData._id;
            }
          } catch (err) { /* ignore */ }
        }

        // Resolve location slug → ID
        let locationId = locationParam;
        if (locationParam && !/^[0-9a-fA-F]{24}$/.test(locationParam)) {
          try {
            const locRes = await fetch(`${BASE_URL}/locations/slug/${encodeURIComponent(locationParam)}`);
            if (locRes.ok) {
              const locData = await locRes.json();
              locationId = locData._id;
            }
          } catch (err) { /* ignore */ }
        }

        const url = new URL(`${BASE_URL}/customers`);
        if (q) url.searchParams.append("q", q);
        if (categoryId) url.searchParams.append("category", categoryId);
        if (locationId) url.searchParams.append("location", locationId);
        url.searchParams.append("page", page);
        url.searchParams.append("limit", 10);

        const res = await fetch(url);
        const data = await res.json();

        setResults(data.results || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [q, categoryParam, locationParam, page]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="sr-page">
      <Helmet>
        <title>Search Results | OneMind Market</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Search Bar Display */}
      <div className="sr-search-bar">
        <FiSearch className="sr-search-icon" size={18} />
        <span className="sr-search-text">{searchDisplayText}</span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="sr-loading">
          <div className="sr-spinner" />
          <p>Searching...</p>
        </div>
      ) : results.length === 0 ? (
        /* Empty State */
        <div className="sr-empty">
          <div className="sr-empty-icon">
            <FiSearch size={32} />
            <span className="sr-empty-x">&times;</span>
          </div>
          <h2>No results found</h2>
          <p>
            We couldn't find any items matching your current search.
            Try adjusting your filters or search terms.
          </p>
          <button className="sr-back-btn" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      ) : (
        <>
          {/* Results List */}
          <div className="sr-results">
            {results.map((r) => (
              <div key={r._id} className="sr-card">
                <div className="sr-card-image">
                  {r.shopPhoto ? (
                    <img
                      src={`${UPLOADS_URL}/${r.shopPhoto}`}
                      alt={r.shopName}
                    />
                  ) : (
                    <div className="sr-card-no-image">No Image</div>
                  )}
                </div>
                <div className="sr-card-info">
                  {r.category?.name && (
                    <span className="sr-badge">{r.category.name}</span>
                  )}
                  <h3 className="sr-card-name">{r.shopName}</h3>
                  {r.shopDescription && (
                    <p className="sr-card-desc">
                      {r.shopDescription.length > 120
                        ? r.shopDescription.slice(0, 120) + "..."
                        : r.shopDescription}
                    </p>
                  )}
                </div>
                <div className="sr-card-action">
                  <button
                    className="sr-view-btn"
                    onClick={() =>
                      window.open(
                        `/${r.location?.slug || "unknown"}/${r.category?.slug || "uncategorized"}/${r.slug}`,
                        "_blank"
                      )
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sr-pagination">
              <button
                className="sr-page-btn sr-page-arrow"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                &lt;
              </button>
              {getPageNumbers().map((p) => (
                <button
                  key={p}
                  className={`sr-page-btn ${p === page ? "sr-page-active" : ""}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="sr-page-btn sr-page-arrow"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
