import mongoose, { Schema, Document } from 'mongoose';

export interface IVettingRequest extends Document {
  _id: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  // Request Type
  type: 'new-agency' | 'license-renewal' | 'slot-update' | 'capacity-increase' | 'zone-expansion';
  // Status
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'more-info-needed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  // Request Details
  title: string;
  description: string;
  // Documents
  documents: {
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
    verified: boolean;
  }[];
  // Verification Data
  trustScore: number; // 0-100
  verificationChecklist: {
    item: string;
    status: 'pending' | 'verified' | 'failed';
    notes?: string;
    verifiedBy?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
  }[];
  // Processing
  assignedTo?: mongoose.Types.ObjectId;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  rejectionReason?: string;
  // Additional Data (for slot updates)
  requestData?: {
    currentCapacity?: number;
    requestedCapacity?: number;
    currentZones?: string[];
    requestedZones?: string[];
    licenseExpiry?: Date;
    newLicenseExpiry?: Date;
  };
  // Timeline
  submittedAt: Date;
  lastUpdatedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VettingRequestSchema = new Schema<IVettingRequest>({
  agencyId: {
    type: Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['new-agency', 'license-renewal', 'slot-update', 'capacity-increase', 'zone-expansion']
  },
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'more-info-needed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false }
  }],
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  verificationChecklist: [{
    item: String,
    status: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending'
    },
    notes: String,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date
  }],
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: String,
  rejectionReason: String,
  requestData: {
    currentCapacity: Number,
    requestedCapacity: Number,
    currentZones: [String],
    requestedZones: [String],
    licenseExpiry: Date,
    newLicenseExpiry: Date
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

// Indexes
VettingRequestSchema.index({ status: 1, submittedAt: -1 });
VettingRequestSchema.index({ agencyId: 1 });
VettingRequestSchema.index({ type: 1, status: 1 });

// Update lastUpdatedAt on every save
VettingRequestSchema.pre('save', function(next) {
  this.lastUpdatedAt = new Date();
  next();
});

const VettingRequest = mongoose.model<IVettingRequest>('VettingRequest', VettingRequestSchema);
export { VettingRequest };
export default VettingRequest;
