import {
  useState,
} from "react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Heart,
  Info,
  PawPrint,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  DEMO_TIME_SLOTS,
  PET_TYPES,
  SERVICES,
  IMAGES,
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

function Intro({
  eyebrow,
  title,
  accent,
  description,
}) {
  return (
    <header className="pk-booking-heading">
      <span className="pk-kicker">
        <span className="pk-kicker-dot" />
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

function Notice({ children }) {
  return (
    <div className="pk-booking-notice">
      <Info size={19} />

      <p>{children}</p>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}) {
  return (
    <label className="pk-form-field">
      <span>{label}</span>

      {children}

      {hint && (
        <small>{hint}</small>
      )}
    </label>
  );
}

// ======================================
// REQUEST VISIT
// ======================================

export function RequestVisitPage() {
  const [searchParams] =
    useSearchParams();

  const {
    requestVisit,
  } = useBookings();

  const {
    isServiceActive,
  } = useClinic();

  const availableServices =
    SERVICES.filter(
      (service) =>
        isServiceActive(service.id)
    );

  const requestedService =
    searchParams.get("service");

  const initialService =
    availableServices.some(
      (item) =>
        item.id === requestedService
    )
      ? requestedService
      : availableServices[0]?.id || "";

  const [form, setForm] = useState({
    ownerAlias: "",
    petName: "",
    petType: "dog",
    serviceId: initialService,
    date: "",
    time: DEMO_TIME_SLOTS[0].value,
    notes: "",
  });

  const [agreed, setAgreed] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(null);

  const selectedId =
    availableServices.some(
      (item) =>
        item.id === form.serviceId
    )
      ? form.serviceId
      : availableServices[0]?.id || "";

  const selectedService =
    availableServices.find(
      (item) => item.id === selectedId
    );

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function submit(event) {
    event.preventDefault();

    if (!selectedId) {
      setError(
        "All services are paused in this demo. Please try again after a service is enabled."
      );
      return;
    }

    if (!agreed) {
      setError(
        "Please confirm that you understand this is only a demonstration request."
      );
      return;
    }

    const result = requestVisit({
      ...form,
      serviceId: selectedId,
    });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(result.record);
    window.scrollTo(0, 0);
  }

  function resetForm() {
    setSuccess(null);
    setAgreed(false);
    setError("");

    setForm({
      ownerAlias: "",
      petName: "",
      petType: "dog",
      serviceId:
        availableServices[0]?.id || "",
      date: "",
      time: DEMO_TIME_SLOTS[0].value,
      notes: "",
    });
  }

  if (success) {
    const service = SERVICES.find(
      (item) =>
        item.id === success.serviceId
    );

    return (
      <section className="pk-booking-page">
        <div className="pk-container pk-success-wrap">
          <div className="pk-success-icon">
            <CheckCircle2 size={44} />
          </div>

          <span className="pk-kicker">
            DEMO REQUEST SAVED
          </span>

          <h1>
            HIGH PAWS,
            <br />
            <em>
              {success.petName}!
            </em>
          </h1>

          <p>
            Your visit request has been
            saved in this browser.
            It is not a confirmed
            veterinary appointment.
          </p>

          <div className="pk-success-summary">
            <div>
              <span>REFERENCE</span>
              <strong>
                {success.reference}
              </strong>
            </div>

            <div>
              <span>REQUEST STATUS</span>
              <strong>
                Requested
              </strong>
            </div>

            <div>
              <span>DATE & TIME</span>
              <strong>
                {friendlyDate(success.date)}
                {" · "}
                {timeLabel(success.time)}
              </strong>
            </div>

            <div>
              <span>CARE SERVICE</span>
              <strong>
                {service?.title ||
                  "Care Service"}
              </strong>
            </div>
          </div>

          <div className="pk-success-actions">
            <Link
              to="/visits"
              className="pk-button pk-button-dark"
            >
              View My Visits
              <ArrowUpRight size={18} />
            </Link>

            <button
              type="button"
              className="pk-button pk-button-outline"
              onClick={resetForm}
            >
              Another Demo Request
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="pk-booking-page">
      <div className="pk-container">
        <Intro
          eyebrow="A KINDER WAY TO PLAN A VISIT"
          title="A VISIT"
          accent="WITH HEART."
          description="Tell us about your companion and select a preferred date and time for this interactive appointment demonstration."
        />

        <div className="pk-booking-grid">
          <form
            className="pk-booking-form"
            onSubmit={submit}
          >
            <div className="pk-booking-step-title">
              <span>01</span>

              <div>
                <h2>
                  Meet your little one.
                </h2>

                <p>
                  Start with their name
                  and a guardian alias.
                </p>
              </div>
            </div>

            <div className="pk-form-grid">
              <Field label="GUARDIAN ALIAS">
                <input
                  required
                  maxLength={50}
                  value={form.ownerAlias}
                  placeholder="e.g. Alex"
                  onChange={(event) =>
                    update(
                      "ownerAlias",
                      event.target.value
                    )
                  }
                />
              </Field>

              <Field label="PET NAME">
                <input
                  required
                  maxLength={50}
                  value={form.petName}
                  placeholder="e.g. Mochi"
                  onChange={(event) =>
                    update(
                      "petName",
                      event.target.value
                    )
                  }
                />
              </Field>
            </div>

            <div className="pk-form-field">
              <span>MY PET IS A...</span>

              <div className="pk-pet-type-grid">
                {PET_TYPES.map(
                  (item) => (
                    <button
                      type="button"
                      key={item.value}
                      className={
                        form.petType ===
                        item.value
                          ? "is-selected"
                          : ""
                      }
                      onClick={() =>
                        update(
                          "petType",
                          item.value
                        )
                      }
                    >
                      <PawPrint size={21} />

                      {item.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="pk-booking-step-title pk-booking-next-step">
              <span>02</span>

              <div>
                <h2>
                  Choose their care.
                </h2>

                <p>
                  Services are controlled
                  by the demo front desk.
                </p>
              </div>
            </div>

            {availableServices.length ? (
              <>
                <Field label="CARE SERVICE">
                  <select
                    value={selectedId}
                    onChange={(event) =>
                      update(
                        "serviceId",
                        event.target.value
                      )
                    }
                  >
                    {availableServices.map(
                      (service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.title}
                        </option>
                      )
                    )}
                  </select>
                </Field>

                {selectedService && (
                  <div className="pk-selected-service">
                    <Heart
                      size={18}
                      fill="currentColor"
                    />

                    <div>
                      <strong>
                        {
                          selectedService.tagline
                        }
                      </strong>

                      <span>
                        Sample duration:{" "}
                        {
                          selectedService.duration
                        }
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Notice>
                All care service requests
                are currently paused in
                this demo.
              </Notice>
            )}

            <div className="pk-booking-step-title pk-booking-next-step">
              <span>03</span>

              <div>
                <h2>
                  Pick a preferred time.
                </h2>

                <p>
                  These are example time
                  slots, not actual
                  availability.
                </p>
              </div>
            </div>

            <div className="pk-form-grid">
              <Field label="PREFERRED DATE">
                <input
                  type="date"
                  required
                  min={localDateISO()}
                  value={form.date}
                  onChange={(event) =>
                    update(
                      "date",
                      event.target.value
                    )
                  }
                />
              </Field>

              <Field label="PREFERRED TIME">
                <select
                  value={form.time}
                  onChange={(event) =>
                    update(
                      "time",
                      event.target.value
                    )
                  }
                >
                  {DEMO_TIME_SLOTS.map(
                    (slot) => (
                      <option
                        key={slot.value}
                        value={slot.value}
                      >
                        {slot.label}
                      </option>
                    )
                  )}
                </select>
              </Field>
            </div>

            <Field
              label="OPTIONAL NOTE"
              hint="Fictional demo notes only. Do not enter actual medical information."
            >
              <textarea
                rows={4}
                maxLength={300}
                value={form.notes}
                placeholder="e.g. Mochi is shy around strangers."
                onChange={(event) =>
                  update(
                    "notes",
                    event.target.value
                  )
                }
              />
            </Field>

            <label className="pk-agreement">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) =>
                  setAgreed(
                    event.target.checked
                  )
                }
              />

              <span>
                I understand that this
                is a portfolio demo.
                Requests are stored
                only in this browser
                and are not sent to a
                real veterinary clinic.
              </span>
            </label>

            {error && (
              <div
                className="pk-form-error"
                role="alert"
              >
                <XCircle size={19} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="pk-button pk-button-dark pk-submit-button"
              disabled={!selectedId}
            >
              Save Demo Request
              <ArrowUpRight size={19} />
            </button>
          </form>

          <aside className="pk-booking-sidebar">
            <div className="pk-booking-side-photo">
              <img
                src={IMAGES.dog}
                alt="Happy companion dog"
                loading="lazy"
              />

              <div>
                <PawPrint size={22} />

                <span>
                  GOOD CARE STARTS
                  WITH KINDNESS.
                </span>
              </div>
            </div>

            <div className="pk-booking-aside-panel">
              <span className="pk-kicker">
                YOUR VISIT, YOUR WAY
              </span>

              <h3>
                A little reminder.
              </h3>

              <div className="pk-booking-tip">
                <CalendarDays
                  size={20}
                />

                <span>
                  Monday–Saturday
                  in the sample
                  scheduling system.
                </span>
              </div>

              <div className="pk-booking-tip">
                <Clock3 size={20} />

                <span>
                  Choose a preferred
                  demonstration time.
                </span>
              </div>

              <div className="pk-booking-tip">
                <ShieldCheck
                  size={20}
                />

                <span>
                  Requests stay
                  on this device.
                </span>
              </div>
            </div>

            <Notice>
              <strong>
                Not for emergencies.
              </strong>{" "}
              This demo cannot contact
              a veterinary clinic.
              Seek real veterinary help
              for urgent concerns.
            </Notice>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ======================================
// MY VISITS
// ======================================

export function MyVisitsPage() {
  const {
    requests,
    activeCount,
    cancelRequest,
    deleteCancelled,
  } = useBookings();

  const [filter, setFilter] =
    useState("all");

  const visible = requests.filter(
    (record) => {
      const status =
        record.status || "requested";

      if (filter === "all") {
        return true;
      }

      if (filter === "active") {
        return ![
          "completed",
          "cancelled",
        ].includes(status);
      }

      return status === filter;
    }
  );

  function cancel(record) {
    if (
      window.confirm(
        `Cancel the demo visit for ${record.petName}?`
      )
    ) {
      cancelRequest(record.id);
    }
  }

  function remove(record) {
    if (
      window.confirm(
        `Delete the cancelled demo record for ${record.petName}?`
      )
    ) {
      deleteCancelled(record.id);
    }
  }

  return (
    <div className="pk-booking-page pk-visits-page">
      <div className="pk-container">
        <Intro
          eyebrow="THE LITTLE DETAILS, ALL IN ONE PLACE"
          title="MY PET'S"
          accent="VISITS."
          description="View the current status of your browser-local demonstration appointment requests."
        />

        <div className="pk-visit-stats">
          <div>
            <span>TOTAL REQUESTS</span>
            <strong>
              {requests.length}
            </strong>
          </div>

          <div>
            <span>ACTIVE REQUESTS</span>
            <strong>
              {activeCount}
            </strong>
          </div>

          <div>
            <span>COMPLETED</span>
            <strong>
              {
                requests.filter(
                  (record) =>
                    record.status ===
                    "completed"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="pk-visits-toolbar">
          <div className="pk-visit-filters">
            {[
              ["all", "All Requests"],
              ["active", "Active"],
              ["completed", "Completed"],
              ["cancelled", "Cancelled"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={
                  filter === id
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  setFilter(id)
                }
              >
                {label}
              </button>
            ))}
          </div>

          <Link
            to="/request"
            className="pk-button pk-button-dark"
          >
            New Request
            <ArrowUpRight size={17} />
          </Link>
        </div>

        {visible.length ? (
          <div className="pk-visits-list">
            {visible.map(
              (record) => {
                const status =
                  record.status ||
                  "requested";

                const service =
                  SERVICES.find(
                    (item) =>
                      item.id ===
                      record.serviceId
                  );

                const cancellable =
                  [
                    "requested",
                    "confirmed",
                  ].includes(status);

                return (
                  <article
                    key={record.id}
                    className="pk-visit-card"
                  >
                    <div className="pk-visit-card-top">
                      <div className="pk-visit-pet-icon">
                        <PawPrint
                          size={26}
                        />
                      </div>

                      <div className="pk-visit-pet">
                        <span>
                          {record.reference}
                        </span>

                        <h2>
                          {record.petName}
                        </h2>

                        <p>
                          {record.petType}
                          {" · "}
                          Guardian:{" "}
                          {record.ownerAlias}
                        </p>
                      </div>

                      <span
                        className={`pk-visit-status ${status}`}
                      >
                        {VISIT_STATUSES[
                          status
                        ] || "Requested"}
                      </span>
                    </div>

                    <div className="pk-visit-details">
                      <div>
                        <span>
                          CARE SERVICE
                        </span>

                        <strong>
                          {service?.title ||
                            "Care Service"}
                        </strong>
                      </div>

                      <div>
                        <span>DATE</span>

                        <strong>
                          {friendlyDate(
                            record.date
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>TIME</span>

                        <strong>
                          {timeLabel(
                            record.time
                          )}
                        </strong>
                      </div>
                    </div>

                    {record.notes && (
                      <p className="pk-visit-notes">
                        <strong>
                          DEMO NOTE:
                        </strong>{" "}
                        {record.notes}
                      </p>
                    )}

                    <div className="pk-visit-card-bottom">
                      <span>
                        This status is
                        part of the
                        local demo only.
                      </span>

                      {cancellable && (
                        <button
                          type="button"
                          className="pk-visit-cancel"
                          onClick={() =>
                            cancel(record)
                          }
                        >
                          <XCircle
                            size={17}
                          />
                          Cancel Request
                        </button>
                      )}

                      {status ===
                        "cancelled" && (
                        <button
                          type="button"
                          className="pk-visit-cancel"
                          onClick={() =>
                            remove(record)
                          }
                        >
                          <Trash2
                            size={16}
                          />
                          Delete Record
                        </button>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        ) : (
          <div className="pk-visits-empty">
            <div>
              <PawPrint size={45} />
            </div>

            <h2>
              NO LITTLE PAWS
              <br />
              <em>HERE YET.</em>
            </h2>

            <p>
              No demo requests match
              this filter. Add a sample
              visit to begin.
            </p>

            <Link
              to="/request"
              className="pk-button pk-button-dark"
            >
              Request a Demo Visit
              <ArrowUpRight size={18} />
            </Link>
          </div>
        )}

        <Notice>
          These statuses are changed
          through the accessible demo
          Clinic Portal. They do not
          represent real confirmation,
          staff approval, or completed
          veterinary treatment.
        </Notice>
      </div>
    </div>
  );
}