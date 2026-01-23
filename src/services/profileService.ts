import type { ProfileResponse } from "@/types/profile";

const API_BASE_URL = "http://localhost:8080";

/**
 * Fetch employee profile by ID
 * @param id - Employee UUID
 * @returns ProfileResponse
 */
export async function getEmployeeProfile(id: string): Promise<ProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/employees/${id}/profile`);

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
