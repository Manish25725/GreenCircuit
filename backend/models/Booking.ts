import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingItem {
  type: string;
  quantity: number;
  description: string;
  estimatedWeight?: number;
}

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  bookingId: string;
  userId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  items: IBookingItem[];
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  scheduledTime: string;
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  totalWeight?: number;
  ecoPointsEarned: number;
  certificateIssued: boolean;
  certificateId?: string;
  notes?: string;
  trackingHistory: {
    status: string;
    message: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>({
  bookingId: {
    type: String,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agencyId: {
    type: Schema.Types.ObjectId,
    ref: 'Agency',
    required: true
  },
  slotId: {
    type: Schema.Types.ObjectId,
    ref: 'Slot',
    required: true
  },
  items: [{
    type: {
      type: String,
      required: true,
      enum: ['Large Appliances', 'Small Appliances', 'Consumer Electronics', 'Batteries & Power Supplies', 'Cables & Accessories', 'Other']
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    description: String,
    estimatedWeight: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  pickupAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  totalWeight: Number,
  ecoPointsEarned: {
    type: Number,
    default: 0
  },
  certificateIssued: {
    type: Boolean,
    default: false
  },
  certificateId: String,
  notes: String,
  trackingHistory: [{
    status: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Generate booking ID before saving
BookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `REQ-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Index for efficient queries
BookingSchema.index({ userId: 1, status: 1 });
BookingSchema.index({ agencyId: 1, scheduledDate: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);
