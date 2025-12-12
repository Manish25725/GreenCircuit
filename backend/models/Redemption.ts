import mongoose, { Schema, Document } from 'mongoose';

export interface IRedemption extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rewardId: mongoose.Types.ObjectId;
  pointsSpent: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  redemptionCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RedemptionSchema = new Schema<IRedemption>({
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

export default mongoose.model<IRedemption>('Redemption', RedemptionSchema);
