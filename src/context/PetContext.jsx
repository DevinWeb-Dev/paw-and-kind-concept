import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  PET_TYPES,
  localDateISO,
} from "../data/siteData.js";

const PetContext = createContext(null);

const STORAGE_KEY =
  "paw-and-kind-pet-parent-v1";

export const AGE_GROUPS = [
  { id: "baby", label: "Puppy / Kitten" },
  { id: "young", label: "Young" },
  { id: "adult", label: "Adult" },
  { id: "senior", label: "Senior" },
];

export const JOURNAL_TYPES = [
  { id: "routine", label: "Daily Routine" },
  { id: "grooming", label: "Grooming" },
  { id: "play", label: "Play & Activity" },
  { id: "nutrition", label: "Feeding Routine" },
  { id: "wellness", label: "General Wellness" },
];

export const REMINDER_TYPES = [
  { id: "grooming", label: "Grooming" },
  { id: "routine", label: "Daily Care" },
  { id: "nutrition", label: "Feeding Routine" },
  { id: "appointment", label: "Visit Reminder" },
  { id: "other", label: "Other Care" },
];

function blankData() {
  return {
    pets: [],
    journal: [],
    reminders: [],
  };
}

function loadData() {
  try {
    const raw = localStorage.getItem(
      STORAGE_KEY
    );

    if (!raw) return blankData();

    const saved = JSON.parse(raw);

    if (
      !saved ||
      typeof saved !== "object"
    ) {
      return blankData();
    }

    const safeArray = (value, limit) =>
      Array.isArray(value)
        ? value
            .filter(
              (item) =>
                item &&
                typeof item === "object" &&
                typeof item.id === "string"
            )
            .slice(0, limit)
        : [];

    return {
      pets: safeArray(saved.pets, 20),
      journal: safeArray(saved.journal, 120),
      reminders: safeArray(
        saved.reminders,
        120
      ),
    };
  } catch {
    return blankData();
  }
}

function createId(prefix) {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

function clean(value, maximum = 80) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, maximum);
}

function isValidDate(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(
    `${value}T12:00:00`
  );

  return (
    !Number.isNaN(date.getTime()) &&
    localDateISO(date) === value
  );
}

function validatePet(input) {
  const name = clean(input.name, 45);
  const type = input.type;
  const ageGroup = input.ageGroup;
  const favoriteThing = clean(
    input.favoriteThing,
    90
  );

  if (!name) {
    return {
      ok: false,
      error: "Enter your pet's name.",
    };
  }

  if (
    !PET_TYPES.some(
      (item) => item.value === type
    )
  ) {
    return {
      ok: false,
      error: "Select a pet type.",
    };
  }

  if (
    !AGE_GROUPS.some(
      (item) => item.id === ageGroup
    )
  ) {
    return {
      ok: false,
      error: "Select an age group.",
    };
  }

  return {
    ok: true,
    values: {
      name,
      type,
      ageGroup,
      favoriteThing,
    },
  };
}

export function PetProvider({
  children,
}) {
  const [data, setData] =
    useState(loadData);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn(
        "Pet Parent demo data could not be saved:",
        error
      );
    }
  }, [data]);

  const addPet = useCallback(
    (input) => {
      const result =
        validatePet(input);

      if (!result.ok) {
        return result;
      }

      if (data.pets.length >= 20) {
        return {
          ok: false,
          error:
            "This demo supports up to 20 pet profiles.",
        };
      }

      const pet = {
        id: createId("pet"),
        ...result.values,
        createdAt:
          new Date().toISOString(),
      };

      setData((current) => ({
        ...current,
        pets: [
          pet,
          ...current.pets,
        ],
      }));

      return {
        ok: true,
        pet,
      };
    },
    [data.pets.length]
  );

  const updatePet = useCallback(
    (id, input) => {
      const result =
        validatePet(input);

      if (!result.ok) {
        return result;
      }

      if (
        !data.pets.some(
          (pet) => pet.id === id
        )
      ) {
        return {
          ok: false,
          error: "Pet not found.",
        };
      }

      setData((current) => ({
        ...current,
        pets: current.pets.map(
          (pet) =>
            pet.id === id
              ? {
                  ...pet,
                  ...result.values,
                  updatedAt:
                    new Date().toISOString(),
                }
              : pet
        ),
      }));

      return { ok: true };
    },
    [data.pets]
  );

  const removePet = useCallback((id) => {
    setData((current) => ({
      ...current,

      pets: current.pets.filter(
        (pet) => pet.id !== id
      ),

      journal: current.journal.filter(
        (entry) => entry.petId !== id
      ),

      reminders: current.reminders.filter(
        (item) => item.petId !== id
      ),
    }));
  }, []);

  const addJournalEntry = useCallback(
    (input) => {
      const title = clean(
        input.title,
        80
      );

      const note = clean(
        input.note,
        260
      );

      if (
        !data.pets.some(
          (pet) => pet.id === input.petId
        )
      ) {
        return {
          ok: false,
          error: "Select an existing pet.",
        };
      }

      if (
        !JOURNAL_TYPES.some(
          (type) =>
            type.id === input.type
        )
      ) {
        return {
          ok: false,
          error: "Select an activity type.",
        };
      }

      if (!title) {
        return {
          ok: false,
          error: "Enter an activity title.",
        };
      }

      if (
        !isValidDate(input.date) ||
        input.date > localDateISO()
      ) {
        return {
          ok: false,
          error:
            "Choose a valid current or past date.",
        };
      }

      const entry = {
        id: createId("entry"),
        petId: input.petId,
        type: input.type,
        title,
        note,
        date: input.date,
        createdAt:
          new Date().toISOString(),
      };

      setData((current) => ({
        ...current,
        journal: [
          entry,
          ...current.journal,
        ].slice(0, 120),
      }));

      return {
        ok: true,
        entry,
      };
    },
    [data.pets]
  );

  const deleteJournalEntry =
    useCallback((id) => {
      setData((current) => ({
        ...current,
        journal: current.journal.filter(
          (entry) => entry.id !== id
        ),
      }));
    }, []);

  const addReminder = useCallback(
    (input) => {
      const title = clean(
        input.title,
        80
      );

      if (
        !data.pets.some(
          (pet) => pet.id === input.petId
        )
      ) {
        return {
          ok: false,
          error: "Select an existing pet.",
        };
      }

      if (
        !REMINDER_TYPES.some(
          (type) =>
            type.id === input.type
        )
      ) {
        return {
          ok: false,
          error: "Select a reminder category.",
        };
      }

      if (!title) {
        return {
          ok: false,
          error: "Enter a reminder title.",
        };
      }

      if (
        !isValidDate(input.date) ||
        input.date < localDateISO()
      ) {
        return {
          ok: false,
          error:
            "Choose a valid current or future date.",
        };
      }

      const reminder = {
        id: createId("reminder"),
        petId: input.petId,
        type: input.type,
        title,
        date: input.date,
        completed: false,
        createdAt:
          new Date().toISOString(),
      };

      setData((current) => ({
        ...current,
        reminders: [
          reminder,
          ...current.reminders,
        ].slice(0, 120),
      }));

      return {
        ok: true,
        reminder,
      };
    },
    [data.pets]
  );

  const toggleReminder = useCallback(
    (id) => {
      setData((current) => ({
        ...current,
        reminders:
          current.reminders.map(
            (reminder) =>
              reminder.id === id
                ? {
                    ...reminder,
                    completed:
                      !reminder.completed,
                  }
                : reminder
          ),
      }));
    },
    []
  );

  const deleteReminder = useCallback(
    (id) => {
      setData((current) => ({
        ...current,
        reminders:
          current.reminders.filter(
            (reminder) =>
              reminder.id !== id
          ),
      }));
    },
    []
  );

  const pendingReminders = useMemo(
    () =>
      data.reminders
        .filter(
          (item) => !item.completed
        )
        .sort((a, b) =>
          a.date.localeCompare(b.date)
        ),
    [data.reminders]
  );

  const value = useMemo(
    () => ({
      pets: data.pets,
      journal: data.journal,
      reminders: data.reminders,

      pendingReminders,

      addPet,
      updatePet,
      removePet,

      addJournalEntry,
      deleteJournalEntry,

      addReminder,
      toggleReminder,
      deleteReminder,
    }),
    [
      data,
      pendingReminders,
      addPet,
      updatePet,
      removePet,
      addJournalEntry,
      deleteJournalEntry,
      addReminder,
      toggleReminder,
      deleteReminder,
    ]
  );

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}

export function usePets() {
  const context = useContext(
    PetContext
  );

  if (!context) {
    throw new Error(
      "usePets must be used inside PetProvider."
    );
  }

  return context;
}