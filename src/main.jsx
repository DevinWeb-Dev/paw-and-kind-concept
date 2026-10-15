import React from "react";

import ReactDOM from "react-dom/client";

import {
  HashRouter,
} from "react-router-dom";

import App from "./App.jsx";

import {
  BookingProvider,
} from "./context/BookingContext.jsx";

import {
  PetProvider,
} from "./context/PetContext.jsx";

import {
  ClinicProvider,
} from "./context/ClinicContext.jsx";

// BATCH 1 — PUBLIC WEBSITE
import "./styles/base.css";
import "./styles/site.css";
import "./styles/booking.css";

// BATCH 2 — PET PARENT HUB
import "./styles/pet-parent.css";

// BATCH 3 — CLINIC OPERATIONS
import "./styles/clinic.css";

// BATCH 4 — BUSINESS INTELLIGENCE
import "./styles/clinic-analytics.css";

// BATCH 5 — FINAL POLISH
import "./styles/final-polish.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <HashRouter>
      <BookingProvider>
        <PetProvider>
          <ClinicProvider>
            <App />
          </ClinicProvider>
        </PetProvider>
      </BookingProvider>
    </HashRouter>
  </React.StrictMode>
);