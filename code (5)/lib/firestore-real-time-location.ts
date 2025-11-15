import { db } from './firebase-admin-config';
import { doc, setDoc, onSnapshot, query, collection, where, getDocs } from 'firebase/firestore';
import { DriverLocation, GeoLocation } from './firestore-schema';

// Generate geohash for location (simple implementation)
function generateGeohash(lat: number, lon: number, precision: number = 7): string {
  const latRange = [-90, 90];
  const lonRange = [-180, 180];
  let geohash = '';

  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (bit % 2 === 0) {
      const mid = (lonRange[0] + lonRange[1]) / 2;
      if (lon > mid) {
        ch |= 1 << (4 - Math.floor(bit / 2));
        lonRange[0] = mid;
      } else {
        lonRange[1] = mid;
      }
    } else {
      const mid = (latRange[0] + latRange[1]) / 2;
      if (lat > mid) {
        ch |= 1 << (4 - Math.floor(bit / 2));
        latRange[0] = mid;
      } else {
        latRange[1] = mid;
      }
    }

    bit++;

    if (bit % 5 === 0) {
      geohash += 'abc'[ch];
      ch = 0;
    }
  }

  return geohash;
}

// Update driver location in real-time
export async function updateDriverLocation(
  driverId: string,
  latitude: number,
  longitude: number,
  address: string,
  isAvailable: boolean
): Promise<void> {
  try {
    const geohash = generateGeohash(latitude, longitude);
    const location: DriverLocation = {
      driverId,
      location: {
        latitude,
        longitude,
        geohash,
      },
      address,
      isAvailable,
      lastUpdated: new Date(),
    };

    await setDoc(doc(db, 'driver_locations', driverId), location, { merge: true });
    console.log('[v0] Driver location updated:', driverId);
  } catch (error) {
    console.error('[v0] Error updating driver location:', error);
    throw error;
  }
}

// Get nearby drivers (simplified - using geohash prefix matching)
export async function getNearbyDrivers(
  latitude: number,
  longitude: number,
  radiusKm: number = 5
): Promise<DriverLocation[]> {
  try {
    const geohash = generateGeohash(latitude, longitude, 5);

    // Query for drivers near this geohash
    const locationsQuery = query(
      collection(db, 'driver_locations'),
      where('isAvailable', '==', true)
    );

    const querySnapshot = await getDocs(locationsQuery);
    const nearbyDrivers: DriverLocation[] = [];

    querySnapshot.docs.forEach((doc) => {
      const driverLocation = doc.data() as DriverLocation;
      const distance = calculateDistance(
        latitude,
        longitude,
        driverLocation.location.latitude,
        driverLocation.location.longitude
      );

      if (distance <= radiusKm) {
        nearbyDrivers.push(driverLocation);
      }
    });

    console.log('[v0] Nearby drivers found:', nearbyDrivers.length);
    return nearbyDrivers.sort((a, b) => {
      const distA = calculateDistance(
        latitude,
        longitude,
        a.location.latitude,
        a.location.longitude
      );
      const distB = calculateDistance(
        latitude,
        longitude,
        b.location.latitude,
        b.location.longitude
      );
      return distA - distB;
    });
  } catch (error) {
    console.error('[v0] Error getting nearby drivers:', error);
    return [];
  }
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Subscribe to real-time driver location updates
export function subscribeToDriverLocation(
  driverId: string,
  callback: (location: DriverLocation | null) => void
): () => void {
  try {
    const unsubscribe = onSnapshot(
      doc(db, 'driver_locations', driverId),
      (doc) => {
        if (doc.exists()) {
          callback(doc.data() as DriverLocation);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error('[v0] Error subscribing to driver location:', error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('[v0] Error setting up location subscription:', error);
    return () => {};
  }
}

// Get last known location
export async function getLastKnownLocation(
  driverId: string
): Promise<DriverLocation | null> {
  try {
    const locationDoc = await getDocs(
      query(collection(db, 'driver_locations'), where(doc(db, 'driver_locations', driverId).id, '==', driverId))
    );

    if (locationDoc.docs.length > 0) {
      return locationDoc.docs[0].data() as DriverLocation;
    }

    return null;
  } catch (error) {
    console.error('[v0] Error getting last known location:', error);
    return null;
  }
}
