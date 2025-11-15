import { db } from './firebase-admin-config';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  Query,
  QueryConstraint,
} from 'firebase/firestore';
import {
  User,
  Driver,
  Ride,
  DriverLocation,
  Notification,
  Payment,
} from './firestore-schema';

// CREATE Operations
export async function createUser(userData: User): Promise<void> {
  try {
    await setDoc(doc(db, 'users', userData.id), {
      ...userData,
      joinedAt: new Date(),
      createdAt: new Date(),
    });
    console.log('[v0] User created:', userData.id);
  } catch (error) {
    console.error('[v0] Error creating user:', error);
    throw error;
  }
}

export async function createDriver(driverData: Driver): Promise<void> {
  try {
    await setDoc(doc(db, 'drivers', driverData.id), {
      ...driverData,
      joinedAt: new Date(),
      createdAt: new Date(),
      verificationStatus: 'pending',
    });
    console.log('[v0] Driver created:', driverData.id);
  } catch (error) {
    console.error('[v0] Error creating driver:', error);
    throw error;
  }
}

export async function createRide(rideData: Ride): Promise<string> {
  try {
    const rideRef = doc(collection(db, 'rides'));
    await setDoc(rideRef, {
      ...rideData,
      requestedAt: new Date(),
      status: 'requested',
      createdAt: new Date(),
    });
    console.log('[v0] Ride created:', rideRef.id);
    return rideRef.id;
  } catch (error) {
    console.error('[v0] Error creating ride:', error);
    throw error;
  }
}

export async function createDriverLocation(
  location: DriverLocation
): Promise<void> {
  try {
    await setDoc(
      doc(db, 'driver_locations', location.driverId),
      {
        ...location,
        lastUpdated: new Date(),
      },
      { merge: true }
    );
    console.log('[v0] Driver location updated:', location.driverId);
  } catch (error) {
    console.error('[v0] Error updating driver location:', error);
    throw error;
  }
}

export async function createNotification(
  notification: Notification
): Promise<void> {
  try {
    const notifRef = doc(collection(db, `users/${notification.userId}/notifications`));
    await setDoc(notifRef, {
      ...notification,
      createdAt: new Date(),
      read: false,
    });
    console.log('[v0] Notification created:', notifRef.id);
  } catch (error) {
    console.error('[v0] Error creating notification:', error);
    throw error;
  }
}

// READ Operations
export async function getUser(userId: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('[v0] Error fetching user:', error);
    throw error;
  }
}

export async function getDriver(driverId: string): Promise<Driver | null> {
  try {
    const driverDoc = await getDoc(doc(db, 'drivers', driverId));
    if (driverDoc.exists()) {
      return driverDoc.data() as Driver;
    }
    return null;
  } catch (error) {
    console.error('[v0] Error fetching driver:', error);
    throw error;
  }
}

export async function getRide(rideId: string): Promise<Ride | null> {
  try {
    const rideDoc = await getDoc(doc(db, 'rides', rideId));
    if (rideDoc.exists()) {
      return rideDoc.data() as Ride;
    }
    return null;
  } catch (error) {
    console.error('[v0] Error fetching ride:', error);
    throw error;
  }
}

export async function getUserRides(userId: string): Promise<Ride[]> {
  try {
    const ridesQuery = query(
      collection(db, 'rides'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(ridesQuery);
    return querySnapshot.docs.map((doc) => doc.data() as Ride);
  } catch (error) {
    console.error('[v0] Error fetching user rides:', error);
    throw error;
  }
}

export async function getDriverRides(driverId: string): Promise<Ride[]> {
  try {
    const ridesQuery = query(
      collection(db, 'rides'),
      where('driverId', '==', driverId)
    );
    const querySnapshot = await getDocs(ridesQuery);
    return querySnapshot.docs.map((doc) => doc.data() as Ride);
  } catch (error) {
    console.error('[v0] Error fetching driver rides:', error);
    throw error;
  }
}

export async function getDriverLocation(
  driverId: string
): Promise<DriverLocation | null> {
  try {
    const locationDoc = await getDoc(doc(db, 'driver_locations', driverId));
    if (locationDoc.exists()) {
      return locationDoc.data() as DriverLocation;
    }
    return null;
  } catch (error) {
    console.error('[v0] Error fetching driver location:', error);
    throw error;
  }
}

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  try {
    const notifsQuery = query(
      collection(db, `users/${userId}/notifications`),
      where('read', '==', false)
    );
    const querySnapshot = await getDocs(notifsQuery);
    return querySnapshot.docs.map((doc) => doc.data() as Notification);
  } catch (error) {
    console.error('[v0] Error fetching notifications:', error);
    throw error;
  }
}

// UPDATE Operations
export async function updateRideStatus(
  rideId: string,
  status: Ride['status']
): Promise<void> {
  try {
    await updateDoc(doc(db, 'rides', rideId), {
      status,
      updatedAt: new Date(),
    });
    console.log('[v0] Ride status updated:', rideId, status);
  } catch (error) {
    console.error('[v0] Error updating ride status:', error);
    throw error;
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date(),
    });
    console.log('[v0] User profile updated:', userId);
  } catch (error) {
    console.error('[v0] Error updating user profile:', error);
    throw error;
  }
}

export async function updateDriverStatus(
  driverId: string,
  isOnline: boolean
): Promise<void> {
  try {
    await updateDoc(doc(db, 'drivers', driverId), {
      'workingHours.isOnline': isOnline,
      updatedAt: new Date(),
    });
    console.log('[v0] Driver status updated:', driverId, isOnline);
  } catch (error) {
    console.error('[v0] Error updating driver status:', error);
    throw error;
  }
}

export async function markNotificationAsRead(
  userId: string,
  notificationId: string
): Promise<void> {
  try {
    await updateDoc(
      doc(db, `users/${userId}/notifications`, notificationId),
      { read: true }
    );
    console.log('[v0] Notification marked as read:', notificationId);
  } catch (error) {
    console.error('[v0] Error marking notification as read:', error);
    throw error;
  }
}

// DELETE Operations
export async function deleteRide(rideId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'rides', rideId));
    console.log('[v0] Ride deleted:', rideId);
  } catch (error) {
    console.error('[v0] Error deleting ride:', error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'users', userId));
    console.log('[v0] User deleted:', userId);
  } catch (error) {
    console.error('[v0] Error deleting user:', error);
    throw error;
  }
}

export async function deleteDriver(driverId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'drivers', driverId));
    console.log('[v0] Driver deleted:', driverId);
  } catch (error) {
    console.error('[v0] Error deleting driver:', error);
    throw error;
  }
}
