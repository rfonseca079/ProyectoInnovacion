export type TeacherProfile = {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  regionalDirectorate: string;
};

const apiUrl = import.meta.env.DEV ? "" : import.meta.env.VITE_API_URL;

async function parseError(response: Response): Promise<string> {
  const body = (await response.json()) as { message?: string };
  return body.message ?? "No se pudo completar la solicitud.";
}

export async function login(email: string, password: string): Promise<TeacherProfile> {
  const response = await fetch(`${apiUrl}/api/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<TeacherProfile>;
}

export async function logout(): Promise<void> {
  const response = await fetch(`${apiUrl}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok && response.status !== 204) {
    throw new Error(await parseError(response));
  }
}

export async function currentTeacher(): Promise<TeacherProfile | null> {
  const response = await fetch(`${apiUrl}/api/auth/me`, { credentials: "include" });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(await parseError(response));
  }
  return response.json() as Promise<TeacherProfile>;
}

export async function planAccessMessage(planId: string): Promise<string | null> {
  const response = await fetch(`${apiUrl}/api/plans/${planId}`, { credentials: "include" });
  if (response.status === 404) {
    const body = (await response.json()) as { message?: string };
    return body.message ?? "No tiene acceso a este planeamiento.";
  }
  return null;
}
