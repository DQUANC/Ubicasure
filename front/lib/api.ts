import type {
  LoginResponse,
  RegisterPayload,
  Station,
  CreateStationPayload,
  UpdateStationPayload,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3200";

function authHeaders(token: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: token,
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function register(payload: RegisterPayload): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse<{ message: string }>(res);
}

// Public read endpoints — no authentication required
export async function getStations(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getStations`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getPoliceNational(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getNationalStationsP`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getPoliceMunicipal(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getMunicipalStationsP`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getPoliceAll(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getPoliceStations`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getFireMunicipal(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getMunicipalStationsF`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getFireVolunteer(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getVolunteerStationsF`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getFireAll(): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getFireStations`);
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

// Admin write endpoints — still require a JWT token
export async function createStation(
  token: string,
  payload: CreateStationPayload
): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/station/createStation`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<{ message: string }>(res);
}

export async function updateStation(
  token: string,
  id: string,
  payload: UpdateStationPayload
): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/station/updateStation/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<{ message: string }>(res);
}

export async function deleteStation(
  token: string,
  id: string
): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/station/deleteStation/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse<{ message: string }>(res);
}
