export { cn } from "cn";

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function buildMongoFilter(params: {
  search?: string;
  status?: string;
  actionTaken?: string;
  district?: string;
  startDate?: string;
  endDate?: string;
}): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (params.search) {
    filter.$or = [
      { hospitalName: { $regex: params.search, $options: "i" } },
      { hospitalId: { $regex: params.search, $options: "i" } },
      { district: { $regex: params.search, $options: "i" } },
      { remarks: { $regex: params.search, $options: "i" } },
    ];
  }

  if (params.status) {
    filter.status = params.status;
  }

  if (params.actionTaken) {
    filter.actionTaken = params.actionTaken;
  }

  if (params.district) {
    filter.district = { $regex: params.district, $options: "i" };
  }

  if (params.startDate || params.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (params.startDate) dateFilter.$gte = new Date(params.startDate);
    if (params.endDate) dateFilter.$lte = new Date(params.endDate);
    filter.submittedAt = dateFilter;
  }

  return filter;
}
