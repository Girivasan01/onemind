import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiMapPin, FiGrid, FiSearch } from "react-icons/fi";
import { BASE_URL } from "../api";
import "./Home.css";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [categoriesByLocation, setCategoriesByLocation] = useState([]);
  const [locations, setLocations] = useState([]);

  const [q, setQ] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [showCategorySuggestions, setShowCategorySuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const navigate = useNavigate();

  /* Load Categories & Locations */
  useEffect(() => {
    fetch(`${BASE_URL}/categories`)
      .then(r => r.json())
      .then(setCategories)
      .catch(console.error);

    fetch(`${BASE_URL}/locations`)
      .then(r => r.json())
      .then(setLocations)
      .catch(console.error);
  }, []);

  /* Load categories based on selected location */
  useEffect(() => {
    if (!selectedLocation) {
      setCategoriesByLocation([]);
      return;
    }

    const fetchUrl = `${BASE_URL}/locations/${selectedLocation}/categories`;

    fetch(fetchUrl)
      .then(r => r.json())
      .then(list => {
        setCategoriesByLocation(list || []);
        if (selectedCategory) {
          const exists = list?.some(c => c._id === selectedCategory);
          if (!exists) {
            setSelectedCategory("");
            setCategoryInput("");
          }
        }
      })
      .catch(() => setCategoriesByLocation([]));
  }, [selectedLocation]);

  const resolveCategoryIdFromInput = () => {
    if (selectedCategory) return selectedCategory;
    const input = categoryInput.trim().toLowerCase();
    const matched = categories.find(c => c.name.toLowerCase() === input);
    return matched ? matched._id : "";
  };

  const doSearch = (overrideCategoryId) => {
    const params = new URLSearchParams();

    if (q) params.append("q", q);
    const catId = overrideCategoryId ?? resolveCategoryIdFromInput();
    if (catId) params.append("category", catId);
    if (selectedLocation) params.append("location", selectedLocation);

    navigate(`/search?${params}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    doSearch();
  };

  const filteredCategories = (selectedLocation ? categoriesByLocation : categories)
    .filter(c => c.name.toLowerCase().includes(categoryInput.toLowerCase()));

  return (
    <div className="home-page">
      <Helmet>
        <title>OneMind Market - Local Business Directory & Search Engine | Vellore</title>
        <meta name="description" content="OneMind Market is a referral-driven local business directory. Search and discover trusted local businesses, entrepreneurs, and creators." />
        <link rel="canonical" href="https://onemindmarket.in/" />
      </Helmet>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <img src="/onemindlogo.png" alt="OneMind Market" className="hero-logo" />
          <p className="hero-desc">
            One Mind Market is a powerful platform created exclusively for native entrepreneurs. Our mission is to strengthen the local economy by connecting independent business owners who are building and growing their own ventures. Members grow their businesses through trusted referrals, strong professional relationships, and mutual support within the community. The platform also promotes continuous learning where entrepreneurs share knowledge, real experiences, and practical strategies for business growth. Through the One Mind Market Search Engine, people can easily discover verified local businesses and services. This increases visibility for entrepreneurs while encouraging customers to support local brands. Our goal is to empower native entrepreneurs, create more opportunities, and generate employment within the local economy.
          </p>
          <div className="hero-buttons">
            <Link to="/join" className="btn-primary">Get Started Now</Link>
            <Link to="/about" className="btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>

      {/* SEARCH SECTION */}
      <section className="search-section">
        <div className="search-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-inputs">
              {/* Location */}
              <div className="search-field search-field--location">
                <FiMapPin className="search-field-icon" size={18} />
                <select
                  className="search-select"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {locations.map(l => (
                    <option key={l._id} value={l._id}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="search-field search-field--category">
                <FiGrid className="search-field-icon" size={18} />
                <input
                  className="search-input"
                  placeholder="Category (e.g. Tech, Food)"
                  value={categoryInput}
                  onChange={(e) => {
                    setCategoryInput(e.target.value);
                    setSelectedCategory("");
                    setShowCategorySuggestions(true);
                  }}
                  onFocus={() => setShowCategorySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                />

                {showCategorySuggestions && filteredCategories.length > 0 && (
                  <ul className="search-suggestions">
                    {filteredCategories.map(c => (
                      <li
                        key={c._id}
                        onMouseDown={() => {
                          setSelectedCategory(c._id);
                          setCategoryInput(c.name);
                          setShowCategorySuggestions(false);
                        }}
                      >
                        {c.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Search Button */}
              <button type="submit" className="search-btn">
                <FiSearch size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-card">
          <div className="cta-bg-pattern" />
          <h2 className="cta-title">
            Ready to scale your <br /> local brand?
          </h2>
          <p className="cta-desc">
            Join our community of native entrepreneurs who are transforming local businesses in global successes.
          </p>
          <Link to="/join" className="btn-cta">Get Started Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
