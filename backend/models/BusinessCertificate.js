import mongoose, { Schema } from 'mongoose';
const BusinessCertificateSchema = new Schema({
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
        enum: ['recycling', 'destruction', 'donation', 'refurbishment', 'compliance']
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
BusinessCertificateSchema.index({ type: 1, status: 1 });
// Generate unique certificate ID before saving
BusinessCertificateSchema.pre('save', function () {
    if (this.isNew && !this.certificateId) {
        const typePrefix = this.type.substring(0, 3).toUpperCase();
        const year = new Date().getFullYear();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.certificateId = `CERT-${typePrefix}-${year}-${random}`;
    }
});
const BusinessCertificate = mongoose.model('BusinessCertificate', BusinessCertificateSchema);
export { BusinessCertificate };
export default BusinessCertificate;
