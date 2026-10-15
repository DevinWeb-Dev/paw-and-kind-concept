import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  NavLink,
  Outlet,
} from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  HeartPulse,
  Info,
  PawPrint,
  Search,
  ShieldCheck,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import {
  SERVICES,
  TEAM,
  friendlyDate,
  timeLabel,
  localDateISO,
} from "../data/siteData.js";

import {
  useBookings,
  VISIT_STATUSES,
} from "../context/BookingContext.jsx";

import {
  useClinic,
} from "../context/ClinicContext.jsx";

import {
  REPORT_TYPES,
  buildClinicReport,
  calculateClinicAnalytics,
  exportCsv,
} from "../data/clinicAnalytics.js";

const AnalyticsContext =
  createContext(null);

const NAV_ITEMS = [
  {
    to: "/clinic/analytics",
    label: "Overview",
    end: true,
  },
  {
    to: "/clinic/analytics/services",
    label: "Service Insights",
  },
  {
    to: "/clinic/analytics/team",
    label: "Team Workload",
  },
  {
    to: "/clinic/analytics/reports",
    label: "Reports",
  },
];

function useAnalytics() {
  const value = useContext(
    AnalyticsContext
  );

  if (!value) {
    throw new Error(
      "Analytics pages require ClinicAnalyticsLayout."
    );
  }

  return value;
}

export function ClinicAnalyticsLayout() {
  const {
    requests,
  } = useBookings();

  const clinic = useClinic();

  const analytics = useMemo(
    () =>
      calculateClinicAnalytics({
        requests,
        assignments:
          clinic.assignments,
      }),
    [
      requests,
      clinic.assignments,
    ]
  );

  const value = useMemo(
    () => ({
      requests,
      clinic,
      analytics,
    }),
    [
      requests,
      clinic,
      analytics,
    ]
  );

  return (
    <AnalyticsContext.Provider
      value={value}
    >
      <div className="pka-root">
        <div className="pka-subnav">
          <span>
            <BarChart3 size={18} />
            CLINIC INTELLIGENCE
          </span>

          <nav
            aria-label="Analytics sections"
          >
            {NAV_ITEMS.map(
              (item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({
                    isActive,
                  }) =>
                    `pka-tab ${
                      isActive
                        ? "is-active"
                        : ""
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>
        </div>

        <Outlet />
      </div>
    </AnalyticsContext.Provider>
  );
}

// ======================================
// SHARED UI
// ======================================

function PageHeading({
  eyebrow,
  title,
  accent,
  description,
}) {
  return (
    <header className="pka-heading">
      <span className="pka-eyebrow">
        {eyebrow}
      </span>

      <h1>
        {title}
        <br />
        <em>{accent}</em>
      </h1>

      <p>{description}</p>
    </header>
  );
}

function Panel({
  eyebrow,
  title,
  extra,
  children,
}) {
  return (
    <section className="pka-panel">
      <div className="pka-panel-heading">
        <div>
          <span className="pka-eyebrow">
            {eyebrow}
          </span>

          <h2>
            {title}
          </h2>
        </div>

        {extra && (
          <div>{extra}</div>
        )}
      </div>

      {children}
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  note,
  featured = false,
}) {
  return (
    <article
      className={`pka-metric ${
        featured
          ? "is-featured"
          : ""
      }`}
    >
      <div className="pka-metric-top">
        <span>{label}</span>

        <Icon size={20} />
      </div>

      <strong>{value}</strong>

      <p>{note}</p>
    </article>
  );
}

function Notice({ children }) {
  return (
    <div className="pka-notice">
      <Info size={19} />

      <p>{children}</p>
    </div>
  );
}

function Empty({
  message,
}) {
  return (
    <div className="pka-empty">
      <PawPrint size={31} />

      <strong>
        No demo records yet.
      </strong>

      <p>{message}</p>
    </div>
  );
}

function shortDate(date) {
  if (!date) return "—";

  const parsed = new Date(
    `${date}T12:00:00`
  );

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-PH",
    {
      month: "short",
      day: "numeric",
    }
  );
}

function ProgressRow({
  name,
  value,
  maximum,
  detail,
  rank,
}) {
  const width =
    maximum > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (value / maximum) * 100
          )
        )
      : 0;

  return (
    <div className="pka-progress-item">
      <div className="pka-progress-top">
        <div>
          <span>
            {String(rank).padStart(
              2,
              "0"
            )}
          </span>

          <strong>
            {name}
          </strong>
        </div>

        <b>{value}</b>
      </div>

      <div
        className="pka-progress-track"
        role="progressbar"
        aria-label={name}
        aria-valuemin={0}
        aria-valuemax={
          Math.max(1, maximum)
        }
        aria-valuenow={value}
      >
        <span
          style={{
            width: `${width}%`,
          }}
        />
      </div>

      {detail && (
        <small>{detail}</small>
      )}
    </div>
  );
}

function ColumnChart({
  rows,
  keys,
}) {
  const maximum = Math.max(
    1,
    ...rows.flatMap(
      (row) =>
        keys.map(
          (key) =>
            Number(row[key]) || 0
        )
    )
  );

  return (
    <div
      className="pka-column-chart"
      role="group"
      aria-label="Daily activity chart"
    >
      {rows.map(
        (row) => (
          <div
            className="pka-column-day"
            key={row.date}
          >
            <div className="pka-column-stage">
              {keys.map(
                (key, index) => (
                  <span
                    key={key}
                    className={
                      index === 0
                        ? "is-primary"
                        : "is-secondary"
                    }
                    style={{
                      height: `${
                        row[key]
                          ? Math.max(
                              6,
                              (row[key] /
                                maximum) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                    title={`${key}: ${row[key]}`}
                  />
                )
              )}
            </div>

            <strong>
              {shortDate(row.date)}
            </strong>
          </div>
        )
      )}
    </div>
  );
}

function StatusDistribution({
  statuses,
  total,
}) {
  const items = [
    {
      key: "requested",
      label: "Requested",
    },
    {
      key: "confirmed",
      label: "Confirmed",
    },
    {
      key: "checked-in",
      label: "Checked In",
    },
    {
      key: "completed",
      label: "Completed",
    },
    {
      key: "cancelled",
      label: "Cancelled",
    },
  ];

  return (
    <div className="pka-status-list">
      {items.map(
        (item) => {
          const count =
            statuses[item.key] || 0;

          const percentage =
            total
              ? Math.round(
                  (count /
                    total) *
                    100
                )
              : 0;

          return (
            <div
              className="pka-status-row"
              key={item.key}
            >
              <span>
                <i
                  className={`is-${item.key}`}
                />

                {item.label}
              </span>

              <div>
                <strong>
                  {count}
                </strong>

                <small>
                  {percentage}%
                </small>
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

// ======================================
// PAGE 01 — ANALYTICS OVERVIEW
// ======================================

export function ClinicAnalyticsOverviewPage() {
  const {
    analytics,
  } = useAnalytics();

  const maximum = Math.max(
    1,
    ...analytics.serviceRows.map(
      (service) =>
        service.requests
    )
  );

  return (
    <div className="pka-page">
      <PageHeading
        eyebrow="OPERATIONS ANALYTICS / 01"
        title="KNOW THE"
        accent="LITTLE DETAILS."
        description="A clear view of appointment activity, current demand, review queues, and clinic demonstration trends."
      />

      <div className="pka-metric-grid">
        <Metric
          icon={ClipboardList}
          label="TOTAL DEMO REQUESTS"
          value={
            analytics.total
          }
          note="All locally saved appointment records"
          featured
        />

        <Metric
          icon={Activity}
          label="ACTIVE REQUESTS"
          value={
            analytics.activeCount
          }
          note="Not completed or cancelled"
        />

        <Metric
          icon={CalendarDays}
          label="UPCOMING REQUESTS"
          value={
            analytics.upcomingCount
          }
          note="Preferred date is today or later"
        />

        <Metric
          icon={UsersRound}
          label="TEAM ASSIGNED"
          value={
            analytics.assignedCount
          }
          note={`${analytics.unassignedCount} unassigned records`}
        />
      </div>

      <div className="pka-two-columns">
        <Panel
          eyebrow="LAST 14 DAYS"
          title="Request activity."
          extra={
            <span className="pka-small-label">
              DEMO RECORDS
            </span>
          }
        >
          <ColumnChart
            rows={
              analytics.trend
            }
            keys={[
              "created",
              "completed",
            ]}
          />

          <div className="pka-legend">
            <span>
              <i className="is-primary" />
              Requests created
            </span>

            <span>
              <i className="is-secondary" />
              Completed updates
            </span>
          </div>

          <p className="pka-helper">
            Based on locally saved
            creation and status-update
            timestamps, when available.
          </p>
        </Panel>

        <Panel
          eyebrow="CURRENT DISTRIBUTION"
          title="Appointment statuses."
        >
          <StatusDistribution
            statuses={
              analytics.statuses
            }
            total={
              analytics.total
            }
          />

          <div className="pka-summary-line">
            <span>
              Completed share of
              resolved requests
            </span>

            <strong>
              {analytics.completedShare ===
              null
                ? "—"
                : `${analytics.completedShare}%`}
            </strong>
          </div>
        </Panel>
      </div>

      <div className="pka-two-columns">
        <Panel
          eyebrow="CARE DEMAND"
          title="Most requested services."
        >
          {analytics.total ? (
            <div className="pka-progress-list">
              {analytics.serviceRows
                .slice(0, 5)
                .map(
                  (service, index) => (
                    <ProgressRow
                      key={service.id}
                      rank={index + 1}
                      name={
                        service.title
                      }
                      value={
                        service.requests
                      }
                      maximum={
                        maximum
                      }
                      detail={`${service.active} active · ${service.completed} completed`}
                    />
                  )
                )}
            </div>
          ) : (
            <Empty message="Create a fictional appointment request to populate the service demand chart." />
          )}
        </Panel>

        <Panel
          eyebrow="NEXT SEVEN DAYS"
          title="Preferred visit dates."
        >
          <ColumnChart
            rows={
              analytics.calendar
            }
            keys={[
              "count",
            ]}
          />

          <div className="pka-summary-line">
            <span>
              Most requested service
            </span>

            <strong className="is-text">
              {analytics.topService
                ?.title ||
                "No requests yet"}
            </strong>
          </div>

          <div className="pka-summary-line">
            <span>
              Most selected demo time
            </span>

            <strong className="is-text">
              {analytics.busiestSlot
                ?.label || "—"}
            </strong>
          </div>
        </Panel>
      </div>

      <Notice>
        Analytics are calculated from
        the browser's demo appointment
        records. They are not a live
        clinic performance report or
        real-time booking analytics.
      </Notice>
    </div>
  );
}

// ======================================
// PAGE 02 — SERVICE INSIGHTS
// ======================================

export function ClinicServiceInsightsPage() {
  const {
    analytics,
    clinic,
  } = useAnalytics();

  const maximum = Math.max(
    1,
    ...analytics.serviceRows.map(
      (service) =>
        service.requests
    )
  );

  return (
    <div className="pka-page">
      <PageHeading
        eyebrow="SERVICE INTELLIGENCE / 02"
        title="WHAT PETS"
        accent="COME FOR."
        description="Compare requested care services, review appointment demand, and spot common preferred time slots."
      />

      <div className="pka-metric-grid">
        <Metric
          icon={Stethoscope}
          label="SERVICE CATEGORIES"
          value={SERVICES.length}
          note="Care pathways in the demo"
          featured
        />

        <Metric
          icon={HeartPulse}
          label="TOP SERVICE"
          value={
            analytics.topService
              ? analytics.topService.requests
              : 0
          }
          note={
            analytics.topService
              ?.title ||
            "No demand recorded"
          }
        />

        <Metric
          icon={CalendarDays}
          label="ACTIVE VISITS"
          value={
            analytics.activeCount
          }
          note="Appointments still in progress"
        />

        <Metric
          icon={CheckCircle2}
          label="COMPLETED VISITS"
          value={
            analytics.statuses.completed
          }
          note="Marked completed in the demo"
        />
      </div>

      <Panel
        eyebrow="POPULARITY COMPARISON"
        title="Services by request volume."
      >
        <div className="pka-progress-list">
          {analytics.serviceRows.map(
            (service, index) => (
              <ProgressRow
                key={
                  service.id
                }
                name={
                  service.title
                }
                value={
                  service.requests
                }
                maximum={
                  maximum
                }
                rank={
                  index + 1
                }
                detail={`${service.category} · ${service.active} active`}
              />
            )
          )}
        </div>
      </Panel>

      <div className="pka-service-grid">
        {analytics.serviceRows.map(
          (service) => {
            const active =
              clinic.isServiceActive(
                service.id
              );

            return (
              <article
                key={service.id}
                className="pka-service-card"
              >
                <div className="pka-service-head">
                  <span>
                    {service.number}
                    {" / "}
                    {service.category}
                  </span>

                  <span
                    className={
                      active
                        ? "pka-service-available"
                        : "pka-service-paused"
                    }
                  >
                    {active
                      ? "ACCEPTING DEMOS"
                      : "PAUSED"}
                  </span>
                </div>

                <div className="pka-service-icon">
                  <PawPrint
                    size={24}
                  />
                </div>

                <h3>
                  {service.title}
                </h3>

                <p>
                  {service.tagline}
                </p>

                <div className="pka-service-numbers">
                  <div>
                    <span>
                      REQUESTS
                    </span>

                    <strong>
                      {service.requests}
                    </strong>
                  </div>

                  <div>
                    <span>
                      COMPLETED
                    </span>

                    <strong>
                      {service.completed}
                    </strong>
                  </div>

                  <div>
                    <span>
                      ACTIVE
                    </span>

                    <strong>
                      {service.active}
                    </strong>
                  </div>
                </div>
              </article>
            );
          }
        )}
      </div>

      <Panel
        eyebrow="TIME SLOT PREFERENCES"
        title="When visits are requested."
      >
        <div className="pka-progress-list">
          {analytics.slotRows.map(
            (slot, index) => (
              <ProgressRow
                key={
                  slot.value
                }
                rank={
                  index + 1
                }
                name={
                  slot.label
                }
                value={
                  slot.requests
                }
                maximum={Math.max(
                  1,
                  ...analytics.slotRows.map(
                    (item) =>
                      item.requests
                  )
                )}
                detail="Non-cancelled demo requests"
              />
            )
          )}
        </div>
      </Panel>

      <Notice>
        Historical requests remain
        counted even when a service is
        paused. Service status only
        controls whether new demo
        requests can be selected.
      </Notice>
    </div>
  );
}

// ======================================
// PAGE 03 — TEAM WORKLOAD
// ======================================

export function ClinicTeamWorkloadPage() {
  const {
    requests,
    analytics,
    clinic,
  } = useAnalytics();

  const [filter, setFilter] =
    useState("all");

  const [search, setSearch] =
    useState("");

  const [feedback, setFeedback] =
    useState("");

  const maximum = Math.max(
    1,
    ...analytics.teamRows.map(
      (person) =>
        person.assigned
    )
  );

  const filtered = useMemo(
    () => {
      const query =
        search.toLowerCase().trim();

      return [...requests]
        .filter((record) => {
          const assigned =
            Boolean(
              clinic.assignments[
                record.id
              ]
            );

          const matchesFilter =
            filter === "all" ||
            (filter === "assigned"
              ? assigned
              : !assigned);

          const text = [
            record.reference,
            record.petName,
            record.ownerAlias,
          ]
            .join(" ")
            .toLowerCase();

          return (
            matchesFilter &&
            text.includes(query)
          );
        })
        .sort(
          (a, b) =>
            `${a.date} ${a.time}`.localeCompare(
              `${b.date} ${b.time}`
            )
        );
    },
    [
      requests,
      clinic.assignments,
      filter,
      search,
    ]
  );

  function changeAssignment(
    requestId,
    teamId
  ) {
    const result =
      clinic.assignTeamMember(
        requestId,
        teamId
      );

    setFeedback(
      result.ok
        ? "Demo team assignment saved."
        : result.error
    );
  }

  return (
    <div className="pka-page">
      <PageHeading
        eyebrow="TEAM OPERATIONS / 03"
        title="EVERYONE"
        accent="HAS A ROLE."
        description="Assign fictional appointment requests to demo team members and view how those assignments are distributed."
      />

      <div className="pka-metric-grid">
        <Metric
          icon={UsersRound}
          label="TEAM MEMBERS"
          value={TEAM.length}
          note="Fictional clinic roster"
          featured
        />

        <Metric
          icon={ClipboardList}
          label="ASSIGNED REQUESTS"
          value={
            analytics.assignedCount
          }
          note="Manual assignments in this browser"
        />

        <Metric
          icon={Activity}
          label="UNASSIGNED"
          value={
            analytics.unassignedCount
          }
          note="Requests without a team member"
        />

        <Metric
          icon={CheckCircle2}
          label="TOTAL COMPLETED"
          value={
            analytics.statuses.completed
          }
          note="All clinic demo visits"
        />
      </div>

      <Panel
        eyebrow="ASSIGNMENT DISTRIBUTION"
        title="Team workload overview."
      >
        <div className="pka-progress-list">
          {analytics.teamRows.map(
            (person, index) => (
              <ProgressRow
                key={
                  person.id
                }
                rank={
                  index + 1
                }
                name={
                  person.name
                }
                value={
                  person.assigned
                }
                maximum={
                  maximum
                }
                detail={`${person.active} active · ${person.completed} completed`}
              />
            )
          )}
        </div>
      </Panel>

      <div className="pka-team-grid">
        {analytics.teamRows.map(
          (person) => (
            <article
              className="pka-team-card"
              key={person.id}
            >
              <div className="pka-team-top">
                <span>
                  DEMO TEAM MEMBER
                </span>

                <ArrowUpRight
                  size={18}
                />
              </div>

              <div className="pka-team-avatar">
                {person.initials}
              </div>

              <h3>
                {person.name}
              </h3>

              <p>
                {person.role}
              </p>

              <div className="pka-team-numbers">
                <div>
                  <span>
                    ASSIGNED
                  </span>

                  <strong>
                    {person.assigned}
                  </strong>
                </div>

                <div>
                  <span>
                    ACTIVE
                  </span>

                  <strong>
                    {person.active}
                  </strong>
                </div>

                <div>
                  <span>
                    COMPLETED
                  </span>

                  <strong>
                    {person.completed}
                  </strong>
                </div>
              </div>
            </article>
          )
        )}
      </div>

      <Panel
        eyebrow="ASSIGNMENT DESK"
        title="Allocate demo requests."
        extra={
          <span className="pka-small-label">
            {filtered.length}
            {" "}RECORDS
          </span>
        }
      >
        <div className="pka-assignment-controls">
          <label className="pka-search">
            <Search size={17} />

            <input
              value={search}
              placeholder="Search reference or pet..."
              onChange={
                (event) =>
                  setSearch(
                    event.target.value
                  )
              }
              aria-label="Search appointment assignments"
            />
          </label>

          <select
            value={filter}
            onChange={
              (event) =>
                setFilter(
                  event.target.value
                )
            }
            aria-label="Assignment filter"
          >
            <option value="all">
              All Requests
            </option>

            <option value="assigned">
              Assigned
            </option>

            <option value="unassigned">
              Unassigned
            </option>
          </select>
        </div>

        {feedback && (
          <p
            role="status"
            className="pka-success"
          >
            <CheckCircle2 size={17} />

            {feedback}
          </p>
        )}

        {filtered.length ? (
          <div className="pka-assignment-list">
            {filtered.map(
              (record) => {
                const service =
                  SERVICES.find(
                    (item) =>
                      item.id ===
                      record.serviceId
                  );

                return (
                  <article
                    className="pka-assignment-row"
                    key={record.id}
                  >
                    <div className="pka-assignment-identity">
                      <span>
                        {record.reference}
                      </span>

                      <strong>
                        {record.petName}
                      </strong>

                      <small>
                        {service?.title ||
                          "Care Service"}
                        {" · "}
                        {shortDate(
                          record.date
                        )}
                        {" · "}
                        {timeLabel(
                          record.time
                        )}
                      </small>

                      <small>
                        {VISIT_STATUSES[
                          record.status ||
                            "requested"
                        ] ||
                          "Requested"}
                      </small>
                    </div>

                    <label className="pka-assignment-select">
                      <span>
                        TEAM MEMBER
                      </span>

                      <select
                        value={
                          clinic.assignments[
                            record.id
                          ] || ""
                        }
                        onChange={(
                          event
                        ) =>
                          changeAssignment(
                            record.id,
                            event.target.value
                          )
                        }
                      >
                        <option value="">
                          Unassigned
                        </option>

                        {TEAM.map(
                          (person) => (
                            <option
                              key={
                                person.id
                              }
                              value={
                                person.id
                              }
                            >
                              {person.name}
                            </option>
                          )
                        )}
                      </select>
                    </label>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <Empty message="No appointment records match this assignment filter." />
        )}
      </Panel>

      <Notice>
        Assignment counts reflect
        manual selections in this
        portfolio demo. They do not
        measure actual working hours,
        clinical quality, or employee
        performance.
      </Notice>
    </div>
  );
}

// ======================================
// PAGE 04 — REPORT CENTER
// ======================================

export function ClinicReportsPage() {
  const {
    requests,
    clinic,
  } = useAnalytics();

  const [type, setType] =
    useState("appointments");

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [message, setMessage] =
    useState("");

  const invalidRange =
    Boolean(
      from &&
      to &&
      from > to
    );

  const isTasks =
    type === "tasks";

  const report = useMemo(
    () =>
      buildClinicReport({
        type,
        requests,
        assignments:
          clinic.assignments,
        tasks: clinic.tasks,
        from: isTasks
          ? ""
          : from,
        to: isTasks
          ? ""
          : to,
      }),
    [
      type,
      requests,
      clinic.assignments,
      clinic.tasks,
      from,
      to,
      isTasks,
    ]
  );

  const rows =
    invalidRange &&
    !isTasks
      ? []
      : report.rows;

  function handleDownload() {
    if (
      !rows.length ||
      (invalidRange && !isTasks)
    ) {
      return;
    }

    try {
      const date =
        localDateISO();

      const filename =
        `paw-kind-${type}-${date}.csv`;

      exportCsv(
        filename,
        report.headers,
        rows
      );

      setMessage(
        `CSV download started: ${filename}`
      );
    } catch {
      setMessage(
        "CSV download could not start. Check browser download permissions."
      );
    }
  }

  return (
    <div className="pka-page">
      <PageHeading
        eyebrow="REPORT CENTER / 04"
        title="INSIGHTS"
        accent="YOU CAN USE."
        description="Create filtered operational reports, preview the matching records, and export CSV files for offline analysis."
      />

      <div className="pka-report-grid">
        <Panel
          eyebrow="REPORT CONFIGURATION"
          title="Build a custom report."
        >
          <div className="pka-report-fields">
            <label>
              <span>
                REPORT TYPE
              </span>

              <select
                value={type}
                onChange={(
                  event
                ) => {
                  setType(
                    event.target.value
                  );

                  setMessage("");
                }}
              >
                {REPORT_TYPES.map(
                  (option) => (
                    <option
                      value={
                        option.id
                      }
                      key={
                        option.id
                      }
                    >
                      {option.label}
                    </option>
                  )
                )}
              </select>
            </label>

            <div className="pka-date-fields">
              <label>
                <span>
                  FROM DATE
                </span>

                <input
                  type="date"
                  value={from}
                  disabled={isTasks}
                  onChange={(
                    event
                  ) =>
                    setFrom(
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>
                  TO DATE
                </span>

                <input
                  type="date"
                  value={to}
                  disabled={isTasks}
                  onChange={(
                    event
                  ) =>
                    setTo(
                      event.target.value
                    )
                  }
                />
              </label>
            </div>

            {invalidRange &&
              !isTasks && (
                <p
                  className="pka-error"
                  role="alert"
                >
                  The end date must
                  not be earlier
                  than the start date.
                </p>
              )}
          </div>

          <div className="pka-report-actions">
            <button
              type="button"
              className="pka-download-button"
              disabled={
                !rows.length ||
                (invalidRange &&
                  !isTasks)
              }
              onClick={
                handleDownload
              }
            >
              <Download size={18} />

              DOWNLOAD CSV
            </button>

            <button
              type="button"
              className="pka-reset-button"
              onClick={() => {
                setType(
                  "appointments"
                );
                setFrom("");
                setTo("");
                setMessage("");
              }}
            >
              Reset Filters
            </button>
          </div>

          {message && (
            <p
              className="pka-success"
              role="status"
            >
              <CheckCircle2
                size={17}
              />

              {message}
            </p>
          )}
        </Panel>

        <Panel
          eyebrow="REPORT PREVIEW"
          title="Matching records."
        >
          <div className="pka-report-count">
            <FileSpreadsheet
              size={35}
            />

            <strong>
              {rows.length}
            </strong>

            <span>
              REPORT ROWS
            </span>
          </div>

          <p className="pka-report-description">
            {
              REPORT_TYPES.find(
                (option) =>
                  option.id ===
                  type
              )?.label
            }
          </p>

          <p className="pka-helper">
            {report.description}
          </p>
        </Panel>
      </div>

      <Panel
        eyebrow="DATA PREVIEW"
        title="Inside the report."
        extra={
          <span className="pka-small-label">
            FIRST 10 ROWS
          </span>
        }
      >
        {rows.length ? (
          <div className="pka-table-scroll">
            <table className="pka-table">
              <thead>
                <tr>
                  {report.headers.map(
                    (header) => (
                      <th
                        key={
                          header
                        }
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {rows
                  .slice(0, 10)
                  .map(
                    (
                      row,
                      index
                    ) => (
                      <tr key={index}>
                        {row.map(
                          (
                            value,
                            cellIndex
                          ) => (
                            <td
                              key={
                                cellIndex
                              }
                            >
                              {String(
                                value ??
                                  "—"
                              )}
                            </td>
                          )
                        )}
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty message="No records match the selected report and date range." />
        )}

        {rows.length > 10 && (
          <p className="pka-helper">
            Showing 10 of{" "}
            {rows.length} rows.
            The download includes
            every matching row.
          </p>
        )}
      </Panel>

      <Notice>
        Reports use demonstration
        records stored on this device.
        CSV appointment exports
        exclude guardian aliases,
        pet names, and free-text notes
        by default. Do not use these
        reports as official clinic,
        financial, or veterinary
        records.
      </Notice>
    </div>
  );
}