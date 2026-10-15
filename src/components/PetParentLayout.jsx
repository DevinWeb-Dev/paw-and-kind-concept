import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  Activity,
  Bell,
  BookOpen,
  Heart,
  LayoutDashboard,
  PawPrint,
  ShieldCheck,
} from "lucide-react";

import {
  usePets,
} from "../context/PetContext.jsx";

const LINKS = [
  {
    to: "/pet-hub",
    label: "Dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/pet-hub/pets",
    label: "My Pets",
    icon: PawPrint,
  },
  {
    to: "/pet-hub/journal",
    label: "Wellness Journal",
    icon: BookOpen,
  },
  {
    to: "/pet-hub/reminders",
    label: "Care Reminders",
    icon: Bell,
  },
];

export default function PetParentLayout() {
  const {
    pets,
    pendingReminders,
  } = usePets();

  return (
    <div className="pkp-root">
      <section className="pkp-cover">
        <div className="pk-container pkp-cover-inner">
          <div>
            <span className="pkp-eyebrow">
              <Heart
                size={16}
                fill="currentColor"
              />
              THE PET PARENT EXPERIENCE
            </span>

            <h1>
              THEIR LITTLE
              <br />
              <em>WORLD.</em>
            </h1>

            <p>
              A warm little space for
              your companions, everyday
              care, and the moments
              worth remembering.
            </p>
          </div>

          <div className="pkp-cover-mark">
            <PawPrint size={88} />

            <span>
              ALL THE
              <br />
              LITTLE THINGS.
            </span>
          </div>
        </div>
      </section>

      <div className="pkp-navigation-wrap">
        <div className="pk-container">
          <nav
            className="pkp-navigation"
            aria-label="Pet Parent Portal"
          >
            {LINKS.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `pkp-nav-item ${
                      isActive ? "is-active" : ""
                    }`
                  }
                >
                  <Icon size={18} />

                  {item.label}

                  {item.to.endsWith(
                    "/reminders"
                  ) &&
                    pendingReminders.length >
                      0 && (
                      <span className="pkp-nav-badge">
                        {
                          pendingReminders.length
                        }
                      </span>
                    )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pk-container pkp-content">
        <div className="pkp-status-strip">
          <span>
            <Activity size={16} />
            {pets.length} PET
            {pets.length === 1
              ? ""
              : "S"}{" "}
            IN YOUR DEMO HUB
          </span>

          <span>
            <ShieldCheck size={16} />
            BROWSER-LOCAL DEMO
          </span>
        </div>

        <Outlet />
      </div>

      <div className="pk-container">
        <div className="pkp-disclaimer">
          <ShieldCheck size={20} />

          <p>
            This Pet Parent Hub is a
            fictional portfolio demo.
            Records stay in this browser
            and are not reviewed by
            veterinary staff. Do not
            enter actual medical records
            or sensitive personal data.
          </p>
        </div>
      </div>
    </div>
  );
}