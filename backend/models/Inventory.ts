import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryItem extends Document {
  _id: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  // Item Details
  name: string;
  description?: string;
  category: 'IT Equipment' | 'Cables & Wiring' | 'Batteries' | 'Monitors' | 'Appliances' | 'Mobile Devices' | 'Other';
  subcategory?: string;
  // Identification
  assetId: string;
  serialNumber?: string;
  manufacturer?: string;
  model?: string;
  // Physical
  quantity: number;
  weight: number; // in kg
  condition: 'working' | 'non-working' | 'damaged' | 'unknown';
  // Location
  location: string; // e.g., "Warehouse A", "Office Floor 2"
  // Status
  status: 'in-use' | 'in-storage' | 'ready-for-pickup' | 'scheduled' | 'recycled';
  // Tracking
  purchaseDate?: Date;
  retirementDate?: Date;
  lastAuditDate?: Date;
  // Environmental
  hazardous: boolean;
  recyclable: boolean;
  // Associated booking (if scheduled for pickup)
  bookingId?: mongoose.Types.ObjectId;
  // Metadata
  tags: string[];
  notes?: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventoryItem>({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ['IT Equipment', 'Cables & Wiring', 'Batteries', 'Monitors', 'Appliances', 'Mobile Devices', 'Other']
  },
  subcategory: String,
  assetId: {
    type: String,
    required: true
  },
  serialNumber: String,
  manufacturer: String,
  model: String,
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  weight: {
    type: Number,
    default: 0
  },
  condition: {
    type: String,
    enum: ['working', 'non-working', 'damaged', 'unknown'],
    default: 'unknown'
  },
  location: {
    type: String,
    default: 'Main Storage'
  },
  status: {
    type: String,
    enum: ['in-use', 'in-storage', 'ready-for-pickup', 'scheduled', 'recycled'],
    default: 'in-storage'
  },
  purchaseDate: Date,
  retirementDate: Date,
  lastAuditDate: Date,
  hazardous: {
    type: Boolean,
    default: false
  },
  recyclable: {
    type: Boolean,
    default: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  tags: [String],
  notes: String,
  images: [String]
}, {
  timestamps: true
});

// Indexes
InventorySchema.index({ businessId: 1, status: 1 });
InventorySchema.index({ assetId: 1 });
InventorySchema.index({ category: 1 });
InventorySchema.index({ name: 'text', description: 'text' });

// Generate unique asset ID before saving
InventorySchema.pre('save', async function(next) {
  if (this.isNew && !this.assetId) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.assetId = `${prefix}-${Date.now().toString().slice(-6)}-${random}`;
  }
  next();
});

const Inventory = mongoose.model<IInventoryItem>('Inventory', InventorySchema);
export { Inventory };
export default Inventory;
