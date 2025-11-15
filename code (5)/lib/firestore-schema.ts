export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'user' | 'driver' | 'admin';
  profilePicture: string;
  rating: number;
  totalRides: number;
  joinedAt: Date;
  isActive: boolean;
  points: number;
  wallet: number;
  emergencyContact: string;
  address: string;
}

export interface Driver extends User {
  licenseNumber: string;
  licenseExpiry: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  totalEarnings: number;
  acceptanceRate: number;
  cancellationRate: number;
  vehicle: {
    registrationNumber: string;
    model: string;
    color: string;
    capacity: number;
    insuranceExpiry: Date;
  };
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
  };
  workingHours: {
    startTime: string;
    endTime: string;
    isOnline: boolean;
  };
}

export interface Ride {
  id: string;
  userId: string;
  driverId: string | null;
  status: 'requested' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
  pickupLocation: GeoLocation;
  dropoffLocation: GeoLocation;
  pickupAddress: string;
  dropoffAddress: string;
  estimatedDistance: number;
  estimatedDuration: number;
  estimatedFare: number;
  actualFare: number;
  paymentMethod: 'card' | 'wallet' | 'cash';
  requestedAt: Date;
  acceptedAt: Date | null;
  startedAt: Date | null;
  completedAt: Date | null;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  rating: number | null;
  review: string | null;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  geohash?: string;
}

export interface DriverLocation {
  driverId: string;
  location: GeoLocation;
  address: string;
  isAvailable: boolean;
  lastUpdated: Date;
}

export interface RideRequest {
  id: string;
  rideId: string;
  driverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: Date;
  respondedAt: Date | null;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'ride_request' | 'ride_update' | 'payment' | 'promotion' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedId: string | null;
}

export interface Payment {
  id: string;
  rideId: string;
  userId: string;
  amount: number;
  method: 'card' | 'wallet' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  createdAt: Date;
  completedAt: Date | null;
}

export interface Analytics {
  id: string;
  date: Date;
  type: 'daily' | 'weekly' | 'monthly';
  totalRides: number;
  totalRevenue: number;
  totalUsers: number;
  totalDrivers: number;
  averageRating: number;
  cancellations: number;
  completedRides: number;
  topDestinations: string[];
  topDrivers: string[];
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  currentUses: number;
  expiryDate: Date;
  applicableFor: 'users' | 'drivers' | 'both';
  isActive: boolean;
}

export interface Support {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  resolvedAt: Date | null;
  replies: SupportReply[];
}

export interface SupportReply {
  id: string;
  senderId: string;
  senderRole: 'user' | 'admin';
  message: string;
  createdAt: Date;
  attachments: string[];
}
