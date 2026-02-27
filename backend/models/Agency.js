import mongoose, { Schema } from 'mongoose';
const AgencySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Agency name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    registrationNumber: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    logo: String,
    coverImage: String,
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone is required']
    },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, default: '' },
        zipCode: { type: String, required: true },
        coordinates: {
            type: {
                lat: Number,
                lng: Number
            },
            required: false
        }
    },
    // Partner Registration Details
    gstNumber: {
        type: String,
        trim: true
    },
    udyamCertificate: {
        type: String,
        trim: true
    },
    headName: {
        type: String,
        trim: true
    },
    businessType: {
        type: String,
        trim: true
    },
    establishedYear: {
        type: Number
    },
    // End Partner Registration Details
    services: [{
            type: String,
        }],
    certifications: [String],
    operatingRegions: [{
            type: String
        }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    totalWasteCollected: {
        type: Number,
        default: 0
    },
    totalBookings: {
        type: Number,
        default: 0
    },
    earnings: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    suspended: {
        type: Boolean,
        default: false
    },
    suspendedAt: {
        type: Date
    },
    suspendedReason: {
        type: String
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    verificationDocuments: [String],
    rejectionReason: {
        type: String,
        default: ''
    },
    operatingHours: [{
            day: String,
            open: String,
            close: String,
            isOpen: { type: Boolean, default: true }
        }]
}, {
    timestamps: true
});
// Index for location-based queries
AgencySchema.index({ 'address.city': 1 });
AgencySchema.index({ name: 'text', description: 'text' });
const Agency = mongoose.model('Agency', AgencySchema);
export { Agency };
export default Agency;
