import mongoose, { Schema } from 'mongoose';
const RedemptionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rewardId: {
        type: Schema.Types.ObjectId,
        ref: 'Reward',
        required: true
    },
    pointsSpent: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    redemptionCode: String
}, {
    timestamps: true
});
RedemptionSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model('Redemption', RedemptionSchema);
