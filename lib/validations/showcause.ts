import { z } from "zod";

export const createShowcauseSchema = z.object({
  hospitalName: z.string().min(1, "Hospital name is required").trim(),
  hospitalId: z.string().min(1, "Hospital ID is required").trim(),
  district: z.string().min(1, "District is required").trim(),
  remarks: z.string().min(1, "Remarks are required"),
  requiredDocuments: z
    .union([z.array(z.string()), z.string()])
    .transform((val) =>
      typeof val === "string"
        ? val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : val
    )
    .optional()
    .default([]),
  actionTaken: z.string().min(1, "Action taken is required"),
  sourceId: z.string().optional().default(""),
  submittedAt: z
    .string()
    .or(z.date())
    .transform((val) => new Date(val)),
});

export const updateShowcauseSchema = z.object({
  status: z.enum(["NEW", "UNDER_REVIEW", "RESOLVED", "CLOSED"]).optional(),
  remarks: z.string().optional(),
  auditNote: z.string().optional(),
});

export const showcauseQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(["NEW", "UNDER_REVIEW", "RESOLVED", "CLOSED"]).optional(),
  actionTaken: z.string().optional(),
  district: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.string().optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateShowcauseInput = z.infer<typeof createShowcauseSchema>;
export type UpdateShowcauseInput = z.infer<typeof updateShowcauseSchema>;
export type ShowcauseQuery = z.infer<typeof showcauseQuerySchema>;
