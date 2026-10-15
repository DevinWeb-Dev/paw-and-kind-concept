import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Heart,
  PawPrint,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  IMAGES,
  PET_TYPES,
  friendlyDate,
  localDateISO,
} from "../data/siteData.js";

import {
  AGE_GROUPS,
  JOURNAL_TYPES,
  REMINDER_TYPES,
  usePets,
} from "../context/PetContext.jsx";

function PageHeading({
  eyebrow,
  title,
  accent,
  description,
}) {
  return (
    <header className="pkp-page-heading">
      <span className="pkp-eyebrow">
        {eyebrow}
      </span>

      <h2>
        {title}
        <br />
        <em>{accent}</em>
      </h2>

      <p>{description}</p>
    </header>
  );
}

function EmptyState({
  icon: Icon = PawPrint,
  title,
  description,
  action,
}) {
  return (
    <div className="pkp-empty">
      <div className="pkp-empty-icon">
        <Icon size={33} />
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      {action}
    </div>
  );
}

function Feedback({ message }) {
  if (!message) return null;

  return (
    <div
      className={`pkp-feedback ${
        message.type === "error"
          ? "is-error"
          : "is-success"
      }`}
      role="status"
    >
      {message.type === "error" ? (
        <span>!</span>
      ) : (
        <CheckCircle2 size={18} />
      )}

      {message.text}
    </div>
  );
}

function getPet(pets, id) {
  return pets.find(
    (item) => item.id === id
  );
}

function typeLabel(type, options) {
  return (
    options.find(
      (item) =>
        item.id === type ||
        item.value === type
    )?.label || type
  );
}

function PetPhoto({
  type,
  name,
}) {
  const source =
    type === "cat"
      ? IMAGES.cat
      : type === "dog"
        ? IMAGES.dog
        : null;

  return (
    <div className="pkp-pet-photo">
      {source ? (
        <img
          src={source}
          alt={`${type} illustration for ${name}`}
          loading="lazy"
        />
      ) : (
        <PawPrint size={45} />
      )}
    </div>
  );
}

const EMPTY_PET = {
  name: "",
  type: "dog",
  ageGroup: "adult",
  favoriteThing: "",
};

// ======================================
// PAGE 01 — PET DASHBOARD
// ======================================

export function PetDashboardPage() {
  const {
    pets,
    journal,
    pendingReminders,
  } = usePets();

  const latestEntries = [
    ...journal,
  ]
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date)
    )
    .slice(0, 4);

  const nextReminders =
    pendingReminders.slice(0, 4);

  const today = localDateISO();

  return (
    <div className="pkp-page">
      <PageHeading
        eyebrow="PET PARENT DASHBOARD / 01"
        title="LOVE THE"
        accent="LITTLE DAYS."
        description="Keep everyday care organized, remember meaningful moments, and make room for more happy memories."
      />

      <div className="pkp-stats">
        <div className="pkp-stat is-featured">
          <span>
            REGISTERED PETS
          </span>

          <strong>
            {pets.length}
          </strong>

          <PawPrint size={22} />
        </div>

        <div className="pkp-stat">
          <span>
            JOURNAL ENTRIES
          </span>

          <strong>
            {journal.length}
          </strong>

          <BookOpen size={22} />
        </div>

        <div className="pkp-stat">
          <span>
            PENDING REMINDERS
          </span>

          <strong>
            {
              pendingReminders.length
            }
          </strong>

          <Bell size={22} />
        </div>
      </div>

      <section className="pkp-dashboard-feature">
        <div>
          <span className="pkp-eyebrow">
            THEIR STORY STARTS HERE
          </span>

          <h3>
            EVERY PET
            <br />
            HAS A <em>STORY.</em>
          </h3>

          <p>
            Create a profile for
            each companion, keep
            a simple wellness journal,
            and remember the little
            routines that make
            each day special.
          </p>

          <Link
            to="/pet-hub/pets"
            className="pk-button pk-button-coral"
          >
            Manage My Pets
            <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="pkp-dashboard-feature-image">
          <img
            src={IMAGES.puppy}
            alt="Happy companion dog"
            loading="lazy"
          />
        </div>
      </section>

      <div className="pkp-dashboard-columns">
        <section className="pkp-panel">
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                MY COMPANIONS
              </span>

              <h3>
                The little ones.
              </h3>
            </div>

            <Link
              to="/pet-hub/pets"
              className="pkp-text-link"
            >
              View All
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {pets.length ? (
            <div className="pkp-mini-pet-list">
              {pets.slice(0, 5).map(
                (pet) => (
                  <div
                    className="pkp-mini-pet"
                    key={pet.id}
                  >
                    <div className="pkp-mini-avatar">
                      <PawPrint size={20} />
                    </div>

                    <div>
                      <strong>
                        {pet.name}
                      </strong>

                      <span>
                        {typeLabel(
                          pet.type,
                          PET_TYPES
                        )}
                        {" · "}
                        {typeLabel(
                          pet.ageGroup,
                          AGE_GROUPS
                        )}
                      </span>
                    </div>

                    <Heart
                      size={17}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <EmptyState
              title="No profiles yet."
              description="Add your first companion to begin."
              action={
                <Link
                  to="/pet-hub/pets"
                  className="pkp-text-link"
                >
                  Add a Pet
                  <ArrowRight size={16} />
                </Link>
              }
            />
          )}
        </section>

        <section className="pkp-panel">
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                CARE CALENDAR
              </span>

              <h3>
                Coming up next.
              </h3>
            </div>

            <Link
              to="/pet-hub/reminders"
              className="pkp-text-link"
            >
              Reminders
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {nextReminders.length ? (
            <div className="pkp-small-list">
              {nextReminders.map(
                (item) => {
                  const pet = getPet(
                    pets,
                    item.petId
                  );

                  return (
                    <div
                      className="pkp-small-list-item"
                      key={item.id}
                    >
                      <div className="pkp-list-symbol">
                        <CalendarDays
                          size={18}
                        />
                      </div>

                      <div>
                        <strong>
                          {item.title}
                        </strong>

                        <span>
                          {pet?.name ||
                            "Pet"}
                          {" · "}
                          {friendlyDate(
                            item.date
                          )}
                        </span>
                      </div>

                      <small>
                        {item.date < today
                          ? "OVERDUE"
                          : "PLANNED"}
                      </small>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="All clear."
              description="No pending reminders. You can add care plans whenever you're ready."
              action={
                <Link
                  to="/pet-hub/reminders"
                  className="pkp-text-link"
                >
                  Plan Some Care
                  <ArrowRight size={16} />
                </Link>
              }
            />
          )}
        </section>
      </div>

      <section className="pkp-panel">
        <div className="pkp-panel-heading">
          <div>
            <span className="pkp-eyebrow">
              WELLNESS MOMENTS
            </span>

            <h3>
              Recent little moments.
            </h3>
          </div>

          <Link
            to="/pet-hub/journal"
            className="pkp-text-link"
          >
            Open Journal
            <ArrowUpRight size={16} />
          </Link>
        </div>

        {latestEntries.length ? (
          <div className="pkp-journal-preview">
            {latestEntries.map(
              (entry) => (
                <div key={entry.id}>
                  <small>
                    {friendlyDate(
                      entry.date
                    )}
                  </small>

                  <strong>
                    {entry.title}
                  </strong>

                  <span>
                    {getPet(
                      pets,
                      entry.petId
                    )?.name || "Pet"}
                    {" · "}
                    {typeLabel(
                      entry.type,
                      JOURNAL_TYPES
                    )}
                  </span>
                </div>
              )
            )}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="A fresh journal."
            description="Record everyday activities and happy little milestones."
            action={
              <Link
                to="/pet-hub/journal"
                className="pkp-text-link"
              >
                Write First Entry
                <ArrowRight size={16} />
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}

// ======================================
// PAGE 02 — PET PROFILES
// ======================================

export function PetProfilesPage() {
  const {
    pets,
    addPet,
    updatePet,
    removePet,
  } = usePets();

  const [form, setForm] =
    useState(EMPTY_PET);

  const [editingId, setEditingId] =
    useState(null);

  const [feedback, setFeedback] =
    useState(null);

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function clearForm() {
    setForm({ ...EMPTY_PET });
    setEditingId(null);
  }

  function submit(event) {
    event.preventDefault();

    const result = editingId
      ? updatePet(editingId, form)
      : addPet(form);

    if (!result.ok) {
      setFeedback({
        type: "error",
        text: result.error,
      });
      return;
    }

    setFeedback({
      type: "success",
      text: editingId
        ? "Pet profile updated."
        : "Pet profile created.",
    });

    clearForm();
  }

  function editPet(pet) {
    setEditingId(pet.id);

    setForm({
      name: pet.name,
      type: pet.type,
      ageGroup: pet.ageGroup,
      favoriteThing:
        pet.favoriteThing || "",
    });

    setFeedback(null);

    document
      .getElementById("pkp-pet-form")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  function deletePet(pet) {
    const approved = window.confirm(
      `Delete ${pet.name}'s profile?\n\nThis will also delete this pet's journal entries and reminders. This cannot be undone.`
    );

    if (!approved) return;

    removePet(pet.id);

    if (editingId === pet.id) {
      clearForm();
    }

    setFeedback({
      type: "success",
      text: "Pet profile and related records deleted.",
    });
  }

  return (
    <div className="pkp-page">
      <PageHeading
        eyebrow="PET PROFILES / 02"
        title="MEET MY"
        accent="LITTLE ONES."
        description="Give each companion a space of their own, with the little details that make them unique."
      />

      <div className="pkp-profile-layout">
        <section
          id="pkp-pet-form"
          className="pkp-panel"
        >
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                PROFILE EDITOR
              </span>

              <h3>
                {editingId
                  ? "Edit their story."
                  : "Add a companion."}
              </h3>
            </div>
          </div>

          <form
            className="pkp-form"
            onSubmit={submit}
          >
            <label>
              <span>PET NAME</span>

              <input
                required
                maxLength={45}
                placeholder="e.g. Mochi"
                value={form.name}
                onChange={(event) =>
                  update(
                    "name",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>COMPANION TYPE</span>

              <select
                value={form.type}
                onChange={(event) =>
                  update(
                    "type",
                    event.target.value
                  )
                }
              >
                {PET_TYPES.map(
                  (type) => (
                    <option
                      key={type.value}
                      value={type.value}
                    >
                      {type.label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>LIFE STAGE</span>

              <select
                value={form.ageGroup}
                onChange={(event) =>
                  update(
                    "ageGroup",
                    event.target.value
                  )
                }
              >
                {AGE_GROUPS.map(
                  (age) => (
                    <option
                      key={age.id}
                      value={age.id}
                    >
                      {age.label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>FAVORITE LITTLE THING</span>

              <input
                maxLength={90}
                placeholder="e.g. Afternoon walks"
                value={
                  form.favoriteThing
                }
                onChange={(event) =>
                  update(
                    "favoriteThing",
                    event.target.value
                  )
                }
              />
            </label>

            <Feedback
              message={feedback}
            />

            <button
              type="submit"
              className="pk-button pk-button-dark"
            >
              {editingId
                ? "Save Changes"
                : "Create Pet Profile"}

              <ArrowUpRight size={18} />
            </button>

            {editingId && (
              <button
                type="button"
                className="pkp-quiet-button"
                onClick={clearForm}
              >
                Cancel Editing
              </button>
            )}
          </form>
        </section>

        <div className="pkp-profile-results">
          {pets.length ? (
            pets.map((pet, index) => (
              <article
                className="pkp-pet-card"
                key={pet.id}
              >
                <PetPhoto
                  type={pet.type}
                  name={pet.name}
                />

                <div className="pkp-pet-card-content">
                  <span className="pkp-eyebrow">
                    COMPANION /{" "}
                    {String(index + 1)
                      .padStart(2, "0")}
                  </span>

                  <h3>{pet.name}</h3>

                  <p>
                    {typeLabel(
                      pet.type,
                      PET_TYPES
                    )}
                    {" · "}
                    {typeLabel(
                      pet.ageGroup,
                      AGE_GROUPS
                    )}
                  </p>

                  {pet.favoriteThing && (
                    <div className="pkp-favorite">
                      <Heart
                        size={15}
                        fill="currentColor"
                      />

                      Loves{" "}
                      {pet.favoriteThing}
                    </div>
                  )}

                  <div className="pkp-card-actions">
                    <button
                      type="button"
                      onClick={() =>
                        editPet(pet)
                      }
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
                      className="is-danger"
                      onClick={() =>
                        deletePet(pet)
                      }
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="No pets added."
              description="Complete the form to create your first demo pet profile."
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ======================================
// PAGE 03 — WELLNESS JOURNAL
// ======================================

export function WellnessJournalPage() {
  const {
    pets,
    journal,
    addJournalEntry,
    deleteJournalEntry,
  } = usePets();

  const [form, setForm] =
    useState({
      petId: "",
      type: "routine",
      title: "",
      date: localDateISO(),
      note: "",
    });

  const [filter, setFilter] =
    useState("all");

  const [feedback, setFeedback] =
    useState(null);

  const selectedPetId =
    pets.some(
      (pet) => pet.id === form.petId
    )
      ? form.petId
      : pets[0]?.id || "";

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    const result = addJournalEntry({
      ...form,
      petId: selectedPetId,
    });

    if (!result.ok) {
      setFeedback({
        type: "error",
        text: result.error,
      });

      return;
    }

    setForm((current) => ({
      ...current,
      title: "",
      note: "",
      date: localDateISO(),
    }));

    setFeedback({
      type: "success",
      text: "Wellness activity saved.",
    });
  }

  function deleteEntry(entry) {
    if (
      window.confirm(
        `Delete "${entry.title}" from the journal?`
      )
    ) {
      deleteJournalEntry(entry.id);
    }
  }

  const visible = [...journal]
    .filter(
      (entry) =>
        filter === "all" ||
        entry.petId === filter
    )
    .sort(
      (a, b) =>
        b.date.localeCompare(a.date)
    );

  return (
    <div className="pkp-page">
      <PageHeading
        eyebrow="WELLNESS JOURNAL / 03"
        title="THE LITTLE"
        accent="MOMENTS."
        description="A simple lifestyle journal for grooming days, playtime, routines, and everyday pet wellness."
      />

      <div className="pkp-content-grid">
        <section className="pkp-panel">
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                NEW JOURNAL ENTRY
              </span>

              <h3>
                Capture a moment.
              </h3>
            </div>
          </div>

          {pets.length ? (
            <form
              className="pkp-form"
              onSubmit={submit}
            >
              <label>
                <span>COMPANION</span>

                <select
                  value={selectedPetId}
                  onChange={(event) =>
                    update(
                      "petId",
                      event.target.value
                    )
                  }
                >
                  {pets.map((pet) => (
                    <option
                      key={pet.id}
                      value={pet.id}
                    >
                      {pet.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>ACTIVITY TYPE</span>

                <select
                  value={form.type}
                  onChange={(event) =>
                    update(
                      "type",
                      event.target.value
                    )
                  }
                >
                  {JOURNAL_TYPES.map(
                    (type) => (
                      <option
                        key={type.id}
                        value={type.id}
                      >
                        {type.label}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span>ACTIVITY TITLE</span>

                <input
                  required
                  maxLength={80}
                  placeholder="e.g. Morning walk"
                  value={form.title}
                  onChange={(event) =>
                    update(
                      "title",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>DATE</span>

                <input
                  type="date"
                  required
                  max={localDateISO()}
                  value={form.date}
                  onChange={(event) =>
                    update(
                      "date",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>NOTES (OPTIONAL)</span>

                <textarea
                  rows={4}
                  maxLength={260}
                  placeholder="A little memory about today's activity..."
                  value={form.note}
                  onChange={(event) =>
                    update(
                      "note",
                      event.target.value
                    )
                  }
                />
              </label>

              <Feedback message={feedback} />

              <button
                type="submit"
                className="pk-button pk-button-dark"
              >
                <Plus size={18} />
                Save Journal Entry
              </button>
            </form>
          ) : (
            <EmptyState
              title="Add a pet first."
              description="Create a pet profile before writing a journal entry."
              action={
                <Link
                  className="pk-button pk-button-dark"
                  to="/pet-hub/pets"
                >
                  Add a Pet
                  <ArrowUpRight size={17} />
                </Link>
              }
            />
          )}
        </section>

        <section className="pkp-panel">
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                JOURNAL HISTORY
              </span>

              <h3>
                Saved moments.
              </h3>
            </div>
          </div>

          <div className="pkp-filter-row">
            <select
              aria-label="Filter journal by pet"
              value={filter}
              onChange={(event) =>
                setFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Companions
              </option>

              {pets.map((pet) => (
                <option
                  key={pet.id}
                  value={pet.id}
                >
                  {pet.name}
                </option>
              ))}
            </select>
          </div>

          {visible.length ? (
            <div className="pkp-record-list">
              {visible.map((entry) => (
                <article
                  className="pkp-record"
                  key={entry.id}
                >
                  <div className="pkp-record-heading">
                    <span>
                      {friendlyDate(
                        entry.date
                      )}
                    </span>

                    <button
                      type="button"
                      aria-label={`Delete ${entry.title}`}
                      onClick={() =>
                        deleteEntry(entry)
                      }
                    >
                      <Trash2
                        size={16}
                      />
                    </button>
                  </div>

                  <h4>
                    {entry.title}
                  </h4>

                  <p className="pkp-record-category">
                    {getPet(
                      pets,
                      entry.petId
                    )?.name || "Pet"}
                    {" / "}
                    {typeLabel(
                      entry.type,
                      JOURNAL_TYPES
                    )}
                  </p>

                  {entry.note && (
                    <p className="pkp-record-note">
                      {entry.note}
                    </p>
                  )}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={BookOpen}
              title="Nothing logged yet."
              description="Saved everyday activities will appear here."
            />
          )}
        </section>
      </div>
    </div>
  );
}

// ======================================
// PAGE 04 — CARE REMINDERS
// ======================================

export function CareRemindersPage() {
  const {
    pets,
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
  } = usePets();

  const [form, setForm] =
    useState({
      petId: "",
      type: "grooming",
      title: "",
      date: localDateISO(),
    });

  const [filter, setFilter] =
    useState("pending");

  const [feedback, setFeedback] =
    useState(null);

  const selectedPetId =
    pets.some(
      (pet) => pet.id === form.petId
    )
      ? form.petId
      : pets[0]?.id || "";

  function update(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    const result = addReminder({
      ...form,
      petId: selectedPetId,
    });

    if (!result.ok) {
      setFeedback({
        type: "error",
        text: result.error,
      });

      return;
    }

    setForm((current) => ({
      ...current,
      title: "",
      date: localDateISO(),
    }));

    setFeedback({
      type: "success",
      text: "Care reminder saved.",
    });
  }

  const visible = [...reminders]
    .filter((item) => {
      if (filter === "pending") {
        return !item.completed;
      }

      if (filter === "completed") {
        return item.completed;
      }

      return true;
    })
    .sort((a, b) =>
      a.date.localeCompare(b.date)
    );

  const today = localDateISO();

  return (
    <div className="pkp-page">
      <PageHeading
        eyebrow="CARE REMINDERS / 04"
        title="NEVER MISS"
        accent="A LITTLE THING."
        description="Plan everyday care routines and keep track of important personal reminders."
      />

      <div className="pkp-content-grid">
        <section className="pkp-panel">
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                NEW REMINDER
              </span>

              <h3>
                Plan some care.
              </h3>
            </div>
          </div>

          {pets.length ? (
            <form
              className="pkp-form"
              onSubmit={submit}
            >
              <label>
                <span>COMPANION</span>

                <select
                  value={selectedPetId}
                  onChange={(event) =>
                    update(
                      "petId",
                      event.target.value
                    )
                  }
                >
                  {pets.map((pet) => (
                    <option
                      key={pet.id}
                      value={pet.id}
                    >
                      {pet.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span>CARE CATEGORY</span>

                <select
                  value={form.type}
                  onChange={(event) =>
                    update(
                      "type",
                      event.target.value
                    )
                  }
                >
                  {REMINDER_TYPES.map(
                    (type) => (
                      <option
                        key={type.id}
                        value={type.id}
                      >
                        {type.label}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span>REMINDER TITLE</span>

                <input
                  required
                  maxLength={80}
                  placeholder="e.g. Grooming day"
                  value={form.title}
                  onChange={(event) =>
                    update(
                      "title",
                      event.target.value
                    )
                  }
                />
              </label>

              <label>
                <span>TARGET DATE</span>

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
              </label>

              <Feedback message={feedback} />

              <button
                className="pk-button pk-button-dark"
                type="submit"
              >
                <Plus size={18} />
                Add Care Reminder
              </button>
            </form>
          ) : (
            <EmptyState
              title="Add your pet first."
              description="You need a pet profile before creating reminders."
              action={
                <Link
                  to="/pet-hub/pets"
                  className="pk-button pk-button-dark"
                >
                  Add a Pet
                  <ArrowUpRight size={17} />
                </Link>
              }
            />
          )}
        </section>

        <section className="pkp-panel">
          <div className="pkp-panel-heading">
            <div>
              <span className="pkp-eyebrow">
                REMINDER BOARD
              </span>

              <h3>
                The care list.
              </h3>
            </div>
          </div>

          <div className="pkp-tab-row">
            {[
              {
                id: "pending",
                label: "Pending",
              },
              {
                id: "completed",
                label: "Completed",
              },
              {
                id: "all",
                label: "All",
              },
            ].map((item) => (
              <button
                type="button"
                key={item.id}
                className={
                  filter === item.id
                    ? "is-active"
                    : ""
                }
                onClick={() =>
                  setFilter(item.id)
                }
              >
                {item.label}
              </button>
            ))}
          </div>

          {visible.length ? (
            <div className="pkp-reminder-list">
              {visible.map((item) => (
                <div
                  key={item.id}
                  className={`pkp-reminder ${
                    item.completed
                      ? "is-completed"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    className="pkp-reminder-check"
                    aria-label={
                      item.completed
                        ? "Mark reminder incomplete"
                        : "Complete reminder"
                    }
                    onClick={() =>
                      toggleReminder(item.id)
                    }
                  >
                    {item.completed ? (
                      <Check size={18} />
                    ) : (
                      <span />
                    )}
                  </button>

                  <div>
                    <strong>
                      {item.title}
                    </strong>

                    <span>
                      {getPet(
                        pets,
                        item.petId
                      )?.name || "Pet"}
                      {" · "}
                      {typeLabel(
                        item.type,
                        REMINDER_TYPES
                      )}
                    </span>

                    <small
                      className={
                        !item.completed &&
                        item.date < today
                          ? "is-overdue"
                          : ""
                      }
                    >
                      {friendlyDate(
                        item.date
                      )}

                      {!item.completed &&
                        item.date < today &&
                        " · Overdue"}
                    </small>
                  </div>

                  <button
                    type="button"
                    className="pkp-reminder-delete"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete the reminder "${item.title}"?`
                        )
                      ) {
                        deleteReminder(
                          item.id
                        );
                      }
                    }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Bell}
              title="No reminders found."
              description="Create a reminder or switch to another filter."
            />
          )}
        </section>
      </div>
    </div>
  );
}