import mongoose, { Schema, Document } from "mongoose";

export enum ShowcauseStatus {
  NEW = "NEW",
  UNDER_REVIEW = "UNDER_REVIEW",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface IAuditEntry {
  action: string;
  note: string;
  timestamp: Date;
}

export interface IShowcause extends Document {
  hospitalName: string;
  hospitalId: string;
  district: string;
  remarks: string;
  requiredDocuments: string[];
  actionTaken: string;
  status: ShowcauseStatus;
  sourceId: string;
  submittedAt: Date;
  auditLog: IAuditEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const auditEntrySchema = new Schema<IAuditEntry>(
  {
    action: { type: String, required: true },
    note: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const showcauseSchema = new Schema<IShowcause>(
  {
    hospitalName: { type: String, required: true, trim: true },
    hospitalId: { type: String, required: true, trim: true, index: true },
    district: { type: String, required: true, trim: true, index: true },
    remarks: { type: String, required: true },
    requiredDocuments: { type: [String], default: [] },
    actionTaken: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ShowcauseStatus),
      default: ShowcauseStatus.NEW,
      index: true,
    },
    sourceId: { type: String, default: "" },
    submittedAt: { type: Date, required: true },
    auditLog: { type: [auditEntrySchema], default: [] },
  },
  { timestamps: true }
);

// Compound unique index for duplicate detection
showcauseSchema.index({ hospitalId: 1, submittedAt: 1 }, { unique: true });

// Text index for search
showcauseSchema.index({
  hospitalName: "text",
  hospitalId: "text",
  district: "text",
  remarks: "text",
});

const Showcause =
  mongoose.models.Showcause ||
  mongoose.model<IShowcause>("Showcause", showcauseSchema);

export default Showcause;
