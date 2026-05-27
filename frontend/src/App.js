import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import About from "./pages/About";
import JoinRequest from "./pages/JoinRequest";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AddCategory from "./pages/admin/AddCategory";
import AddLocation from "./pages/admin/AddLocation";
import AddCustomer from "./pages/admin/AddCustomer";
import ViewJoinRequests from "./pages/admin/ViewJoinRequests";
import SearchResults from "./pages/SearchResults";
import ShopDetails from "./pages/ShopDetails";
import SendEnquiry from "./pages/SendEnquiry.jsx";
import AdminEnquiries from "./pages/admin/AdminEnquiries.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/join" element={<JoinRequest />} />

        <Route path="/search" element={<SearchResults />} />
        <Route path="/shop/:slug" element={<ShopDetails />} />
        <Route path="/enquiry/:shopId" element={<SendEnquiry />} />


        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-location" element={<AddLocation />} />
          <Route path="add-customer" element={<AddCustomer />} />
          <Route path="view-join-requests" element={<ViewJoinRequests />} />
          <Route path="AdminEnquiries" element={< AdminEnquiries />} />
          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
