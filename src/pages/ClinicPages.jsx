import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Activity,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleCheck,
  ClipboardList,
  Clock3,
  HeartPulse,
  ListTodo,
  PawPrint,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Stethoscope,
  Trash2,
  UsersRound,
  XCircle,
} from "lucide-react";

import {
  BRAND,
  DEMO_TIME_SLOTS,
  SERVICES,
  TEAM,
  friendlyDate,
  localDateISO,
  timeLabel,
} from "../data/siteData.js";

import {
  useBookings,
  VISIT_STATUSES,
} from "../context/BookingContext.jsx";

import {
  useClinic,
} from "../context/ClinicContext.jsx";

const STATUS_FILTERS = [
  "all",
  "requested",
  "confirmed",
  "checked-in",
  "completed",
  "cancelled",
];

function getService(id) {
  return SERVICES.find(
    (item) => item.id === id
  );
}

function sortRequests(records) {
  return [...records].sort(
    (a, b) =>
      `${a.date} ${a.time}`.localeCompare(
        `${b.date} ${b.time}`
      )
  );
}

function PageHeading({
  label,
  heading,
  accent,
  description,
  action,
}) {
  return (
    <div className="pkc-page-heading">
      <div>
        <span className="pkc-eyebrow">
          {label}
        </span>

        <h1>
          {heading}
          <br />
          <em>{accent}</em>
        </h1>

        <p>{description}</p>
      </div>

      {action && (
        <div className="pkc-heading-action">
          {action}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const current =
    VISIT_STATUSES[status]
      ? status
      : "requested";

  return (
    <span
      className={`pkc-status pkc-status-${current}`}
    >
      <i />

      {VISIT_STATUSES[current]}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  featured = false,
}) {
  return (
    <article
      className={`pkc-stat-card ${
        featured ? "is-featured" : ""
      }`}
    >
      <div className="pkc-stat-top">
        <span>{label}</span>
        <Icon size={21} />
      </div>

      <strong>{value}</strong>

      <small>{note}</small>
    </article>
  );
}

function Panel({
  eyebrow,
  title,
  extra,
  children,
}) {
  return (
    <section className="pkc-panel">
      <div className="pkc-panel-heading">
        <div>
          <span className="pkc-eyebrow">
            {eyebrow}
          </span>

          <h2>{title}</h2>
        </div>

        {extra && <div>{extra}</div>}
      </div>

      {children}
    </section>
  );
}

function Empty({
  title,
  message,
  icon: Icon = ClipboardList,
}) {
  return (
    <div className="pkc-empty">
      <Icon size={34} />

      <strong>{title}</strong>

      <p>{message}</p>
    </div>
  );
}

function RequestSummary({
  record,
  onClick,
  active = false,
}) {
  return (
    <button
      type="button"
      className={`pkc-request-row ${
        active ? "is-selected" : ""
      }`}
      onClick={onClick}
    >
      <div className="pkc-request-date">
        <strong>
          {record.date?.slice(8, 10) || "—"}
        </strong>

        <span>
          {record.date
            ? new Date(
                `${record.date}T12:00:00`
              ).toLocaleDateString(
                "en-PH",
                { month: "short" }
              )
            : "—"}
        </span>
      </div>

      <div className="pkc-request-name">
        <strong>
          {record.petName}
        </strong>

        <span>
          {getService(record.serviceId)?.title ||
            "Care Service"}
          {" · "}
          {timeLabel(record.time)}
        </span>

        <small>
          Guardian: {record.ownerAlias}
        </small>
      </div>

      <StatusBadge
        status={record.status}
      />
    </button>
  );
}

// ==========================================
// PAGE 01 — DASHBOARD
// ==========================================

export function ClinicDashboardPage() {
  const { requests, activeCount } =
    useBookings();

  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
  } = useClinic();

  const [taskText, setTaskText] =
    useState("");

  const today = localDateISO();

  const todayRequests =
    requests.filter(
      (item) =>
        item.date === today &&
        item.status !== "cancelled"
    );

  const awaiting =
    requests.filter(
      (item) =>
        (item.status || "requested") ===
        "requested"
    ).length;

  const confirmed =
    requests.filter(
      (item) =>
        item.status === "confirmed"
    ).length;

  const completed =
    requests.filter(
      (item) =>
        item.status === "completed"
    ).length;

  const upcoming = sortRequests(
    requests.filter(
      (item) =>
        item.date >= today &&
        !["cancelled", "completed"].includes(
          item.status
        )
    )
  ).slice(0, 5);

  function submitTask(event) {
    event.preventDefault();

    if (!taskText.trim()) return;

    addTask(taskText);
    setTaskText("");
  }

  return (
    <div className="pkc-page">
      <PageHeading
        label="CLINIC OPERATIONS / 01"
        heading="A CALMER"
        accent="FRONT DESK."
        description="A complete overview of demo visit requests, today's preferred appointment times, and staff preparation tasks."
        action={
          <Link
            to="/clinic/appointments"
            className="pkc-button"
          >
            Manage Requests
            <ArrowUpRight size={17} />
          </Link>
        }
      />

      <div className="pkc-stat-grid">
        <StatCard
          icon={ClipboardList}
          label="ACTIVE REQUESTS"
          value={activeCount}
          note="Not cancelled or completed"
          featured
        />

        <StatCard
          icon={Bell}
          label="NEEDS REVIEW"
          value={awaiting}
          note="New demo requests"
        />

        <StatCard
          icon={CalendarDays}
          label="TODAY'S REQUESTS"
          value={todayRequests.length}
          note="Preferred dates matching today"
        />

        <StatCard
          icon={CheckCircle2}
          label="COMPLETED"
          value={completed}
          note={`${confirmed} confirmed requests`}
        />
      </div>

      <div className="pkc-two-columns">
        <Panel
          eyebrow="UPCOMING DEMO REQUESTS"
          title="What's on the calendar."
          extra={
            <Link
              to="/clinic/schedule"
              className="pkc-text-link"
            >
              Full Schedule
              <ArrowUpRight size={16} />
            </Link>
          }
        >
          {upcoming.length ? (
            <div className="pkc-request-list">
              {upcoming.map(
                (record) => (
                  <RequestSummary
                    key={record.id}
                    record={record}
                    onClick={() => {
                      window.location.hash =
                        "#/clinic/appointments";
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <Empty
              title="No upcoming requests."
              message="Create a fictional appointment request from the public website to see it here."
            />
          )}
        </Panel>

        <Panel
          eyebrow="TEAM PREPARATION"
          title="Front desk checklist."
        >
          <form
            className="pkc-task-form"
            onSubmit={submitTask}
          >
            <input
              value={taskText}
              onChange={(event) =>
                setTaskText(
                  event.target.value
                )
              }
              placeholder="Add a front desk task..."
              maxLength={100}
              aria-label="New task"
            />

            <button
              type="submit"
              aria-label="Add task"
            >
              <Plus size={20} />
            </button>
          </form>

          <div className="pkc-task-list">
            {tasks.length ? (
              tasks.map((task) => (
                <div
                  className="pkc-task"
                  key={task.id}
                >
                  <button
                    type="button"
                    className={`pkc-task-check ${
                      task.done
                        ? "is-done"
                        : ""
                    }`}
                    onClick={() =>
                      toggleTask(task.id)
                    }
                    aria-label={
                      task.done
                        ? "Mark incomplete"
                        : "Mark complete"
                    }
                  >
                    {task.done && (
                      <Check size={15} />
                    )}
                  </button>

                  <span
                    className={
                      task.done
                        ? "is-done"
                        : ""
                    }
                  >
                    {task.title}
                  </span>

                  <button
                    type="button"
                    className="pkc-danger-icon"
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    aria-label={`Delete ${task.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <Empty
                title="Checklist complete."
                message="Add another task whenever you need one."
                icon={ListTodo}
              />
            )}
          </div>
        </Panel>
      </div>

      <Panel
        eyebrow="DEMO TEAM"
        title="Your care crew."
      >
        <div className="pkc-team-strip">
          {TEAM.map((person) => (
            <div
              key={person.id}
              className="pkc-team-person"
            >
              <div>
                {person.initials}
              </div>

              <strong>
                {person.name}
              </strong>

              <span>
                {person.role}
              </span>
            </div>
          ))}
        </div>
      </Panel>

      <div className="pkc-notice">
        <ShieldCheck size={20} />

        <p>
          This is a local demonstration
          dashboard. The staff profiles
          are fictional and appointment
          requests are not delivered to
          an actual veterinary clinic.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 02 — APPOINTMENT MANAGEMENT
// ==========================================

export function ClinicAppointmentsPage() {
  const {
    requests,
    setRequestStatus,
  } = useBookings();

  const {
    notes,
    saveNote,
  } = useClinic();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [selectedId, setSelectedId] =
    useState(null);

  const [feedback, setFeedback] =
    useState("");

  const filtered = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return sortRequests(
      requests.filter((record) => {
        const matchesStatus =
          filter === "all" ||
          (record.status || "requested") ===
            filter;

        const combined = [
          record.ownerAlias,
          record.petName,
          record.reference,
          getService(record.serviceId)?.title,
        ]
          .join(" ")
          .toLowerCase();

        return (
          matchesStatus &&
          combined.includes(query)
        );
      })
    );
  }, [requests, search, filter]);

  const selected =
    filtered.find(
      (item) => item.id === selectedId
    ) || filtered[0] || null;

  function changeStatus(nextStatus) {
    if (!selected) return;

    if (nextStatus === "cancelled") {
      const approved = window.confirm(
        `Cancel the demo request for ${selected.petName}?`
      );

      if (!approved) return;
    }

    const result = setRequestStatus(
      selected.id,
      nextStatus
    );

    setFeedback(
      result.ok
        ? `Status changed to ${
            VISIT_STATUSES[nextStatus]
          }.`
        : result.error
    );
  }

  const status =
    selected?.status || "requested";

  return (
    <div className="pkc-page">
      <PageHeading
        label="FRONT DESK / 02"
        heading="EVERY PET."
        accent="EVERY VISIT."
        description="Review demo requests, keep operational notes, and manage the appointment process from request to completion."
        action={
          <Link
            to="/request"
            className="pkc-button"
          >
            New Demo Request
            <Plus size={18} />
          </Link>
        }
      />

      <div className="pkc-filters">
        <label className="pkc-search">
          <Search size={18} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search pet, alias, reference..."
            aria-label="Search requests"
          />
        </label>

        <select
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value
            )
          }
          aria-label="Filter appointment status"
        >
          {STATUS_FILTERS.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item === "all"
                  ? "All Statuses"
                  : VISIT_STATUSES[item]}
              </option>
            )
          )}
        </select>
      </div>

      <div className="pkc-management-grid">
        <Panel
          eyebrow="APPOINTMENT QUEUE"
          title="Visit requests."
          extra={
            <span className="pkc-count">
              {filtered.length} RECORDS
            </span>
          }
        >
          {filtered.length ? (
            <div className="pkc-request-list">
              {filtered.map(
                (record) => (
                  <RequestSummary
                    key={record.id}
                    record={record}
                    active={
                      selected?.id ===
                      record.id
                    }
                    onClick={() => {
                      setSelectedId(
                        record.id
                      );
                      setFeedback("");
                    }}
                  />
                )
              )}
            </div>
          ) : (
            <Empty
              title="Nothing to display."
              message="Try another filter, or create a demonstration request."
            />
          )}
        </Panel>

        <Panel
          eyebrow="SELECTED REQUEST"
          title="Visit details."
        >
          {selected ? (
            <div className="pkc-appointment-detail">
              <div className="pkc-detail-top">
                <div className="pkc-detail-avatar">
                  <PawPrint size={27} />
                </div>

                <div>
                  <small>
                    {selected.reference}
                  </small>

                  <h3>
                    {selected.petName}
                  </h3>

                  <p>
                    {selected.petType}
                    {" · "}
                    Guardian:{" "}
                    {selected.ownerAlias}
                  </p>
                </div>
              </div>

              <StatusBadge status={status} />

              <div className="pkc-detail-facts">
                <div>
                  <span>
                    PREFERRED DATE
                  </span>

                  <strong>
                    {friendlyDate(
                      selected.date
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    PREFERRED TIME
                  </span>

                  <strong>
                    {timeLabel(
                      selected.time
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    CARE SERVICE
                  </span>

                  <strong>
                    {getService(
                      selected.serviceId
                    )?.title ||
                      "Care Service"}
                  </strong>
                </div>
              </div>

              {selected.notes && (
                <div className="pkc-visitor-note">
                  <span>
                    PET PARENT'S DEMO NOTE
                  </span>

                  <p>
                    {selected.notes}
                  </p>
                </div>
              )}

              <label className="pkc-note-field">
                <span>
                  INTERNAL STAFF NOTE
                </span>

                <textarea
                  rows={4}
                  maxLength={400}
                  placeholder="Front-desk preparation notes only. No medical records."
                  value={
                    notes[selected.id] || ""
                  }
                  onChange={(event) =>
                    saveNote(
                      selected.id,
                      event.target.value
                    )
                  }
                />

                <small>
                  Automatically saved in
                  this browser.
                </small>
              </label>

              <div className="pkc-status-actions">
                {status ===
                  "requested" && (
                  <button
                    type="button"
                    className="pkc-button"
                    onClick={() =>
                      changeStatus(
                        "confirmed"
                      )
                    }
                  >
                    <CheckCircle2
                      size={17}
                    />
                    Confirm Request
                  </button>
                )}

                {status ===
                  "confirmed" && (
                  <button
                    type="button"
                    className="pkc-button"
                    onClick={() =>
                      changeStatus(
                        "checked-in"
                      )
                    }
                  >
                    <PawPrint
                      size={17}
                    />
                    Mark Checked In
                  </button>
                )}

                {status ===
                  "checked-in" && (
                  <button
                    type="button"
                    className="pkc-button"
                    onClick={() =>
                      changeStatus(
                        "completed"
                      )
                    }
                  >
                    <CircleCheck
                      size={17}
                    />
                    Complete Visit
                  </button>
                )}

                {["requested", "confirmed"].includes(
                  status
                ) && (
                  <button
                    type="button"
                    className="pkc-outline-danger"
                    onClick={() =>
                      changeStatus(
                        "cancelled"
                      )
                    }
                  >
                    <XCircle
                      size={17}
                    />
                    Cancel Request
                  </button>
                )}
              </div>

              {feedback && (
                <p
                  className="pkc-feedback"
                  role="status"
                >
                  {feedback}
                </p>
              )}

              {["completed", "cancelled"].includes(
                status
              ) && (
                <div className="pkc-closed-message">
                  <CheckCircle2 size={17} />
                  This demo request is closed.
                </div>
              )}
            </div>
          ) : (
            <Empty
              title="Select a request."
              message="Visit details and controls will appear once a record is available."
            />
          )}
        </Panel>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 03 — DAILY SCHEDULE
// ==========================================

export function ClinicSchedulePage() {
  const { requests } =
    useBookings();

  const [date, setDate] =
    useState(localDateISO());

  const selectedRequests =
    sortRequests(
      requests.filter(
        (item) =>
          item.date === date &&
          item.status !== "cancelled"
      )
    );

  const slotMap = new Map(
    DEMO_TIME_SLOTS.map(
      (slot) => [
        slot.value,
        selectedRequests.filter(
          (record) =>
            record.time === slot.value
        ),
      ]
    )
  );

  return (
    <div className="pkc-page">
      <PageHeading
        label="CLINIC SCHEDULE / 03"
        heading="A DAY OF"
        accent="LITTLE VISITS."
        description="Explore the sample daily schedule and see how incoming preferred time requests are organized."
      />

      <div className="pkc-schedule-controls">
        <label>
          <span>
            VIEW DATE
          </span>

          <input
            type="date"
            value={date}
            onChange={(event) =>
              setDate(
                event.target.value
              )
            }
          />
        </label>

        <div>
          <span>
            REQUESTS FOR THE DAY
          </span>

          <strong>
            {selectedRequests.length}
          </strong>
        </div>

        <div>
          <span>
            DEMO TIME SLOTS
          </span>

          <strong>
            {DEMO_TIME_SLOTS.length}
          </strong>
        </div>
      </div>

      <Panel
        eyebrow="DAILY PLANNING"
        title={friendlyDate(date)}
      >
        <div className="pkc-schedule-list">
          {DEMO_TIME_SLOTS.map(
            (slot) => {
              const records =
                slotMap.get(
                  slot.value
                ) || [];

              return (
                <div
                  className="pkc-time-row"
                  key={slot.value}
                >
                  <div className="pkc-time-label">
                    <Clock3 size={17} />

                    <strong>
                      {slot.label}
                    </strong>
                  </div>

                  <div className="pkc-time-requests">
                    {records.length ? (
                      records.map(
                        (record) => (
                          <div
                            key={record.id}
                            className="pkc-schedule-visit"
                          >
                            <div>
                              <strong>
                                {record.petName}
                              </strong>

                              <span>
                                {getService(
                                  record.serviceId
                                )?.title ||
                                  "Care Service"}
                                {" · "}
                                {record.ownerAlias}
                              </span>
                            </div>

                            <StatusBadge
                              status={
                                record.status
                              }
                            />
                          </div>
                        )
                      )
                    ) : (
                      <span className="pkc-free-slot">
                        No demo requests
                        at this time
                      </span>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </Panel>

      <div className="pkc-notice">
        <CalendarDays size={20} />

        <p>
          This is a planning board,
          not a real appointment calendar.
          More than one demonstration
          request may select the same
          preferred time. No live
          availability is verified.
        </p>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 04 — SERVICE MANAGEMENT
// ==========================================

export function ClinicServicesPage() {
  const {
    isServiceActive,
    toggleService,
  } = useClinic();

  const activeCount =
    SERVICES.filter(
      (service) =>
        isServiceActive(service.id)
    ).length;

  return (
    <div className="pkc-page">
      <PageHeading
        label="SERVICE MANAGEMENT / 04"
        heading="THE CARE"
        accent="WE OFFER."
        description="Manage which service categories accept new demonstration visit requests."
      />

      <div className="pkc-stat-grid pkc-service-stats">
        <StatCard
          icon={Stethoscope}
          label="CARE SERVICES"
          value={SERVICES.length}
          note="Displayed on the public website"
          featured
        />

        <StatCard
          icon={CheckCircle2}
          label="ACCEPTING REQUESTS"
          value={activeCount}
          note="Selectable in the demo form"
        />

        <StatCard
          icon={Settings2}
          label="PAUSED SERVICES"
          value={
            SERVICES.length -
            activeCount
          }
          note="Temporarily unavailable in the demo form"
        />

        <StatCard
          icon={HeartPulse}
          label="DEMO TEAM"
          value={TEAM.length}
          note="Fictional team profiles"
        />
      </div>

      <div className="pkc-service-grid">
        {SERVICES.map(
          (service) => {
            const active =
              isServiceActive(
                service.id
              );

            return (
              <article
                className="pkc-service-card"
                key={service.id}
              >
                <div className="pkc-service-top">
                  <span>
                    {service.number} /
                    {service.category}
                  </span>

                  <StatusBadge
                    status={
                      active
                        ? "confirmed"
                        : "cancelled"
                    }
                  />
                </div>

                <div className="pkc-service-symbol">
                  <PawPrint size={27} />
                </div>

                <h2>
                  {service.title}
                </h2>

                <p>
                  {service.description}
                </p>

                <div className="pkc-service-bottom">
                  <span>
                    {service.duration}
                  </span>

                  <button
                    type="button"
                    className={
                      active
                        ? "pkc-pause-button"
                        : "pkc-activate-button"
                    }
                    onClick={() =>
                      toggleService(
                        service.id
                      )
                    }
                    aria-pressed={!active}
                  >
                    {active
                      ? "Pause Requests"
                      : "Enable Requests"}
                  </button>
                </div>
              </article>
            );
          }
        )}
      </div>

      <div className="pkc-notice">
        <ShieldCheck size={20} />

        <p>
          Pausing a service prevents
          new demo selections in the
          Request a Visit form. Existing
          saved requests will not be
          cancelled. The public Services
          page continues to show the
          full fictional clinic offering.
        </p>
      </div>
    </div>
  );
}