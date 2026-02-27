import mongoose, { Schema } from 'mongoose';
const NotificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['booking', 'reward', 'system', 'agency', 'promotion', 'admin', 'account', 'alert', 'success', 'info', 'certificate'],
        default: 'system'
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['high', 'normal', 'low'],
        default: 'normal'
    },
    icon: String,
    link: String,
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
export default mongoose.model('Notification', NotificationSchema);
