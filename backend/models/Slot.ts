import mongoose from 'mongoose';

export interface ISlot extends mongoose.Document {
  agencyId?: mongoose.Types.ObjectId;
  date: number;
  startTime: string;
  endTime: string;
  capacity?: number;
  status: 'Available' | 'Booked' | 'Unavailable';
  bookedBy?: string | mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
}

const slotSchema = new mongoose.Schema({
  agencyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' },
  date: { type: Number, required: true }, // Day of month (1-31)
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  capacity: { type: Number, default: 5 },
  status: { 
    type: String, 
    enum: ['Available', 'Booked', 'Unavailable'], 
    default: 'Available' 
  },
  bookedBy: { type: mongoose.Schema.Types.Mixed, default: null }, // String or ObjectId
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
}, {
  timestamps: true
});

// Transform _id to id for frontend compatibility
slotSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: Record<string, any>) {
    ret.id = ret._id;
    delete ret._id;
  }
});

const Slot = mongoose.model<ISlot>('Slot', slotSchema);
export { Slot };
export default Slot;