import {
  Link,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import {
  ArrowLeft,
  ClipboardList,
  PawPrint,
} from "lucide-react";

import SiteLayout from "./components/SiteLayout.jsx";

import PetParentLayout from "./components/PetParentLayout.jsx";

import ClinicLayout from "./components/ClinicLayout.jsx";

import ExperienceTools from "./components/ExperienceTools.jsx";

import DemoSettingsPage from "./pages/DemoSettingsPage.jsx";

import {
  HomePage,
  ServicesPage,
  TeamPage,
  AboutPage,
} from "./pages/PublicPages.jsx";

import {
  RequestVisitPage,
  MyVisitsPage,
} from "./pages/BookingPages.jsx";

import {
  PetDashboardPage,
  PetProfilesPage,
  WellnessJournalPage,
  CareRemindersPage,
} from "./pages/PetParentPages.jsx";

import {
  ClinicDashboardPage,
  ClinicAppointmentsPage,
  ClinicSchedulePage,
  ClinicServicesPage,
} from "./pages/ClinicPages.jsx";

import {
  ClinicAnalyticsLayout,
  ClinicAnalyticsOverviewPage,
  ClinicServiceInsightsPage,
  ClinicTeamWorkloadPage,
  ClinicReportsPage,
} from "./pages/ClinicAnalyticsPages.jsx";

function PublicExperience() {
  return (
    <>
      <SiteLayout />

      <Link
        to="/clinic"
        className="pkc-public-shortcut"
        title="Open Clinic Operations Demo"
      >
        <ClipboardList size={17} />
        CLINIC DEMO
      </Link>
    </>
  );
}

function NotFoundPage() {
  return (
    <section className="pk-not-found">
      <div className="pk-container">
        <PawPrint size={54} />

        <span className="pk-kicker">
          404 / WRONG TURN
        </span>

        <h1>
          PAWS FOR
          <br />
          <em>A MOMENT.</em>
        </h1>

        <p>
          Looks like this page
          wandered off. Let's
          find our way home.
        </p>

        <Link
          to="/"
          className="pk-button pk-button-dark"
        >
          <ArrowLeft size={18} />
          Back to Homepage
        </Link>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <ExperienceTools />

      <Routes>
        {/* PUBLIC WEBSITE */}

        <Route
          path="/"
          element={<PublicExperience />}
        >
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="services"
            element={<ServicesPage />}
          />

          <Route
            path="team"
            element={<TeamPage />}
          />

          <Route
            path="about"
            element={<AboutPage />}
          />

          {/* APPOINTMENTS */}

          <Route
            path="request"
            element={<RequestVisitPage />}
          />

          <Route
            path="visits"
            element={<MyVisitsPage />}
          />

          {/* DEMO MANAGEMENT */}

          <Route
            path="demo-settings"
            element={<DemoSettingsPage />}
          />

          {/* PET PARENT HUB */}

          <Route
            path="pet-hub"
            element={<PetParentLayout />}
          >
            <Route
              index
              element={<PetDashboardPage />}
            />

            <Route
              path="pets"
              element={<PetProfilesPage />}
            />

            <Route
              path="journal"
              element={<WellnessJournalPage />}
            />

            <Route
              path="reminders"
              element={<CareRemindersPage />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to="/pet-hub"
                  replace
                />
              }
            />
          </Route>

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Route>

        {/* CLINIC OPERATIONS */}

        <Route
          path="/clinic"
          element={<ClinicLayout />}
        >
          <Route
            index
            element={<ClinicDashboardPage />}
          />

          <Route
            path="appointments"
            element={<ClinicAppointmentsPage />}
          />

          <Route
            path="schedule"
            element={<ClinicSchedulePage />}
          />

          <Route
            path="services"
            element={<ClinicServicesPage />}
          />

          {/* CLINIC ANALYTICS */}

          <Route
            path="analytics"
            element={<ClinicAnalyticsLayout />}
          >
            <Route
              index
              element={
                <ClinicAnalyticsOverviewPage />
              }
            />

            <Route
              path="services"
              element={
                <ClinicServiceInsightsPage />
              }
            />

            <Route
              path="team"
              element={
                <ClinicTeamWorkloadPage />
              }
            />

            <Route
              path="reports"
              element={
                <ClinicReportsPage />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/clinic"
                replace
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
}