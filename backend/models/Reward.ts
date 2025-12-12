import mongoose, { Schema, Document } from 'mongoose';

export interface IReward extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'Gift Cards' | 'Donations' | 'Lifestyle' | 'Electronics' | 'Other';
  pointsCost: number;
  stock: number;
  isActive: boolean;
  redemptionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema = new Schema<IReward>({
  title: {
    type: String,
    required: [true, 'Reward title is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'bg-green-500'
  },
  category: {
    type: String,
    enum: ['Gift Cards', 'Donations', 'Lifestyle', 'Electronics', 'Other'],
    default: 'Other'
  },
  pointsCost: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    default: -1 // -1 means unlimited
  },
  isActive: {
    type: Boolean,
    default: true
  },
  redemptionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Reward = mongoose.model<IReward>('Reward', RewardSchema);
export { Reward };
export default Reward;
