import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    fetch(`${BASE_URL}/customers?${params}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          navigate(`/shop/${data[0].slug || data[0]._id}`);
        } else {
          navigate(`/search?${params}`);
        }
      })
      .catch(() => navigate(`/search?${params}`));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    doSearch();
  };

  return (
    <div className="home-page">
      <div className="home-hero">

        {/* TOP BAR */}
        <div className="home-topbar">

          {/* Left: Register */}
          <div className="topbar-left">
            <button
              className="register-btn"
              onClick={() => navigate("/join")}
            >
              Join as a Member
            </button>
          </div>

          {/* Center: Logo */}
          <div className="topbar-center">
            <a href="/about">
              <img
                src="/onemindlogo.png"
                alt="OneMind Logo"
                className="home-logo"
              />
            </a>
          </div>

          {/* Right: GIF */}
          <div className="topbar-right">
            <img
              src="/one_bbb.png"
              className="main-gif"
              alt="OneMind Animation"
            />
          </div>

        </div>
        <div className="text-wrapper-main">
        <p className="main-text">
          One Mind Market is a referral-driven ecosystem for native entrepreneurs, local business owners, and young creators who believe in building from their roots. It brings together people through trust, shared values, and real collaboration, creating meaningful connections that grow into partnerships, communities, and long-term impact. By blending entrepreneurship with cultural pride and collective growth, One Mind Market supports a new generation of builders who strengthen local economies while staying connected to their identity.
        </p></div>

        {/* SEARCH FORM */}
        <form className="search-form" onSubmit={handleSearch}>
          <div className="dropdowns">

            {/* Location */}
            <select
              className="custom-dropdown"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              {locations.map(l => (
                <option key={l._id} value={l._id}>{l.name}</option>
              ))}
            </select>

            {/* Category */}
            <div className="category-dropdown">
              <div className="category-input-wrapper">
                <input
                  className="category-input"
                  placeholder="Search Category (Ex: dentist, builder, etc..)"
                  value={categoryInput}
                  onChange={(e) => {
                    setCategoryInput(e.target.value);
                    setSelectedCategory("");
                    setShowCategorySuggestions(true);
                  }}
                  onFocus={() => setShowCategorySuggestions(true)}
                  onBlur={() => setTimeout(() => setShowCategorySuggestions(false), 150)}
                />

                <button
                  type="button"
                  className="category-search-btn"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    const catId = resolveCategoryIdFromInput();
                    doSearch(catId);
                  }}
                >
                  <img
                    src="https://images.freeimages.com/fic/images/icons/1262/amora/256/find.png"
                    alt="Search"
                  />
                </button>
              </div>

              {showCategorySuggestions && (
                <ul className="category-suggestions">
                  {(selectedLocation ? categoriesByLocation : categories)
                    .filter(c =>
                      c.name.toLowerCase().includes(categoryInput.toLowerCase())
                    )
                    .map(c => (
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

          </div>
        </form>

      </div>
    </div>
  );
};

export default Home;
