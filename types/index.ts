export type ShowcauseStatus = "NEW" | "UNDER_REVIEW" | "RESOLVED" | "CLOSED";

export interface AuditEntry {
  action: string;
  note: string;
  timestamp: string;
}

export interface Showcause {
  _id: string;
  hospitalName: string;
  hospitalId: string;
  district: string;
  blockTaluka: string;
  remarks: string;
  requiredDocuments: string[];
  actionTaken: string;
  status: ShowcauseStatus;
  sourceId: string;
  submittedAt: string;
  auditLog: AuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface ShowcauseListResponse {
  data: Showcause[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StatsResponse {
  total: number;
  byStatus: Record<ShowcauseStatus, number>;
  byDistrict: { district: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
}

export interface ShowcauseFilters {
  search?: string;
  status?: ShowcauseStatus | "";
  district?: string;
  blockTaluka?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}
