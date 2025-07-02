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
  locationId: number | null;
  favoriteBirdId: number | null;
};
