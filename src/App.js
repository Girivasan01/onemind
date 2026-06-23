import React from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/PublicLayout";
import Home from "./pages/Home.js";
import About from "./pages/About";
import JoinRequest from "./pages/JoinRequest";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AddCategory from "./pages/admin/AddCategory";
import AddLocation from "./pages/admin/AddLocation";
import ManageCustomers from "./pages/admin/ManageCustomers";
import CustomerForm from "./pages/admin/CustomerForm";
import ViewJoinRequests from "./pages/admin/ViewJoinRequests";
import SearchResults from "./pages/SearchResults";
import ShopDetails from "./pages/ShopDetails";
import SendEnquiry from "./pages/SendEnquiry.jsx";
import Gallery from "./pages/Gallery";
import Articles from "./pages/Articles";
import AdminEnquiries from "./pages/admin/AdminEnquiries.jsx";
import ManageArticles from "./pages/admin/ManageArticles";
import ArticleForm from "./pages/admin/ArticleForm";
import ManageGallery from "./pages/admin/ManageGallery";
import GalleryForm from "./pages/admin/GalleryForm";
import ArticleDetail from "./pages/ArticleDetail";
import GalleryDetail from "./pages/GalleryDetail";
import "./App.css";

function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {/* Public pages with shared Header & Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:slug" element={<GalleryDetail />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/join" element={<JoinRequest />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/:locationSlug/:categorySlug/:businessSlug" element={<ShopDetails />} />
          <Route path="/search/category/:categorySlug/:businessSlug" element={<ShopDetails />} />
          <Route path="/business/:slug" element={<ShopDetails />} />
          <Route path="/shop/:slug" element={<ShopDetails />} />
          <Route path="/enquiry/:shopId" element={<SendEnquiry />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-location" element={<AddLocation />} />
          <Route path="customers" element={<ManageCustomers />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/edit/:id" element={<CustomerForm />} />
          <Route path="view-join-requests" element={<ViewJoinRequests />} />
          <Route path="AdminEnquiries" element={<AdminEnquiries />} />
          <Route path="articles" element={<ManageArticles />} />
          <Route path="articles/new" element={<ArticleForm />} />
          <Route path="articles/edit/:id" element={<ArticleForm />} />
          <Route path="gallery" element={<ManageGallery />} />
          <Route path="gallery/new" element={<GalleryForm />} />
          <Route path="gallery/edit/:id" element={<GalleryForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
