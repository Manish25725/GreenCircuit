import mongoose, { Schema, Document } from 'mongoose';

export interface IBusinessCertificate extends Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  // Certificate Info
  certificateId: string;
  type: 'recycling' | 'destruction' | 'donation' | 'refurbishment';
  title: string;
  // E-waste Details
  items: {
    name: string;
    category: string;
    quantity: number;
    weight: number;
    serialNumbers?: string[];
  }[];
  totalWeight: number;
  totalItems: number;
  // Environmental Impact
  co2Saved: number;
  materialsRecovered: {
    material: string;
    weight: number;
  }[];
  // Compliance
  complianceStandards: string[]; // e.g., ['EPA', 'ISO 14001', 'R2']
  disposalMethod: string;
  // Verification
  issuedBy: {
    name: string;
    designation: string;
    signature?: string;
  };
  verifiedBy?: {
    name: string;
    designation: string;
    verifiedAt: Date;
  };
  // PDF/Document
  documentUrl?: string;
  qrCode?: string;
  // Status
  status: 'draft' | 'issued' | 'verified' | 'expired' | 'revoked';
  validUntil?: Date;
  // Dates
  issuedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessCertificateSchema = new Schema<IBusinessCertificate>({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  agencyId: {
    type: Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  certificateId: {
    type: String,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['recycling', 'destruction', 'donation', 'refurbishment']
  },
  title: {
    type: String,
    required: true
  },
  items: [{
    name: String,
    category: String,
    quantity: { type: Number, default: 1 },
    weight: { type: Number, default: 0 },
    serialNumbers: [String]
  }],
  totalWeight: {
    type: Number,
    default: 0
  },
  totalItems: {
    type: Number,
    default: 0
  },
  co2Saved: {
    type: Number,
    default: 0
  },
  materialsRecovered: [{
    material: String,
    weight: Number
  }],
  complianceStandards: [String],
  disposalMethod: String,
  issuedBy: {
    name: { type: String, required: true },
    designation: { type: String, default: 'Authorized Representative' },
    signature: String
  },
  verifiedBy: {
    name: String,
    designation: String,
    verifiedAt: Date
  },
  documentUrl: String,
  qrCode: String,
  status: {
    type: String,
    enum: ['draft', 'issued', 'verified', 'expired', 'revoked'],
    default: 'draft'
  },
  validUntil: Date,
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
BusinessCertificateSchema.index({ businessId: 1, issuedAt: -1 });
BusinessCertificateSchema.index({ certificateId: 1 });
BusinessCertificateSchema.index({ type: 1, status: 1 });

// Generate unique certificate ID before saving
BusinessCertificateSchema.pre('save', async function(next) {
  if (this.isNew && !this.certificateId) {
    const typePrefix = this.type.substring(0, 3).toUpperCase();
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.certificateId = `CERT-${typePrefix}-${year}-${random}`;
  }
  next();
});

const BusinessCertificate = mongoose.model<IBusinessCertificate>('BusinessCertificate', BusinessCertificateSchema);
export { BusinessCertificate };
export default BusinessCertificate;
