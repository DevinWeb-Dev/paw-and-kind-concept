import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  Menu,
  PawPrint,
  X,
} from "lucide-react";

import {
  BRAND,
} from "../data/siteData.js";

import {
  useBookings,
} from "../context/BookingContext.jsx";

const NAV_LINKS = [
  {
    to: "/",
    label: "Home",
    end: true,
  },
  {
    to: "/services",
    label: "Our Services",
  },
  {
    to: "/team",
    label: "Our Team",
  },
  {
    to: "/about",
    label: "Our Story",
  },
  {
    to: "/pet-hub",
    label: "Pet Hub",
  },
  {
    to: "/visits",
    label: "My Visits",
  },
];

function BrandLogo({
  onClick,
}) {
  return (
    <Link
      to="/"
      className="pk-logo"
      onClick={onClick}
      aria-label="PAW & KIND. Homepage"
    >
      <span className="pk-logo-symbol">
        <PawPrint size={22} />
      </span>

      <span className="pk-logo-copy">
        <strong>
          PAW & KIND.
        </strong>

        <small>
          {BRAND.subtitle}
        </small>
      </span>
    </Link>
  );
}

export default function SiteLayout() {
  const { pathname } = useLocation();

  const {
    activeCount,
  } = useBookings();

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function closeOnEscape(event) {
      if (
        event.key === "Escape"
      ) {
        setMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      closeOnEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        closeOnEscape
      );
  }, []);

  function skipToContent(event) {
    event.preventDefault();

    document
      .getElementById(
        "main-content"
      )
      ?.focus();
  }

  return (
    <div className="pk-app">
      <a
        href="#main-content"
        className="pk-skip-link"
        onClick={skipToContent}
      >
        Skip to content
      </a>

      {/* ANNOUNCEMENT BAR */}

      <div className="pk-announcement">
        <Heart
          size={13}
          fill="currentColor"
        />

        <span>
          Thoughtful care for every
          little heartbeat.
        </span>

        <span className="pk-announcement-right">
          PET WELLNESS CONCEPT / PH
        </span>
      </div>

      {/* HEADER */}

      <header className="pk-header">
        <div className="pk-container pk-header-inner">
          <BrandLogo
            onClick={() =>
              setMenuOpen(false)
            }
          />

          <nav
            className={`pk-nav ${
              menuOpen
                ? "is-open"
                : ""
            }`}
            aria-label="Main navigation"
            id="pk-main-navigation"
          >
            {NAV_LINKS.map(
              (item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={({
                    isActive,
                  }) =>
                    `pk-nav-link ${
                      isActive
                        ? "is-active"
                        : ""
                    }`
                  }
                >
                  {item.label}

                  {item.to === "/visits" &&
                    activeCount >
                      0 && (
                      <span className="pk-nav-count">
                        {activeCount}
                      </span>
                    )}
                </NavLink>
              )
            )}

            <Link
              to="/request"
              className="pk-button pk-button-dark pk-mobile-cta"
              onClick={() =>
                setMenuOpen(false)
              }
            >
              Request a Visit
              <ArrowUpRight
                size={17}
              />
            </Link>
          </nav>

          <div className="pk-header-actions">
            <Link
              to="/request"
              className="pk-button pk-button-dark pk-header-cta"
            >
              <CalendarDays
                size={17}
              />

              Request a Visit

              <ArrowUpRight
                size={16}
              />
            </Link>

            <button
              type="button"
              className="pk-menu-toggle"
              onClick={() =>
                setMenuOpen(
                  (current) =>
                    !current
                )
              }
              aria-expanded={
                menuOpen
              }
              aria-controls="pk-main-navigation"
              aria-label={
                menuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
            >
              {menuOpen ? (
                <X size={23} />
              ) : (
                <Menu size={23} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}

      <main
        id="main-content"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      {/* FOOTER */}

      <footer className="pk-footer">
        <div className="pk-container">
          <div className="pk-footer-top">
            <div className="pk-footer-brand">
              <span className="pk-kicker pk-kicker-light">
                THE LITTLE THINGS MATTER
              </span>

              <h2>
                A WHOLE LOT
                <br />
                OF <em>HEART.</em>
              </h2>

              <p>
                A thoughtful pet
                wellness concept
                designed to make
                caring for companions
                feel welcoming
                and clear.
              </p>

              <Link
                to="/request"
                className="pk-button pk-button-coral"
              >
                Explore a Demo Visit

                <ArrowUpRight
                  size={17}
                />
              </Link>
            </div>

            <div className="pk-footer-columns">
              <div>
                <h3>
                  EXPLORE
                </h3>

                <Link to="/">
                  Home
                </Link>

                <Link to="/services">
                  Services
                </Link>

                <Link to="/team">
                  Our Team
                </Link>

                <Link to="/about">
                  Our Story
                </Link>

                <Link to="/pet-hub">
                  Pet Parent Hub
                </Link>
              </div>

              <div>
                <h3>
                  YOUR EXPERIENCE
                </h3>

                <Link to="/request">
                  Demo Appointment
                </Link>

                <Link to="/visits">
                  My Requests
                </Link>

                <Link to="/clinic">
                  Clinic Portal Demo
                </Link>

                <Link to="/demo-settings">
                  Demo Settings
                </Link>

                <span>
                  Monday–Saturday
                </span>

                <span>
                  Sample hours:
                  9 AM–5 PM
                </span>
              </div>
            </div>
          </div>

          <div className="pk-footer-bottom">
            <div>
              <strong>
                PAW & KIND.
              </strong>

              <span>
                Fictional veterinary
                website concept.
              </span>
            </div>

            <p>
              {BRAND.attribution}
            </p>

            <span>
              ©{" "}
              {new Date().getFullYear()}
              {" "}
              PAW & KIND. CONCEPT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}