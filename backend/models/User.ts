import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'agency' | 'business' | 'admin';
  avatar?: string;
  phone?: string;
  address?: any;
  ecoPoints: number;
  totalWasteRecycled: number;
  totalPickups: number;
  isVerified: boolean;
  suspended: boolean;
  suspendedAt?: Date;
  suspendedReason?: string;
  preferences?: {
    notifications: {
      pickupReminders: boolean;
      statusUpdates: boolean;
      rewardPoints: boolean;
      promotions: boolean;
      newsletter: boolean;
      emailNotifications: boolean;
      pushNotifications: boolean;
      smsNotifications: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private';
      showEmail: boolean;
      showPhone: boolean;
      dataSharing: boolean;
    };
    app: {
      language: string;
      theme: 'light' | 'dark' | 'auto';
      emailDigest: 'daily' | 'weekly' | 'monthly' | 'never';
      autoBackup: boolean;
    };
  };
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  sustainabilityGoals?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['user', 'agency', 'business', 'admin'], 
    default: 'user' 
  },
  avatar: { type: String, default: '' },
  phone: { type: String },
  address: mongoose.Schema.Types.Mixed, // Support both string and object
  ecoPoints: { type: Number, default: 0 },
  totalWasteRecycled: { type: Number, default: 0 },
  totalPickups: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  suspendedAt: { type: Date },
  suspendedReason: { type: String },
  preferences: {
    notifications: {
      pickupReminders: { type: Boolean, default: true },
      statusUpdates: { type: Boolean, default: true },
      rewardPoints: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      newsletter: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false }
    },
    privacy: {
      profileVisibility: { type: String, enum: ['public', 'private'], default: 'public' },
      showEmail: { type: Boolean, default: false },
      showPhone: { type: Boolean, default: false },
      dataSharing: { type: Boolean, default: true }
    },
    app: {
      language: { type: String, default: 'en' },
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'dark' },
      emailDigest: { type: String, enum: ['daily', 'weekly', 'monthly', 'never'], default: 'weekly' },
      autoBackup: { type: Boolean, default: true }
    }
  },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, select: false },
  sustainabilityGoals: { type: String, default: '' }
}, {
  timestamps: true,
});

// Encrypt password using bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export { User };
export default User;