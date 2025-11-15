import { db } from './firebase-admin-config';
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Analytics, Ride } from './firestore-schema';

// Calculate daily analytics
export async function calculateDailyAnalytics(date: Date): Promise<Analytics> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(startOfDay)),
      where('requestedAt', '<=', Timestamp.fromDate(endOfDay))
    );

    const querySnapshot = await getDocs(ridesQuery);
    const rides = querySnapshot.docs.map((doc) => doc.data() as Ride);

    const completedRides = rides.filter((r) => r.status === 'completed');
    const cancelledRides = rides.filter((r) => r.status === 'cancelled');
    const totalRevenue = completedRides.reduce(
      (sum, r) => sum + (r.actualFare || 0),
      0
    );
    const averageRating =
      completedRides.reduce((sum, r) => sum + (r.rating || 0), 0) /
      completedRides.length;

    const analytics: Analytics = {
      id: `${date.toISOString().split('T')[0]}-daily`,
      date,
      type: 'daily',
      totalRides: rides.length,
      totalRevenue,
      totalUsers: new Set(rides.map((r) => r.userId)).size,
      totalDrivers: new Set(rides.map((r) => r.driverId)).size,
      averageRating: isNaN(averageRating) ? 0 : averageRating,
      cancellations: cancelledRides.length,
      completedRides: completedRides.length,
      topDestinations: getTopDestinations(rides),
      topDrivers: getTopDrivers(rides),
    };

    // Store analytics
    await setDoc(doc(db, 'analytics', analytics.id), analytics);
    console.log('[v0] Daily analytics calculated:', date);

    return analytics;
  } catch (error) {
    console.error('[v0] Error calculating daily analytics:', error);
    throw error;
  }
}

// Calculate weekly analytics
export async function calculateWeeklyAnalytics(date: Date): Promise<Analytics> {
  try {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(startOfWeek)),
      where('requestedAt', '<=', Timestamp.fromDate(endOfWeek))
    );

    const querySnapshot = await getDocs(ridesQuery);
    const rides = querySnapshot.docs.map((doc) => doc.data() as Ride);

    const completedRides = rides.filter((r) => r.status === 'completed');
    const totalRevenue = completedRides.reduce(
      (sum, r) => sum + (r.actualFare || 0),
      0
    );

    const analytics: Analytics = {
      id: `week-${startOfWeek.toISOString().split('T')[0]}`,
      date: startOfWeek,
      type: 'weekly',
      totalRides: rides.length,
      totalRevenue,
      totalUsers: new Set(rides.map((r) => r.userId)).size,
      totalDrivers: new Set(rides.map((r) => r.driverId)).size,
      averageRating:
        completedRides.reduce((sum, r) => sum + (r.rating || 0), 0) /
        completedRides.length,
      cancellations: rides.filter((r) => r.status === 'cancelled').length,
      completedRides: completedRides.length,
      topDestinations: getTopDestinations(rides),
      topDrivers: getTopDrivers(rides),
    };

    await setDoc(doc(db, 'analytics', analytics.id), analytics);
    console.log('[v0] Weekly analytics calculated');

    return analytics;
  } catch (error) {
    console.error('[v0] Error calculating weekly analytics:', error);
    throw error;
  }
}

// Helper: Get top destinations
function getTopDestinations(rides: Ride[]): string[] {
  const destinations: Record<string, number> = {};

  rides.forEach((ride) => {
    const addr = ride.dropoffAddress;
    destinations[addr] = (destinations[addr] || 0) + 1;
  });

  return Object.entries(destinations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([dest]) => dest);
}

// Helper: Get top drivers
function getTopDrivers(rides: Ride[]): string[] {
  const drivers: Record<string, number> = {};

  rides.forEach((ride) => {
    if (ride.driverId) {
      drivers[ride.driverId] = (drivers[ride.driverId] || 0) + 1;
    }
  });

  return Object.entries(drivers)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([driver]) => driver);
}
