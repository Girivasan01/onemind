import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { createArticle, updateArticle } from "../../services/adminService";
import { BASE_URL } from "../../api";
import "./Admin.css";
import "./ArticleForm.css";

const SERVER_URL = BASE_URL.replace("/api", "");
const UPLOADS_URL = `${SERVER_URL}/uploads`;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold", "italic", "underline", "strike",
  "list",
  "blockquote", "code-block",
  "link", "image",
  "align",
];

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("Admin");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchArticle = async () => {
        try {
          const res = await fetch(`${BASE_URL}/articles/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
          });
          const data = await res.json();
          setTitle(data.title || "");
          setExcerpt(data.excerpt || "");
          setContent(data.content || "");
          setStatus(data.status || "draft");
          setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
          setAuthor(data.author || "Admin");
          setExistingImage(data.featuredImage || "");
        } catch (err) {
          console.error(err);
          alert("Failed to load article");
        }
      };
      fetchArticle();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title is required");
    if (!content.trim()) return alert("Content is required");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("excerpt", excerpt);
      formData.append("content", content);
      formData.append("status", status);
      formData.append("tags", tags);
      formData.append("author", author);
      if (featuredImage) formData.append("featuredImage", featuredImage);

      if (isEdit) {
        await updateArticle(id, formData);
        alert("Article updated");
      } else {
        await createArticle(formData);
        alert("Article created");
      }
      navigate("/admin/articles");
    } catch (err) {
      console.error(err);
      alert(err.message || "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  const getPreviewImageSrc = () => {
    if (featuredImage) return URL.createObjectURL(featuredImage);
    if (existingImage) return `${UPLOADS_URL}/${existingImage}`;
    return null;
  };

  return (
    <div className="admin-page">
      <h2 className="admin-title">{isEdit ? "Edit Article" : "Create Article"}</h2>

      <form onSubmit={handleSubmit} className="admin-form article-form">
        <label>Title *</label>
        <input
          className="admin-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          required
        />

        <label>Excerpt</label>
        <textarea
          className="admin-input"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary for cards & SEO (under 160 chars recommended)"
          rows={3}
          style={{ resize: "vertical" }}
        />

        <label>Content *</label>
        <div className="article-editor-wrapper">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            placeholder="Write your article content here..."
          />
        </div>

        <label>Status</label>
        <select
          className="admin-input"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label>Tags (comma-separated)</label>
        <input
          className="admin-input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. business, tips, local"
        />

        <label>Author</label>
        <input
          className="admin-input"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Author name"
        />

        <label>Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFeaturedImage(e.target.files[0] || null)}
          className="admin-input"
        />
        {existingImage && !featuredImage && (
          <img
            src={`${UPLOADS_URL}/${existingImage}`}
            alt={`${title || 'Article'} - Featured image`}
            style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 6, marginTop: 8 }}
          />
        )}

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button type="submit" className="admin-btn" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
          </button>
          <button
            type="button"
            className="admin-btn"
            style={{ backgroundColor: "#28a745" }}
            onClick={() => setShowPreview(true)}
          >
            Preview
          </button>
          <button
            type="button"
            className="admin-btn"
            style={{ backgroundColor: "#6c757d" }}
            onClick={() => navigate("/admin/articles")}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button className="preview-close" onClick={() => setShowPreview(false)}>
              &times;
            </button>
            <div className="preview-body">
              {getPreviewImageSrc() && (
                <img
                  src={getPreviewImageSrc()}
                  alt={title}
                  className="preview-image"
                />
              )}
              <h1 className="preview-title">{title || "Untitled"}</h1>
              {tags && (
                <div className="preview-tags">
                  {tags.split(",").map((t, i) => t.trim() && (
                    <span key={i} className="preview-tag">{t.trim()}</span>
                  ))}
                </div>
              )}
              <div
                className="preview-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleForm;
