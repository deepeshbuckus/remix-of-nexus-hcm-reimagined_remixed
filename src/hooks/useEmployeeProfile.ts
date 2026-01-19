import { useQuery } from "@tanstack/react-query";
import { getEmployeeProfile } from "@/services/profileService";
import type { ProfileResponse } from "@/types/profile";

// Temporary hardcoded employee ID - replace with auth context later
const CURRENT_EMPLOYEE_ID = "00000000-0000-0000-0000-000000000004";

/**
 * React Query hook for fetching employee profile data
 * @param employeeId - Optional employee ID (defaults to current user)
 */
export function useEmployeeProfile(employeeId: string = CURRENT_EMPLOYEE_ID) {
  return useQuery<ProfileResponse, Error>({
    queryKey: ["employee-profile", employeeId],
    queryFn: () => getEmployeeProfile(employeeId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
