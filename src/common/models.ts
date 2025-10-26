/** Db models */
export type Bird = {
  id: number;
  commonName: string;
  scientificName: string;
  family: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  description: string;
  imgPublicId: string | null;
  imgSecureUrl: string | null;
  imgAttribute: string | null;
};

export type Location = {
  id: number;
  userId: number;
  name: string;
  lat: number;
  lng: number;
};

export type Sighting = {
  id: number;
  userId: number;
  birdId: number;
  locationId: number | null;
  date: Date;
  description: string | null;
  isNew: boolean;
};

export type User = {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  bio: string | null;
  zipcode: string | null;
  address: string | null;
  favoriteBirdId: number | null;
};

/** Query models */
export type Diary = {
  id: number;
  date: string;
  count: number;
  sightings: string[];
};

export type Lifelist = {
  id: number;
  date: Date;
  commonName: string;
  imgSecureUrl: string;
  count: number;
};

export type Locations = {
  id: number;
  name: string;
  count: number;
  sightings: string[];
};

export type Stats = {
  newestLifeListSighting: object[];
  [key: string]: number | string | object[]; // index signature (other props not relevant)
};

export type ListWithCount<T> = {
  countOfRecords: number;
  data: Array<T>;
};

/** Enums */
export enum ErrorMessages {
  DefaultServer = 'The server encountered an error.',
  ResourceNotFound = 'Resource not found.',
  UserNotFound = 'User not found.',
  IncorrectPassword = 'Incorrect password.',
  BadRequest = 'Invalid request.',
  EmailIsRegistered = 'Submitted email already registered.',
  AccessForbidden = 'You do not have permission to access this resource.',
  InvalidToken = 'Invalid or expired session. Please log in again.',
  InvalidPassword = 'Not a valid password.',
  InvalidEmail = 'Not a valid email.',
}
