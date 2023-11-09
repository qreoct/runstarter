export interface PreSavedIntervalRun {
  intervals: Interval[];
  createdAt: number;
}

export interface IntervalRun extends PreSavedIntervalRun {
  id: string;
}

export interface Interval {
  durationMs: number;
  distanceMeters: number;
  route: Coord[];
}

export interface Coord {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}
