import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificate extends Document {
  _id: mongoose.Types.ObjectId;
  certificateId: string;
  userId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  issueDate: Date;
  totalWeight: number;
  itemsRecycled: {
    type: string;
    quantity: number;
    weight: number;
  }[];
  environmentalImpact: {
    co2Saved: number;
    waterSaved: number;
    energySaved: number;
  };
  verificationCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>({
  certificateId: {
    type: String,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  agencyId: {
    type: Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  totalWeight: {
    type: Number,
    required: true
  },
  itemsRecycled: [{
    type: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    }
  }],
  environmentalImpact: {
    co2Saved: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
    energySaved: { type: Number, default: 0 }
  },
  verificationCode: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate certificate ID and verification code
CertificateSchema.pre('save', async function() {
  if (!this.certificateId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Certificate').countDocuments();
    this.certificateId = `CERT-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  if (!this.verificationCode) {
    this.verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
});

CertificateSchema.index({ userId: 1, issueDate: -1 });

const Certificate = mongoose.model<ICertificate>('Certificate', CertificateSchema);
export { Certificate };
export default Certificate;
