import mongoose, { Schema, Document } from 'mongoose';

export interface IBusiness extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  description: string;
  logo?: string;
  industry: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  // Statistics
  totalWasteProcessed: number;
  co2Saved: number;
  totalPickups: number;
  complianceScore: number;
  monthlyTarget: number; // Monthly e-waste disposal target in kg
  // Subscription/Plan
  plan: 'starter' | 'professional' | 'enterprise';
  // Verification
  isVerified: boolean;
  verificationDocuments: string[];
  // Contact Person
  contactPerson: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new Schema<IBusiness>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  description: {
    type: String,
    default: ''
  },
  logo: String,
  industry: {
    type: String,
    required: true,
    enum: ['Technology', 'Healthcare', 'Manufacturing', 'Finance', 'Retail', 'Education', 'Government', 'Other']
  },
  email: {
    type: String,
    required: [true, 'Business email is required'],
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  website: String,
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: 'India' },
    zipCode: { type: String, default: '' }
  },
  totalWasteProcessed: {
    type: Number,
    default: 0
  },
  co2Saved: {
    type: Number,
    default: 0
  },
  totalPickups: {
    type: Number,
    default: 0
  },
  complianceScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100
  },
  monthlyTarget: {
    type: Number,
    default: 200, // 200 kg per month default target
    min: 0
  },
  plan: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    default: 'starter'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [String],
  contactPerson: {
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Indexes
BusinessSchema.index({ companyName: 'text' });
BusinessSchema.index({ 'address.city': 1 });

const Business = mongoose.model<IBusiness>('Business', BusinessSchema);
export { Business };
export default Business;
