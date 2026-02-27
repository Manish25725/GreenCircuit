import mongoose, { Schema } from 'mongoose';
const VettingRequestSchema = new Schema({
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
VettingRequestSchema.pre('save', function () {
    this.lastUpdatedAt = new Date();
});
const VettingRequest = mongoose.model('VettingRequest', VettingRequestSchema);
export { VettingRequest };
export default VettingRequest;
