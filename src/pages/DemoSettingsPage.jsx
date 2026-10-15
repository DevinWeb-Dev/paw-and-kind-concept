import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowLeft,
  ArrowUpRight,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Database,
  Download,
  Heart,
  PawPrint,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

const MODULES = [
  {
    id: "visits",
    name: "Appointment Requests",
    description:
      "Demo appointments, request statuses, and appointment history.",
    key:
      "paw-and-kind-demo-visits-v1",
    icon: CalendarDays,
  },
  {
    id: "pets",
    name: "Pet Parent Records",
    description:
      "Pet profiles, wellness journal entries, and care reminders.",
    key:
      "paw-and-kind-pet-parent-v1",
    icon: PawPrint,
  },
  {
    id: "clinic",
    name: "Clinic Operations",
    description:
      "Staff tasks, operational notes, service controls, and team assignments.",
    key:
      "paw-and-kind-clinic-operations-v1",
    icon: ClipboardList,
  },
];

function readModule(key) {
  try {
    const stored =
      localStorage.getItem(key);

    return stored
      ? JSON.parse(stored)
      : null;
  } catch {
    return null;
  }
}

function getStats(module) {
  const value =
    readModule(module.key);

  if (module.id === "visits") {
    return [
      {
        label: "REQUESTS",
        value: Array.isArray(value)
          ? value.length
          : 0,
      },
    ];
  }

  if (module.id === "pets") {
    return [
      {
        label: "PET PROFILES",
        value: Array.isArray(
          value?.pets
        )
          ? value.pets.length
          : 0,
      },
      {
        label: "JOURNAL ENTRIES",
        value: Array.isArray(
          value?.journal
        )
          ? value.journal.length
          : 0,
      },
      {
        label: "REMINDERS",
        value: Array.isArray(
          value?.reminders
        )
          ? value.reminders.length
          : 0,
      },
    ];
  }

  return [
    {
      label: "STAFF TASKS",
      value: Array.isArray(
        value?.tasks
      )
        ? value.tasks.length
        : 0,
    },
    {
      label: "TEAM ASSIGNMENTS",
      value:
        value?.assignments &&
        typeof value.assignments ===
          "object"
          ? Object.keys(
              value.assignments
            ).length
          : 0,
    },
  ];
}

function downloadJson(
  filename,
  data
) {
  const json = JSON.stringify(
    data,
    null,
    2
  );

  const blob = new Blob(
    [json],
    {
      type:
        "application/json;charset=utf-8",
    }
  );

  const url =
    URL.createObjectURL(blob);

  const anchor =
    document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();
  anchor.remove();

  window.setTimeout(
    () =>
      URL.revokeObjectURL(url),
    1500
  );
}

export default function DemoSettingsPage() {
  const [message, setMessage] =
    useState("");

  function exportSnapshot() {
    try {
      const modules =
        Object.fromEntries(
          MODULES.map(
            (module) => [
              module.id,
              readModule(module.key),
            ]
          )
        );

      const snapshot = {
        project:
          "PAW & KIND.",
        schemaVersion: 1,

        exportedAt:
          new Date().toISOString(),

        description:
          "Browser-local demonstration data.",

        modules,
      };

      const date =
        new Date()
          .toISOString()
          .slice(0, 10);

      downloadJson(
        `paw-and-kind-demo-backup-${date}.json`,
        snapshot
      );

      setMessage(
        "Your demo data download has started."
      );
    } catch {
      setMessage(
        "The export could not start. Please check your browser permissions."
      );
    }
  }

  function clearModule(module) {
    const confirmed =
      window.confirm(
        `Reset ${module.name}?\n\nThis will delete this module's saved browser demo data. This cannot be undone unless you have another backup.`
      );

    if (!confirmed) {
      return;
    }

    try {
      localStorage.removeItem(
        module.key
      );

      window.location.reload();
    } catch {
      setMessage(
        "Unable to reset browser data."
      );
    }
  }

  function resetEverything() {
    const firstConfirmation =
      window.confirm(
        "Reset ALL PAW & KIND. demo data?\n\nThis will delete demo appointments, pet profiles, journals, reminders, assignments, tasks, and clinic notes."
      );

    if (!firstConfirmation) {
      return;
    }

    const finalConfirmation =
      window.confirm(
        "Final confirmation: clear all three PAW & KIND. demo modules?"
      );

    if (!finalConfirmation) {
      return;
    }

    try {
      MODULES.forEach(
        (module) => {
          localStorage.removeItem(
            module.key
          );
        }
      );

      window.location.reload();
    } catch {
      setMessage(
        "Unable to reset all demo data."
      );
    }
  }

  return (
    <div className="pk5-settings-page">
      <div className="pk-container">
        <div className="pk5-settings-heading">
          <span className="pk-kicker">
            <span className="pk-kicker-dot" />
            WEBSITE DEMONSTRATION TOOLS
          </span>

          <h1>
            YOUR DEMO.
            <br />
            <em>YOUR CONTROL.</em>
          </h1>

          <p>
            Keep your portfolio
            demonstration organized.
            Review locally saved records,
            export a backup, or reset
            individual systems before
            showing the website to
            potential clients.
          </p>

          <Link
            to="/"
            className="pk5-back-link"
          >
            <ArrowLeft size={17} />
            Back to Website
          </Link>
        </div>

        <div className="pk5-settings-intro">
          <div className="pk5-settings-intro-icon">
            <ShieldCheck size={27} />
          </div>

          <div>
            <strong>
              DEMONSTRATION MODE
            </strong>

            <p>
              Your browser stores the
              interactive demo records.
              They are not stored on
              GitHub, connected to a
              production database,
              or shared with actual
              clinic employees.
            </p>
          </div>
        </div>

        <div className="pk5-settings-section-heading">
          <span className="pk-kicker">
            01 / STORED DEMO MODULES
          </span>

          <h2>
            A LITTLE
            <em> HOUSEKEEPING.</em>
          </h2>
        </div>

        <div className="pk5-module-grid">
          {MODULES.map(
            (module, index) => {
              const Icon =
                module.icon;

              const stats =
                getStats(module);

              return (
                <article
                  className="pk5-module-card"
                  key={module.id}
                >
                  <div className="pk5-module-card-top">
                    <span>
                      MODULE{" "}
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <div>
                      <Icon size={24} />
                    </div>
                  </div>

                  <h3>
                    {module.name}
                  </h3>

                  <p>
                    {module.description}
                  </p>

                  <div className="pk5-module-stats">
                    {stats.map(
                      (stat) => (
                        <div
                          key={
                            stat.label
                          }
                        >
                          <strong>
                            {stat.value}
                          </strong>

                          <span>
                            {stat.label}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="pk5-reset-module"
                    onClick={() =>
                      clearModule(
                        module
                      )
                    }
                  >
                    <RotateCcw
                      size={17}
                    />

                    Reset This Module
                  </button>
                </article>
              );
            }
          )}
        </div>

        <div className="pk5-settings-section-heading">
          <span className="pk-kicker">
            02 / DATA TOOLS
          </span>

          <h2>
            BACKUP &
            <em> RESET.</em>
          </h2>
        </div>

        <div className="pk5-actions-grid">
          <article className="pk5-action-card">
            <div className="pk5-action-icon">
              <Download size={27} />
            </div>

            <h3>
              Export Demo Snapshot
            </h3>

            <p>
              Download a JSON backup
              containing the current
              demonstration records
              from all three modules.
            </p>

            <button
              type="button"
              className="pk-button pk-button-dark"
              onClick={
                exportSnapshot
              }
            >
              <Download
                size={17}
              />

              Download JSON
              <ArrowUpRight
                size={17}
              />
            </button>
          </article>

          <article className="pk5-action-card is-danger">
            <div className="pk5-action-icon">
              <Trash2 size={27} />
            </div>

            <h3>
              Start Fresh
            </h3>

            <p>
              Clear the complete
              PAW & KIND. browser
              demonstration and
              restore the default
              empty data modules.
            </p>

            <button
              type="button"
              className="pk5-danger-button"
              onClick={
                resetEverything
              }
            >
              <Trash2
                size={17}
              />

              Reset All Demo Data
            </button>
          </article>
        </div>

        {message && (
          <p
            className="pk5-settings-message"
            role="status"
          >
            <CheckCircle2
              size={18}
            />

            {message}
          </p>
        )}

        <div className="pk5-settings-warning">
          <AlertTriangle
            size={22}
          />

          <div>
            <strong>
              A note about privacy
            </strong>

            <p>
              Use fictional test
              information only.
              Exported JSON files can
              contain entered names,
              notes, and other demo
              details. Keep your
              downloads private and
              avoid collecting real
              medical or personal
              records in this concept.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}