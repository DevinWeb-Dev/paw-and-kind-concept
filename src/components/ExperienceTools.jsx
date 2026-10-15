import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
} from "react-router-dom";

import {
  ArrowUp,
} from "lucide-react";

const PAGE_TITLES = {
  "/": "Home",
  "/services": "Pet Care Services",
  "/team": "Our Veterinary Team",
  "/about": "Our Story",
  "/request": "Request a Demo Visit",
  "/visits": "My Demo Visits",

  "/pet-hub": "Pet Parent Dashboard",
  "/pet-hub/pets": "My Pets",
  "/pet-hub/journal": "Wellness Journal",
  "/pet-hub/reminders": "Care Reminders",

  "/clinic": "Clinic Dashboard",
  "/clinic/appointments": "Appointment Desk",
  "/clinic/schedule": "Daily Schedule",
  "/clinic/services": "Service Management",

  "/clinic/analytics": "Clinic Analytics",
  "/clinic/analytics/services": "Service Insights",
  "/clinic/analytics/team": "Team Workload",
  "/clinic/analytics/reports": "Reports Center",

  "/demo-settings": "Demo Settings",
};

export default function ExperienceTools() {
  const { pathname } = useLocation();

  const previousPath = useRef(pathname);

  const [showBackToTop, setShowBackToTop] =
    useState(false);

  useEffect(() => {
    const pageName =
      PAGE_TITLES[pathname] ||
      "Pet Wellness Concept";

    document.title =
      `${pageName} | PAW & KIND.`;

    if (previousPath.current !== pathname) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });

      const main =
        document.getElementById(
          "main-content"
        );

      if (main) {
        main.focus({
          preventScroll: true,
        });
      }
    }

    previousPath.current = pathname;
  }, [pathname]);

  useEffect(() => {
    function updateScrollState() {
      setShowBackToTop(
        window.scrollY > 450
      );
    }

    updateScrollState();

    window.addEventListener(
      "scroll",
      updateScrollState,
      { passive: true }
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateScrollState
      );
    };
  }, []);

  function backToTop() {
    const reduceMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    window.scrollTo({
      top: 0,
      behavior: reduceMotion
        ? "instant"
        : "smooth",
    });
  }

  return (
    <>
      {showBackToTop && (
        <button
          type="button"
          className="pk5-back-to-top"
          aria-label="Back to top of page"
          title="Back to top"
          onClick={backToTop}
        >
          <ArrowUp size={21} />
          <span>TOP</span>
        </button>
      )}
    </>
  );
}