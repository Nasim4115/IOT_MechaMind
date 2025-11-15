# Firebase Firestore Best Practices & Optimization

## Database Structure

### Collection Organization
\`\`\`
project/
├── users/
│   ├── {userId}/
│   │   ├── user data
│   │   └── notifications/ (subcollection)
├── drivers/
│   └── {driverId}/
│       └── driver data
├── rides/
│   ├── {rideId}/
│   │   └── driver_requests/ (subcollection)
├── driver_locations/
│   └── {driverId}/
├── payments/
│   └── {paymentId}/
├── analytics/
│   └── {dateId}/
└── support/
    └── {ticketId}/
\`\`\`

## Best Practices

### 1. Denormalization
- Store frequently accessed data together to reduce reads
- Example: Store driver rating with ride record to avoid extra queries
- Trade-off: Increased write operations when data changes

### 2. Subcollections
- Use for data that can be unbounded (notifications, messages)
- Better performance than array fields for large datasets
- Automatic scaling as data grows

### 3. Real-time Data
- Use `onSnapshot()` for live updates
- Unsubscribe when components unmount to prevent memory leaks
- Consider debouncing frequent updates

### 4. Indexing Strategy
- Create composite indexes for complex queries
- Firestore suggests indexes automatically
- Check Firestore Console > Indexes for existing indexes

### 5. Query Optimization
- Always paginate large result sets using `limit()` and `startAfter()`
- Index fields used in `where` and `orderBy` clauses
- Avoid broad queries; use specific filters

### 6. Write Operations
- Batch related writes together using transactions
- Firestore has 500 limit for batch operations
- Retry logic for failed writes

### 7. Security
- Always validate data server-side
- Use security rules to enforce authorization
- Never trust client-side validation alone

### 8. Performance
- Store analytics in separate collection to avoid heavy computations on main data
- Archive old data to reduce document count
- Use pagination for lists

## Common Mistakes to Avoid

### ❌ Mistake 1: Large Array Fields
\`\`\`typescript
// BAD - Array grows unbounded
{
  rideIds: ['ride1', 'ride2', 'ride3', ...] // can have thousands
}
\`\`\`

### ✅ Solution: Use Subcollections
\`\`\`typescript
// GOOD - Automatic scaling
/users/{userId}/rides/{rideId}
\`\`\`

### ❌ Mistake 2: No Indexes for Complex Queries
\`\`\`typescript
query(
  collection(db, 'rides'),
  where('driverId', '==', 'driver1'),
  where('status', '==', 'completed'),
  orderBy('requestedAt', 'desc')
)
// Firestore will reject without index
\`\`\`

### ✅ Solution: Create Composite Index
Use the `firestore-indexes.json` file provided

### ❌ Mistake 3: Reading After Write
\`\`\`typescript
// BAD - Costs extra read
await setDoc(doc, data);
const result = await getDoc(doc); // Extra read operation
\`\`\`

### ✅ Solution: Return Local Data
\`\`\`typescript
// GOOD - Use returned value
const response = await setDoc(doc, data);
// Use local data instead
\`\`\`

### ❌ Mistake 4: No Pagination
\`\`\`typescript
// BAD - Could fetch thousands of documents
const allRides = await getDocs(collection(db, 'rides'));
\`\`\`

### ✅ Solution: Use Pagination
\`\`\`typescript
// GOOD - Limit and offset
const ridesQuery = query(
  collection(db, 'rides'),
  limit(20),
  startAfter(lastDoc)
);
\`\`\`

### ❌ Mistake 5: Unmanaged Real-time Listeners
\`\`\`typescript
// BAD - Memory leak
useEffect(() => {
  onSnapshot(doc(db, 'rides', rideId), (doc) => {
    setData(doc.data());
  }); // No unsubscribe
});
\`\`\`

### ✅ Solution: Cleanup Subscriptions
\`\`\`typescript
// GOOD - Cleanup listener
useEffect(() => {
  const unsubscribe = onSnapshot(doc(db, 'rides', rideId), (doc) => {
    setData(doc.data());
  });
  return () => unsubscribe();
}, []);
\`\`\`

## Optimization Tips

### Batch Operations
\`\`\`typescript
const batch = writeBatch(db);
rides.forEach((ride) => {
  batch.set(doc(db, 'rides', ride.id), ride);
});
await batch.commit(); // Single operation
\`\`\`

### Caching Strategy
- Cache frequently accessed data in memory
- Implement TTL (Time To Live) for cache
- Clear cache on manual refresh

### Geographic Queries
- Use Geohash for proximity searches
- Store `geohash` field in location documents
- Query by geohash prefix for nearby results

### Monitoring & Costs
- Use Firestore Rules Simulator to test rules
- Monitor read/write operations in Console
- Archive old data monthly

## Scaling Considerations

### For 100k+ Users
- Implement read replicas for analytics
- Use Cloud Datastore for archival
- Consider Cloud BigQuery for analytics

### For 1M+ Rides
- Shard hot collections by date
- Archive completed rides monthly
- Use separate analytics database

## Security Rules Checklist
- ✅ Validate user role in rules
- ✅ Prevent unauthorized reads/writes
- ✅ Sanitize data on write
- ✅ Rate limit sensitive operations
- ✅ Log security violations
