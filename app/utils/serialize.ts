/**
 * Recursively converts Firestore Timestamps to JS Dates.
 * This is necessary for Nuxt SSR serialization (devalue).
 */
export const stringifyFirestoreData = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  // Handle Timestamp
  if (obj && typeof obj === 'object' && 'seconds' in obj && 'nanoseconds' in obj && typeof obj.toDate === 'function') {
    return obj.toDate();
  }

  // Handle Arrays
  if (Array.isArray(obj)) {
    return obj.map(stringifyFirestoreData);
  }

  // Handle Objects
  if (typeof obj === 'object' && obj.constructor === Object) {
    const serialized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        serialized[key] = stringifyFirestoreData(obj[key]);
      }
    }
    return serialized;
  }

  return obj;
};
