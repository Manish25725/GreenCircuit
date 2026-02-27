import mongoose, { Schema } from 'mongoose';
const InventorySchema = new Schema({
    businessId: {
        type: Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    itemName: {
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
        default: function () {
            const prefix = this.category ? this.category.substring(0, 3).toUpperCase() : 'ITM';
            const random = Math.random().toString(36).substring(2, 8).toUpperCase();
            return `${prefix}-${Date.now().toString().slice(-6)}-${random}`;
        }
    },
    serialNumber: String,
    manufacturer: String,
    itemModel: String,
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
InventorySchema.index({ itemName: 'text', description: 'text' });
const Inventory = mongoose.model('Inventory', InventorySchema);
export { Inventory };
export default Inventory;
