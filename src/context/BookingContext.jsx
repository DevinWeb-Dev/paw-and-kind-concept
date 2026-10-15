import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  DEMO_TIME_SLOTS,
  PET_TYPES,
  SERVICES,
  localDateISO,
} from "../data/siteData.js";

const BookingContext = createContext(null);

const STORAGE_KEY =
  "paw-and-kind-demo-visits-v1";

export const VISIT_STATUSES = {
  requested: "Requested",
  confirmed: "Confirmed",
  "checked-in": "Checked In",
  completed: "Completed",
  cancelled: "Cancelled",
};

const TRANSITIONS = {
  requested: ["confirmed", "cancelled"],
  confirmed: ["checked-in", "cancelled"],
  "checked-in": ["completed"],
  completed: [],
  cancelled: [],
};

function readRequests() {
  try {
    const raw = localStorage.getItem(
      STORAGE_KEY
    );

    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
          .filter(
            (item) =>
              item &&
              typeof item.id === "string"
          )
          .slice(0, 100)
      : [];
  } catch {
    return [];
  }
}

function makeId() {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function clean(value, limit) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, limit);
}

export function BookingProvider({
  children,
}) {
  const [requests, setRequests] =
    useState(readRequests);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(requests)
      );
    } catch (error) {
      console.warn(
        "Unable to save demo requests:",
        error
      );
    }
  }, [requests]);

  const requestVisit = useCallback(
    (input) => {
      const ownerAlias = clean(
        input.ownerAlias,
        50
      );
      const petName = clean(
        input.petName,
        50
      );
      const notes = clean(
        input.notes,
        300
      );

      if (!ownerAlias || !petName) {
        return {
          ok: false,
          error:
            "Enter a guardian alias and pet name.",
        };
      }

      if (
        !PET_TYPES.some(
          (type) =>
            type.value === input.petType
        )
      ) {
        return {
          ok: false,
          error:
            "Please select a valid pet type.",
        };
      }

      if (
        !SERVICES.some(
          (service) =>
            service.id === input.serviceId
        )
      ) {
        return {
          ok: false,
          error:
            "Please select a valid care service.",
        };
      }

      const date = input.date;

      if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date)
      ) {
        return {
          ok: false,
          error: "Choose a valid date.",
        };
      }

      const parsed = new Date(
        `${date}T12:00:00`
      );

      if (
        Number.isNaN(parsed.getTime()) ||
        localDateISO(parsed) !== date ||
        date < localDateISO()
      ) {
        return {
          ok: false,
          error:
            "Choose a current or future date.",
        };
      }

      if (parsed.getDay() === 0) {
        return {
          ok: false,
          error:
            "Sunday is unavailable in the demo schedule.",
        };
      }

      if (
        !DEMO_TIME_SLOTS.some(
          (slot) =>
            slot.value === input.time
        )
      ) {
        return {
          ok: false,
          error: "Select a valid time.",
        };
      }

      const id = makeId();

      const record = {
        id,
        reference: `PK-${Date.now()
          .toString(36)
          .toUpperCase()}-${id
          .slice(0, 4)
          .toUpperCase()}`,
        ownerAlias,
        petName,
        petType: input.petType,
        serviceId: input.serviceId,
        date,
        time: input.time,
        notes,
        status: "requested",
        createdAt: new Date().toISOString(),
      };

      setRequests((current) =>
        [record, ...current].slice(0, 100)
      );

      return { ok: true, record };
    },
    []
  );

  const setRequestStatus = useCallback(
    (id, nextStatus) => {
      const record = requests.find(
        (item) => item.id === id
      );

      if (!record) {
        return {
          ok: false,
          error: "Request not found.",
        };
      }

      const currentStatus =
        record.status || "requested";

      if (
        !TRANSITIONS[
          currentStatus
        ]?.includes(nextStatus)
      ) {
        return {
          ok: false,
          error:
            "That status change is not allowed.",
        };
      }

      setRequests((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: nextStatus,
                updatedAt:
                  new Date().toISOString(),
              }
            : item
        )
      );

      return { ok: true };
    },
    [requests]
  );

  const cancelRequest = useCallback(
    (id) => {
      const record = requests.find(
        (item) => item.id === id
      );

      if (
        !record ||
        !["requested", "confirmed"].includes(
          record.status || "requested"
        )
      ) {
        return;
      }

      setRequests((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "cancelled",
                updatedAt:
                  new Date().toISOString(),
              }
            : item
        )
      );
    },
    [requests]
  );

  const deleteCancelled = useCallback(
    (id) => {
      setRequests((current) =>
        current.filter(
          (item) =>
            item.id !== id ||
            item.status !== "cancelled"
        )
      );
    },
    []
  );

  const activeCount = requests.filter(
    (item) =>
      !["completed", "cancelled"].includes(
        item.status || "requested"
      )
  ).length;

  const value = useMemo(
    () => ({
      requests,
      activeCount,
      requestVisit,
      setRequestStatus,
      cancelRequest,
      deleteCancelled,
    }),
    [
      requests,
      activeCount,
      requestVisit,
      setRequestStatus,
      cancelRequest,
      deleteCancelled,
    ]
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookings() {
  const context = useContext(
    BookingContext
  );

  if (!context) {
    throw new Error(
      "useBookings requires BookingProvider."
    );
  }

  return context;
}