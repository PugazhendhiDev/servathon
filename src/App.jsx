import React from "react";
import { Route, Routes } from "react-router";
import ScrollToTop from "./utils/scrollToTop";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Home from "./pages/home";
import Page404 from "./pages/page404";
import EventRegistration from "./pages/eventRegistration";

function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/event-registration" element={<EventRegistration />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
