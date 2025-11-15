import { db } from './firebase-admin-config';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { Ride, Analytics, User } from './firestore-schema';

// Get total rides for a specific date
export async function getTotalRidesByDate(date: Date): Promise<number> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(startOfDay)),
      where('requestedAt', '<=', Timestamp.fromDate(endOfDay)),
      where('status', '==', 'completed')
    );

    const querySnapshot = await getDocs(ridesQuery);
    console.log('[v0] Total rides on date:', date, querySnapshot.docs.length);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('[v0] Error getting daily rides:', error);
    return 0;
  }
}

// Get total revenue for a date
export async function getRevenueByDate(date: Date): Promise<number> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(startOfDay)),
      where('requestedAt', '<=', Timestamp.fromDate(endOfDay)),
      where('status', '==', 'completed')
    );

    const querySnapshot = await getDocs(ridesQuery);
    const totalRevenue = querySnapshot.docs.reduce((sum, doc) => {
      const ride = doc.data() as Ride;
      return sum + (ride.actualFare || 0);
    }, 0);

    console.log('[v0] Total revenue on date:', date, totalRevenue);
    return totalRevenue;
  } catch (error) {
    console.error('[v0] Error getting daily revenue:', error);
    return 0;
  }
}

// Get top drivers by rating
export async function getTopDrivers(limitCount: number = 5): Promise<any[]> {
  try {
    const driversQuery = query(
      collection(db, 'drivers'),
      where('verificationStatus', '==', 'verified'),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(driversQuery);
    const topDrivers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log('[v0] Top drivers fetched:', topDrivers.length);
    return topDrivers;
  } catch (error) {
    console.error('[v0] Error getting top drivers:', error);
    return [];
  }
}

// Get weekly rides count
export async function getWeeklyRidesCount(): Promise<number> {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(weekAgo)),
      where('status', '==', 'completed')
    );

    const querySnapshot = await getDocs(ridesQuery);
    console.log('[v0] Weekly rides count:', querySnapshot.docs.length);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('[v0] Error getting weekly rides:', error);
    return 0;
  }
}

// Get monthly rides count
export async function getMonthlyRidesCount(): Promise<number> {
  try {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(monthAgo)),
      where('status', '==', 'completed')
    );

    const querySnapshot = await getDocs(ridesQuery);
    console.log('[v0] Monthly rides count:', querySnapshot.docs.length);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('[v0] Error getting monthly rides:', error);
    return 0;
  }
}

// Get active drivers (online)
export async function getActiveDriversCount(): Promise<number> {
  try {
    const driversQuery = query(
      collection(db, 'drivers'),
      where('workingHours.isOnline', '==', true)
    );

    const querySnapshot = await getDocs(driversQuery);
    console.log('[v0] Active drivers count:', querySnapshot.docs.length);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('[v0] Error getting active drivers:', error);
    return 0;
  }
}

// Get cancelled rides for date
export async function getCancelledRidesByDate(date: Date): Promise<number> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const ridesQuery = query(
      collection(db, 'rides'),
      where('requestedAt', '>=', Timestamp.fromDate(startOfDay)),
      where('requestedAt', '<=', Timestamp.fromDate(endOfDay)),
      where('status', '==', 'cancelled')
    );

    const querySnapshot = await getDocs(ridesQuery);
    console.log('[v0] Cancelled rides on date:', date, querySnapshot.docs.length);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('[v0] Error getting cancelled rides:', error);
    return 0;
  }
}

// Get average rating
export async function getAverageRating(): Promise<number> {
  try {
    const ridesQuery = query(
      collection(db, 'rides'),
      where('status', '==', 'completed'),
      where('rating', '!=', null)
    );

    const querySnapshot = await getDocs(ridesQuery);
    const rides = querySnapshot.docs.map((doc) => doc.data() as Ride);

    if (rides.length === 0) return 0;

    const totalRating = rides.reduce((sum, ride) => sum + (ride.rating || 0), 0);
    const average = totalRating / rides.length;

    console.log('[v0] Average rating:', average);
    return average;
  } catch (error) {
    console.error('[v0] Error getting average rating:', error);
    return 0;
  }
}

// Get total users count
export async function getTotalUsersCount(): Promise<number> {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'user')
    );

    const querySnapshot = await getDocs(usersQuery);
    console.log('[v0] Total users count:', querySnapshot.docs.length);
    return querySnapshot.docs.length;
  } catch (error) {
    console.error('[v0] Error getting total users:', error);
    return 0;
  }
}

// Get dashboard stats
export async function getDashboardStats() {
  try {
    const today = new Date();
    const dailyRides = await getTotalRidesByDate(today);
    const dailyRevenue = await getRevenueByDate(today);
    const weeklyRides = await getWeeklyRidesCount();
    const monthlyRides = await getMonthlyRidesCount();
    const activeDrivers = await getActiveDriversCount();
    const averageRating = await getAverageRating();
    const totalUsers = await getTotalUsersCount();
    const cancelledRides = await getCancelledRidesByDate(today);

    console.log('[v0] Dashboard stats collected');

    return {
      dailyRides,
      dailyRevenue,
      weeklyRides,
      monthlyRides,
      activeDrivers,
      averageRating,
      totalUsers,
      cancelledRides,
      completionRate:
        dailyRides > 0
          ? ((dailyRides - cancelledRides) / dailyRides) * 100
          : 0,
    };
  } catch (error) {
    console.error('[v0] Error getting dashboard stats:', error);
    return null;
  }
}
