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
  Activity,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ClipboardList,
  FileSpreadsheet,
  Heart,
  LayoutDashboard,
  Menu,
  PawPrint,
  Settings2,
  ShieldCheck,
  Stethoscope,
  UsersRound,
  X,
} from "lucide-react";

import {
  BRAND,
} from "../data/siteData.js";

import {
  useBookings,
} from "../context/BookingContext.jsx";

const NAV_GROUPS = [
  {
    title:
      "FRONT DESK / WORKSPACE",

    items: [
      {
        to: "/clinic",
        label: "Dashboard",
        icon: LayoutDashboard,
        end: true,
        number: "01",
      },
      {
        to: "/clinic/appointments",
        label: "Appointment Desk",
        icon: ClipboardList,
        number: "02",
      },
      {
        to: "/clinic/schedule",
        label: "Daily Schedule",
        icon: CalendarDays,
        number: "03",
      },
      {
        to: "/clinic/services",
        label: "Care Services",
        icon: Stethoscope,
        number: "04",
      },
    ],
  },
  {
    title: "BUSINESS INTELLIGENCE",

    items: [
      {
        to: "/clinic/analytics",
        label: "Analytics",
        icon: BarChart3,
        end: true,
        number: "05",
      },
      {
        to: "/clinic/analytics/services",
        label: "Service Insights",
        icon: Heart,
        number: "06",
      },
      {
        to: "/clinic/analytics/team",
        label: "Team Workload",
        icon: UsersRound,
        number: "07",
      },
      {
        to: "/clinic/analytics/reports",
        label: "Reports",
        icon: FileSpreadsheet,
        number: "08",
      },
    ],
  },
];

const NAV_ITEMS =
  NAV_GROUPS.flatMap(
    (group) => group.items
  );

export default function ClinicLayout() {
  const { pathname } = useLocation();

  const {
    requests,
    activeCount,
  } = useBookings();

  const [menuOpen, setMenuOpen] =
    useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onEscape(event) {
      if (
        event.key === "Escape"
      ) {
        setMenuOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      onEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        onEscape
      );
  }, []);

  const currentPage =
    NAV_ITEMS.find(
      (item) =>
        item.to === pathname
    )?.label || "Clinic Operations";

  function skipToMain(event) {
    event.preventDefault();

    document
      .getElementById(
        "main-content"
      )
      ?.focus();
  }

  return (
    <div className="pkc-shell">
      <a
        href="#main-content"
        className="pk-skip-link"
        onClick={skipToMain}
      >
        Skip to main content
      </a>

      {/* MOBILE OVERLAY */}

      <button
        type="button"
        className={`pkc-scrim ${
          menuOpen
            ? "is-open"
            : ""
        }`}
        aria-label="Close clinic navigation"
        onClick={() =>
          setMenuOpen(false)
        }
      />

      {/* SIDEBAR */}

      <aside
        className={`pkc-sidebar ${
          menuOpen
            ? "is-open"
            : ""
        }`}
      >
        <div className="pkc-brand">
          <div className="pkc-brand-icon">
            <PawPrint size={22} />
          </div>

          <div>
            <strong>
              PAW & KIND.
            </strong>

            <small>
              CLINIC OPERATIONS
            </small>
          </div>

          <button
            type="button"
            className="pkc-sidebar-close"
            aria-label="Close clinic menu"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <X size={20} />
          </button>
        </div>

        {NAV_GROUPS.map(
          (group) => (
            <div
              key={group.title}
              className="pkc-sidebar-group"
            >
              <span className="pkc-sidebar-caption">
                {group.title}
              </span>

              <nav
                className="pkc-nav"
                aria-label={
                  group.title
                }
              >
                {group.items.map(
                  (item) => {
                    const Icon =
                      item.icon;

                    return (
                      <NavLink
                        key={
                          item.to
                        }
                        to={
                          item.to
                        }
                        end={
                          item.end
                        }
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className={({
                          isActive,
                        }) =>
                          `pkc-nav-link ${
                            isActive
                              ? "is-active"
                              : ""
                          }`
                        }
                      >
                        <Icon size={18} />

                        <span>
                          {item.label}
                        </span>

                        <small>
                          {item.number}
                        </small>
                      </NavLink>
                    );
                  }
                )}
              </nav>
            </div>
          )
        )}

        <div className="pkc-side-grow" />

        {/* DEMO STATS */}

        <div className="pkc-sidebar-stat">
          <span>
            <Activity size={15} />
            ACTIVE DEMO REQUESTS
          </span>

          <strong>
            {activeCount}
          </strong>

          <small>
            {requests.length}
            {" "}total browser
            records
          </small>
        </div>

        {/* QUICK LINKS */}

        <div className="pkc-side-links">
          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <ArrowLeft size={16} />
            Back to Website
          </Link>

          <Link
            to="/request"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <CalendarDays size={16} />
            New Demo Request
          </Link>

          <Link
            to="/visits"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <Heart size={16} />
            Pet Parent Visits
          </Link>

          <Link
            to="/demo-settings"
            onClick={() =>
              setMenuOpen(false)
            }
          >
            <Settings2 size={16} />
            Demo Settings
          </Link>
        </div>

        <p className="pkc-attribution">
          {BRAND.attribution}
        </p>
      </aside>

      {/* WORKSPACE */}

      <div className="pkc-workspace">
        <header className="pkc-topbar">
          <div className="pkc-topbar-left">
            <button
              type="button"
              className="pkc-menu-button"
              aria-label="Open clinic navigation"
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen(true)
              }
            >
              <Menu size={22} />
            </button>

            <div>
              <small>
                PET WELLNESS /
                DEMO CONTROL CENTER
              </small>

              <strong>
                {currentPage}
              </strong>
            </div>
          </div>

          <div className="pkc-demo-pill">
            <ShieldCheck size={16} />
            BROWSER DEMO
          </div>
        </header>

        <main
          id="main-content"
          className="pkc-main"
          tabIndex={-1}
        >
          <Outlet />
        </main>

        <footer className="pkc-footer">
          <span>
            <PawPrint size={16} />
            PAW & KIND. /
            OPERATIONS
          </span>

          <span>
            {BRAND.attribution}
          </span>
        </footer>
      </div>
    </div>
  );
}