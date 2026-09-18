export const ACTION_OPTIONS = [
  { value: "reply_to_committee_report", label: "Reply to Committee Report" },
  { value: "suspension", label: "Suspension" },
  { value: "revoke", label: "Revoke" },
  { value: "fir", label: "FIR" },
  { value: "penalty", label: "Penalty" },
  { value: "blacklist", label: "Blacklist" },
  { value: "di_empaneled", label: "Di Empaneled" },
  { value: "stop_payment", label: "Stop Payment" },
] as const;

export const ACTION_LABELS: Record<string, string> = Object.fromEntries(
  ACTION_OPTIONS.map((o) => [o.value, o.label])
);

export const STATUS_COLORS: Record<string, string> = {
  NEW: "#F4B942",
  UNDER_REVIEW: "#7C6CF0",
  RESOLVED: "#34C38F",
  CLOSED: "#9CA3AF",
};

export const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};
