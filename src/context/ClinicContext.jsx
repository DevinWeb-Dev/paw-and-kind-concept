import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  SERVICES,
  TEAM,
} from "../data/siteData.js";

const ClinicContext =
  createContext(null);

const STORAGE_KEY =
  "paw-and-kind-clinic-operations-v1";

const DEFAULT_TASKS = [
  {
    id: "demo-task-1",
    title:
      "Review today's demo visit requests",
    done: false,
  },
  {
    id: "demo-task-2",
    title:
      "Check upcoming care schedule",
    done: false,
  },
  {
    id: "demo-task-3",
    title:
      "Prepare the sample front desk",
    done: false,
  },
];

function initialState() {
  return {
    pausedServices: [],
    notes: {},
    assignments: {},
    tasks: DEFAULT_TASKS.map(
      (task) => ({ ...task })
    ),
  };
}

function safeObject(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  )
    ? value
    : {};
}

function readStorage() {
  try {
    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {
      return initialState();
    }

    const data = JSON.parse(raw);

    if (
      !data ||
      typeof data !== "object"
    ) {
      return initialState();
    }

    const allowedServiceIds =
      new Set(
        SERVICES.map(
          (item) => item.id
        )
      );

    const allowedTeamIds =
      new Set(
        TEAM.map(
          (item) => item.id
        )
      );

    const assignments =
      Object.fromEntries(
        Object.entries(
          safeObject(
            data.assignments
          )
        ).filter(
          ([, value]) =>
            allowedTeamIds.has(
              value
            )
        )
      );

    return {
      pausedServices:
        Array.isArray(
          data.pausedServices
        )
          ? data.pausedServices.filter(
              (id) =>
                allowedServiceIds.has(
                  id
                )
            )
          : [],

      notes: Object.fromEntries(
        Object.entries(
          safeObject(data.notes)
        ).map(([id, note]) => [
          id,
          String(note ?? "").slice(
            0,
            400
          ),
        ])
      ),

      assignments,

      tasks: Array.isArray(
        data.tasks
      )
        ? data.tasks
            .filter(
              (item) =>
                item &&
                typeof item.id ===
                  "string"
            )
            .slice(0, 50)
            .map((task) => ({
              id: task.id,
              title: String(
                task.title || ""
              ).slice(0, 100),
              done: Boolean(
                task.done
              ),
            }))
        : DEFAULT_TASKS.map(
            (task) => ({
              ...task,
            })
          ),
    };
  } catch {
    return initialState();
  }
}

function createId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function ClinicProvider({
  children,
}) {
  const [data, setData] =
    useState(readStorage);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.warn(
        "Clinic demo storage error:",
        error
      );
    }
  }, [data]);

  const isServiceActive =
    useCallback(
      (serviceId) =>
        !data.pausedServices.includes(
          serviceId
        ),
      [data.pausedServices]
    );

  const toggleService =
    useCallback(
      (serviceId) => {
        if (
          !SERVICES.some(
            (service) =>
              service.id ===
              serviceId
          )
        ) {
          return;
        }

        setData((current) => ({
          ...current,

          pausedServices:
            current.pausedServices.includes(
              serviceId
            )
              ? current.pausedServices.filter(
                  (id) =>
                    id !== serviceId
                )
              : [
                  ...current.pausedServices,
                  serviceId,
                ],
        }));
      },
      []
    );

  const saveNote =
    useCallback(
      (requestId, text) => {
        if (!requestId) return;

        const value = String(
          text ?? ""
        ).slice(0, 400);

        setData((current) => ({
          ...current,
          notes: {
            ...current.notes,
            [requestId]: value,
          },
        }));
      },
      []
    );

  const addTask =
    useCallback((title) => {
      const clean = String(
        title ?? ""
      )
        .trim()
        .slice(0, 100);

      if (!clean) return;

      setData((current) => ({
        ...current,

        tasks: [
          {
            id: createId(),
            title: clean,
            done: false,
          },
          ...current.tasks,
        ].slice(0, 50),
      }));
    }, []);

  const toggleTask =
    useCallback((id) => {
      setData((current) => ({
        ...current,

        tasks: current.tasks.map(
          (task) =>
            task.id === id
              ? {
                  ...task,
                  done:
                    !task.done,
                }
              : task
        ),
      }));
    }, []);

  const deleteTask =
    useCallback((id) => {
      setData((current) => ({
        ...current,

        tasks:
          current.tasks.filter(
            (task) =>
              task.id !== id
          ),
      }));
    }, []);

  const assignTeamMember =
    useCallback(
      (
        requestId,
        teamId
      ) => {
        if (
          !requestId ||
          typeof requestId !==
            "string"
        ) {
          return {
            ok: false,
            error:
              "Invalid request.",
          };
        }

        if (
          teamId &&
          !TEAM.some(
            (person) =>
              person.id ===
              teamId
          )
        ) {
          return {
            ok: false,
            error:
              "Invalid team member.",
          };
        }

        setData((current) => {
          const next = {
            ...current.assignments,
          };

          if (teamId) {
            next[requestId] =
              teamId;
          } else {
            delete next[requestId];
          }

          return {
            ...current,
            assignments: next,
          };
        });

        return { ok: true };
      },
      []
    );

  const value = useMemo(
    () => ({
      pausedServices:
        data.pausedServices,

      notes: data.notes,
      tasks: data.tasks,
      assignments:
        data.assignments,

      isServiceActive,
      toggleService,

      saveNote,

      addTask,
      toggleTask,
      deleteTask,

      assignTeamMember,
    }),
    [
      data,
      isServiceActive,
      toggleService,
      saveNote,
      addTask,
      toggleTask,
      deleteTask,
      assignTeamMember,
    ]
  );

  return (
    <ClinicContext.Provider
      value={value}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context =
    useContext(
      ClinicContext
    );

  if (!context) {
    throw new Error(
      "useClinic must be used inside ClinicProvider."
    );
  }

  return context;
}