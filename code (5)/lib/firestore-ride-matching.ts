import { db } from './firebase-admin-config';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getNearbyDrivers, calculateDistance } from './firestore-real-time-location';
import { getDriver } from './firestore-crud';
import { RideRequest, Driver, Ride } from './firestore-schema';

export interface MatchedDriver {
  driver: Driver;
  distance: number;
  estimatedPickupTime: number;
  matchScore: number;
}

// Get matched drivers for a ride request
export async function getMatchedDrivers(
  pickupLat: number,
  pickupLon: number,
  maxRadius: number = 10
): Promise<MatchedDriver[]> {
  try {
    // Get nearby drivers
    const nearbyDrivers = await getNearbyDrivers(pickupLat, pickupLon, maxRadius);

    const matchedDrivers: MatchedDriver[] = [];

    for (const driverLocation of nearbyDrivers) {
      const driver = await getDriver(driverLocation.driverId);

      if (driver && driver.verificationStatus === 'verified') {
        const distance = calculateDistance(
          pickupLat,
          pickupLon,
          driverLocation.location.latitude,
          driverLocation.location.longitude
        );

        // Calculate match score (0-100)
        const ratingScore = (driver.rating / 5) * 40; // 40 points for rating
        const distanceScore = Math.max(0, 40 - distance * 4); // 40 points for proximity
        const acceptanceScore = driver.acceptanceRate * 20; // 20 points for acceptance rate
        const matchScore = ratingScore + distanceScore + acceptanceScore;

        const estimatedPickupTime = Math.ceil((distance / 40) * 60); // Estimate based on 40 km/h avg

        matchedDrivers.push({
          driver,
          distance,
          estimatedPickupTime,
          matchScore,
        });
      }
    }

    // Sort by match score (highest first)
    const sortedMatches = matchedDrivers.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    console.log('[v0] Matched drivers found:', sortedMatches.length);
    return sortedMatches;
  } catch (error) {
    console.error('[v0] Error getting matched drivers:', error);
    return [];
  }
}

// Send ride request to drivers
export async function sendRideRequest(
  rideId: string,
  driverId: string
): Promise<void> {
  try {
    const requestRef = doc(collection(db, `rides/${rideId}/driver_requests`));
    const rideRequest: RideRequest = {
      id: requestRef.id,
      rideId,
      driverId,
      status: 'pending',
      sentAt: new Date(),
      respondedAt: null,
    };

    await setDoc(requestRef, rideRequest);
    console.log('[v0] Ride request sent to driver:', driverId);
  } catch (error) {
    console.error('[v0] Error sending ride request:', error);
    throw error;
  }
}

// Send ride to multiple drivers (broadcast)
export async function broadcastRideRequest(
  rideId: string,
  matchedDrivers: MatchedDriver[],
  maxDrivers: number = 5
): Promise<string[]> {
  try {
    const selectedDrivers = matchedDrivers.slice(0, maxDrivers);
    const driverIds: string[] = [];

    for (const match of selectedDrivers) {
      await sendRideRequest(rideId, match.driver.id);
      driverIds.push(match.driver.id);
    }

    console.log('[v0] Ride broadcasted to drivers:', driverIds.length);
    return driverIds;
  } catch (error) {
    console.error('[v0] Error broadcasting ride request:', error);
    throw error;
  }
}

// Accept ride request (driver side)
export async function acceptRideRequest(
  rideId: string,
  driverId: string
): Promise<void> {
  try {
    // Update ride with driver assignment
    const rideRef = doc(db, 'rides', rideId);
    await setDoc(
      rideRef,
      {
        driverId,
        status: 'accepted',
        acceptedAt: new Date(),
      },
      { merge: true }
    );

    // Cancel other driver requests for this ride
    // (In production, implement batch cancellation)
    console.log('[v0] Ride accepted by driver:', driverId);
  } catch (error) {
    console.error('[v0] Error accepting ride request:', error);
    throw error;
  }
}

// Reject ride request (driver side)
export async function rejectRideRequest(
  rideId: string,
  driverId: string
): Promise<void> {
  try {
    const requestRef = doc(db, `rides/${rideId}/driver_requests`, driverId);
    await setDoc(
      requestRef,
      {
        status: 'rejected',
        respondedAt: new Date(),
      },
      { merge: true }
    );

    console.log('[v0] Ride request rejected by driver:', driverId);
  } catch (error) {
    console.error('[v0] Error rejecting ride request:', error);
    throw error;
  }
}

// Get pending ride requests for a driver
export async function getPendingRideRequests(driverId: string) {
  try {
    // Query all rides with pending requests for this driver
    const ridesQuery = query(
      collection(db, 'rides'),
      where('status', '==', 'requested')
    );

    const querySnapshot = await getDocs(ridesQuery);
    const pendingRides: Ride[] = [];

    for (const rideDoc of querySnapshot.docs) {
      const ride = rideDoc.data() as Ride;
      const requestsQuery = query(
        collection(db, `rides/${ride.id}/driver_requests`),
        where('driverId', '==', driverId),
        where('status', '==', 'pending')
      );

      const requests = await getDocs(requestsQuery);
      if (requests.docs.length > 0) {
        pendingRides.push(ride);
      }
    }

    console.log('[v0] Pending ride requests:', pendingRides.length);
    return pendingRides;
  } catch (error) {
    console.error('[v0] Error getting pending requests:', error);
    return [];
  }
}
