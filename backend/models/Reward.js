import mongoose, { Schema } from 'mongoose';
const RewardSchema = new Schema({
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
const Reward = mongoose.model('Reward', RewardSchema);
export { Reward };
export default Reward;
