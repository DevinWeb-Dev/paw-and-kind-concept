import {
  DEMO_TIME_SLOTS,
  SERVICES,
  TEAM,
  localDateISO,
} from "./siteData.js";

import {
  VISIT_STATUSES,
} from "../context/BookingContext.jsx";

export const REPORT_TYPES = [
  {
    id: "appointments",
    label: "Appointment Records",
  },
  {
    id: "services",
    label: "Service Demand",
  },
  {
    id: "workload",
    label: "Team Assignments",
  },
  {
    id: "statuses",
    label: "Appointment Status Summary",
  },
  {
    id: "daily",
    label: "Daily Appointment Volume",
  },
  {
    id: "tasks",
    label: "Front Desk Tasks",
  },
];

const STATUS_KEYS = [
  "requested",
  "confirmed",
  "checked-in",
  "completed",
  "cancelled",
];

const TEAM_MAP = new Map(
  TEAM.map((person) => [
    person.id,
    person,
  ])
);

function requestStatus(record) {
  const status =
    record?.status || "requested";

  return STATUS_KEYS.includes(status)
    ? status
    : "requested";
}

function safeRequests(requests) {
  if (!Array.isArray(requests)) {
    return [];
  }

  return requests.filter(
    (record) =>
      record &&
      typeof record === "object" &&
      typeof record.id === "string"
  );
}

function countStatuses(records) {
  const counts = Object.fromEntries(
    STATUS_KEYS.map((key) => [
      key,
      0,
    ])
  );

  records.forEach((record) => {
    counts[requestStatus(record)] += 1;
  });

  return counts;
}

function ratio(value, total) {
  if (!total) return 0;

  return Math.round(
    (value / total) * 100
  );
}

function shiftDate(offset) {
  const date = new Date();

  date.setHours(12, 0, 0, 0);

  date.setDate(
    date.getDate() + offset
  );

  return localDateISO(date);
}

function createdDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? null
    : localDateISO(date);
}

function assignedTeamId(
  record,
  assignments
) {
  const candidate =
    assignments?.[record.id];

  return TEAM_MAP.has(candidate)
    ? candidate
    : "";
}

export function calculateClinicAnalytics({
  requests = [],
  assignments = {},
}) {
  const records =
    safeRequests(requests);

  const statuses =
    countStatuses(records);

  const today = localDateISO();

  const active = records.filter(
    (record) =>
      !["completed", "cancelled"].includes(
        requestStatus(record)
      )
  );

  const upcoming = active.filter(
    (record) =>
      typeof record.date === "string" &&
      record.date >= today
  );

  const assigned = records.filter(
    (record) =>
      Boolean(
        assignedTeamId(
          record,
          assignments
        )
      )
  );

  const resolved =
    statuses.completed +
    statuses.cancelled;

  const serviceRows = SERVICES.map(
    (service) => {
      const matches = records.filter(
        (record) =>
          record.serviceId ===
          service.id
      );

      return {
        ...service,

        requests: matches.length,

        active: matches.filter(
          (record) =>
            ![
              "completed",
              "cancelled",
            ].includes(
              requestStatus(record)
            )
        ).length,

        completed: matches.filter(
          (record) =>
            requestStatus(record) ===
            "completed"
        ).length,

        cancelled: matches.filter(
          (record) =>
            requestStatus(record) ===
            "cancelled"
        ).length,
      };
    }
  ).sort(
    (a, b) =>
      b.requests - a.requests ||
      a.number.localeCompare(b.number)
  );

  const teamRows = TEAM.map(
    (person) => {
      const matches = records.filter(
        (record) =>
          assignedTeamId(
            record,
            assignments
          ) === person.id
      );

      return {
        ...person,

        assigned: matches.length,

        active: matches.filter(
          (record) =>
            ![
              "completed",
              "cancelled",
            ].includes(
              requestStatus(record)
            )
        ).length,

        checkedIn: matches.filter(
          (record) =>
            requestStatus(record) ===
            "checked-in"
        ).length,

        completed: matches.filter(
          (record) =>
            requestStatus(record) ===
            "completed"
        ).length,
      };
    }
  ).sort(
    (a, b) =>
      b.assigned - a.assigned ||
      a.name.localeCompare(b.name)
  );

  const trend = Array.from(
    { length: 14 },
    (_, index) => {
      const date = shiftDate(
        index - 13
      );

      const created = records.filter(
        (record) =>
          createdDate(
            record.createdAt
          ) === date
      ).length;

      const completed = records.filter(
        (record) =>
          requestStatus(record) ===
            "completed" &&
          createdDate(
            record.updatedAt
          ) === date
      ).length;

      return {
        date,
        created,
        completed,
      };
    }
  );

  const calendar = Array.from(
    { length: 7 },
    (_, index) => {
      const date = shiftDate(index);

      const matches = upcoming.filter(
        (record) =>
          record.date === date
      );

      return {
        date,
        count: matches.length,
        confirmed: matches.filter(
          (record) =>
            requestStatus(record) ===
            "confirmed"
        ).length,
      };
    }
  );

  const slotRows =
    DEMO_TIME_SLOTS.map(
      (slot) => ({
        ...slot,
        requests: records.filter(
          (record) =>
            record.time ===
              slot.value &&
            requestStatus(record) !==
              "cancelled"
        ).length,
      })
    );

  return {
    total: records.length,
    statuses,

    activeCount: active.length,
    upcomingCount:
      upcoming.length,

    assignedCount:
      assigned.length,

    unassignedCount:
      records.length -
      assigned.length,

    completedShare:
      resolved
        ? ratio(
            statuses.completed,
            resolved
          )
        : null,

    serviceRows,
    teamRows,
    trend,
    calendar,
    slotRows,

    topService:
      serviceRows.find(
        (item) =>
          item.requests > 0
      ) || null,

    busiestSlot:
      [...slotRows]
        .sort(
          (a, b) =>
            b.requests -
            a.requests
        )
        .find(
          (item) =>
            item.requests > 0
        ) || null,
  };
}

function matchesDate(
  date,
  from,
  to
) {
  if (
    typeof date !== "string"
  ) {
    return false;
  }

  return (
    (!from || date >= from) &&
    (!to || date <= to)
  );
}

export function buildClinicReport({
  type,
  requests = [],
  assignments = {},
  tasks = [],
  from = "",
  to = "",
}) {
  const records = safeRequests(
    requests
  ).filter(
    (record) =>
      matchesDate(
        record.date,
        from,
        to
      )
  );

  const personName = (record) => {
    const id = assignedTeamId(
      record,
      assignments
    );

    return (
      TEAM_MAP.get(id)?.name ||
      "Unassigned"
    );
  };

  if (type === "appointments") {
    return {
      headers: [
        "Reference",
        "Preferred Date",
        "Preferred Time",
        "Service",
        "Status",
        "Assigned Team Member",
      ],

      rows: records.map(
        (record) => [
          record.reference ||
            record.id,

          record.date || "",

          record.time || "",

          SERVICES.find(
            (service) =>
              service.id ===
              record.serviceId
          )?.title || "Unknown",

          VISIT_STATUSES[
            requestStatus(record)
          ],

          personName(record),
        ]
      ),

      description:
        "Appointment references and operational information. Pet names, guardian aliases, and free-text notes are excluded.",
    };
  }

  if (type === "services") {
    const rows = SERVICES.map(
      (service) => {
        const matches =
          records.filter(
            (record) =>
              record.serviceId ===
              service.id
          );

        return [
          service.title,

          service.category,

          matches.length,

          matches.filter(
            (record) =>
              ![
                "completed",
                "cancelled",
              ].includes(
                requestStatus(record)
              )
          ).length,

          matches.filter(
            (record) =>
              requestStatus(record) ===
              "completed"
          ).length,

          matches.filter(
            (record) =>
              requestStatus(record) ===
              "cancelled"
          ).length,
        ];
      }
    );

    return {
      headers: [
        "Service",
        "Category",
        "Total Requests",
        "Active",
        "Completed",
        "Cancelled",
      ],
      rows,
      description:
        "Service demand based on demonstration appointment records.",
    };
  }

  if (type === "workload") {
    const rows = TEAM.map(
      (person) => {
        const matches =
          records.filter(
            (record) =>
              assignedTeamId(
                record,
                assignments
              ) === person.id
          );

        return [
          person.name,
          person.role,
          matches.length,
          matches.filter(
            (record) =>
              ![
                "completed",
                "cancelled",
              ].includes(
                requestStatus(record)
              )
          ).length,
          matches.filter(
            (record) =>
              requestStatus(record) ===
              "completed"
          ).length,
        ];
      }
    );

    const unassigned =
      records.filter(
        (record) =>
          !assignedTeamId(
            record,
            assignments
          )
      );

    rows.push([
      "Unassigned",
      "No Assignment",
      unassigned.length,
      unassigned.filter(
        (record) =>
          ![
            "completed",
            "cancelled",
          ].includes(
            requestStatus(record)
          )
      ).length,
      unassigned.filter(
        (record) =>
          requestStatus(record) ===
          "completed"
      ).length,
    ]);

    return {
      headers: [
        "Team Member",
        "Role",
        "Assigned Requests",
        "Active",
        "Completed",
      ],
      rows,
      description:
        "Manual demonstration assignments. Not employee productivity scores.",
    };
  }

  if (type === "statuses") {
    const statuses =
      countStatuses(records);

    return {
      headers: [
        "Status",
        "Request Count",
        "Share Percentage",
      ],

      rows: STATUS_KEYS.map(
        (status) => [
          VISIT_STATUSES[status],
          statuses[status],
          ratio(
            statuses[status],
            records.length
          ),
        ]
      ),

      description:
        "Appointment status distribution within the selected preferred-date range.",
    };
  }

  if (type === "daily") {
    const grouped = new Map();

    records.forEach(
      (record) => {
        const date = record.date;

        if (!grouped.has(date)) {
          grouped.set(date, {
            total: 0,
            active: 0,
            completed: 0,
          });
        }

        const group =
          grouped.get(date);

        group.total += 1;

        if (
          ![
            "completed",
            "cancelled",
          ].includes(
            requestStatus(record)
          )
        ) {
          group.active += 1;
        }

        if (
          requestStatus(record) ===
          "completed"
        ) {
          group.completed += 1;
        }
      }
    );

    return {
      headers: [
        "Preferred Date",
        "Total Requests",
        "Active",
        "Completed",
      ],

      rows: [
        ...grouped.entries(),
      ]
        .sort(
          (a, b) =>
            a[0].localeCompare(
              b[0]
            )
        )
        .map(
          ([date, group]) => [
            date,
            group.total,
            group.active,
            group.completed,
          ]
        ),

      description:
        "Requests grouped by preferred visit date, not confirmed calendar occupancy.",
    };
  }

  return {
    headers: [
      "Task",
      "Status",
    ],

    rows: (
      Array.isArray(tasks)
        ? tasks
        : []
    ).map((task) => [
      task.title || "",
      task.done
        ? "Completed"
        : "Pending",
    ]),

    description:
      "Front-desk tasks are not date-filtered.",
  };
}

function escapeCsv(value) {
  let text = String(
    value ?? ""
  );

  // Prevent formula injection
  // when opening CSV in Excel.
  if (/^\s*[=+\-@\t\r]/.test(text)) {
    text = "'" + text;
  }

  return `"${text.replaceAll(
    '"',
    '""'
  )}"`;
}

export function exportCsv(
  filename,
  headers,
  rows
) {
  const content = [
    headers,
    ...rows,
  ]
    .map(
      (row) =>
        row.map(escapeCsv).join(",")
    )
    .join("\r\n");

  const blob = new Blob(
    [
      "\uFEFF",
      content,
    ],
    {
      type:
        "text/csv;charset=utf-8",
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