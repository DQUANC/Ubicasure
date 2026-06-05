export type StationType =
  | "Policia Nacional"
  | "Policia Municipal"
  | "Bombero Municipal"
  | "Bombero Voluntario";

export interface Station {
  _id: string;
  name: string;
  type: StationType;
  phone: string;
  address: string;
  rating: number;
  businessHours: string;
  lat: number;
  lng: number;
  user: { _id: string; name: string };
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  username: string;
  email: string;
  phone: string;
  role: "ADMIN" | "CLIENT";
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface RegisterPayload {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
}

export interface CreateStationPayload {
  name: string;
  type: StationType;
  phone: string;
  address: string;
  rating: number;
  businessHours: string;
  lat: number;
  lng: number;
}

export interface UpdateStationPayload {
  name?: string;
  phone?: string;
  rating?: number;
  businessHours?: string;
}
