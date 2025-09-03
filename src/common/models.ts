export type Bird = {
  id: number;
  commonName: string;
  scientificName: string;
  family: string;
  rarity: 'Common' | 'Uncommon' | 'Rare';
  description: string;
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

export type CloudinaryResponse = {
  resources: [
    {
      asset_id: string;
      public_id: string;
      format: string;
      version: number;
      resource_type: string;
      type: string;
      created_at: string;
      bytes: number;
      width: number;
      height: number;
      asset_folder: string;
      display_name: string;
      url: string;
      secure_url: string;
    },
  ];
  total_count: number;
  next_cursor: null;
  rate_limit_allowed: number;
  rate_limit_reset_at: Date;
  rate_limit_remaining: number;
};

export type CloudinaryError = {
  request_options: object;
  query_params: string;
  error: {
    message: string;
    http_code: number;
  };
};

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

export type Group = {
  id: number;
  text: string;
  count: number;
};

export type ListWithCount<T> = {
  countOfRecords: number;
  data: Array<T>;
};
