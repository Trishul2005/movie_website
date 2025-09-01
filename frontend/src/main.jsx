import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from "./pages/homepage/Homepage.jsx";
import LoginPage from "./pages/login/LoginPage.jsx";
import MovieDetails from "./pages/detailedView/MovieDetails.jsx"; // You need to create this
import TempLogin from "./pages/login/TempLogin.jsx"; // Temporary login page
import Watchlist from "./pages/watchlist/Watchlist.jsx";
import AiRec from "./pages/aiRec/aiRec.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import ProtectedRoute from "./ProtectedRoute";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
  {/* Public route */}
  <Route path="/" element={<TempLogin />} />

  {/* Protected routes */}
  <Route
    path="/homepage"
    element={
      <ProtectedRoute>
        <Homepage />
      </ProtectedRoute>
    }
  />
  <Route
    path="/:mediaType/:id"
    element={
      <ProtectedRoute>
        <MovieDetails />
      </ProtectedRoute>
    }
  />
  <Route
    path="/watchlist"
    element={
      <ProtectedRoute>
        <Watchlist />
      </ProtectedRoute>
    }
  />
  <Route
    path="/airecommendation"
    element={
      <ProtectedRoute>
        <AiRec />
      </ProtectedRoute>
    }
  />
</Routes>
    </BrowserRouter>
  </StrictMode>
);
