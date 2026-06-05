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

export async function getStations(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getStations`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getPoliceNational(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getNationalStationsP`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getPoliceMunicipal(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getMunicipalStationsP`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getPoliceAll(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getPoliceStations`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getFireMunicipal(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getMunicipalStationsF`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getFireVolunteer(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getVolunteerStationsF`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

export async function getFireAll(token: string): Promise<Station[]> {
  const res = await fetch(`${BASE}/station/getFireStations`, {
    headers: authHeaders(token),
  });
  const data = await handleResponse<{ stations: Station[] }>(res);
  return data.stations;
}

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
