// Data transformation utilities for profile API responses

/**
 * Extract middle initial from full middle name
 * @example extractMiddleInitial("Michael") -> "M"
 */
export function extractMiddleInitial(middleName: string | null | undefined): string {
  if (!middleName || middleName.trim() === "") return "";
  return middleName.trim().charAt(0).toUpperCase();
}

/**
 * Format ISO date string to readable display format
 * @example formatDisplayDate("1990-05-15") -> "May 15, 1990"
 */
export function formatDisplayDate(isoDate: string | null | undefined): string {
  if (!isoDate) return "";
  
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Format employee number to display ID format
 * @example formatEmployeeId(1003) -> "EMP-001003"
 */
export function formatEmployeeId(employeeNumber: number | null | undefined): string {
  if (employeeNumber === null || employeeNumber === undefined) return "";
  return `EMP-${String(employeeNumber).padStart(6, "0")}`;
}

/**
 * Map language code to full language name
 * @example mapLanguageCode("EN") -> "English"
 */
export function mapLanguageCode(code: string | null | undefined): string {
  if (!code) return "";
  
  const languageMap: Record<string, string> = {
    EN: "English",
    FR: "French",
    ES: "Spanish",
    DE: "German",
    PT: "Portuguese",
    ZH: "Chinese",
    JA: "Japanese",
    KO: "Korean",
  };
  
  return languageMap[code.toUpperCase()] || code;
}

/**
 * Map country code to full country name
 * @example mapCountryCode("CA") -> "Canada"
 */
export function mapCountryCode(code: string | null | undefined): string {
  if (!code) return "";
  
  const countryMap: Record<string, string> = {
    CA: "Canada",
    US: "United States",
    GB: "United Kingdom",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    MX: "Mexico",
  };
  
  return countryMap[code.toUpperCase()] || code;
}

/**
 * Map province/state code to full name based on country
 * @example mapProvinceCode("ON", "CA") -> "Ontario"
 */
export function mapProvinceCode(
  provinceCode: string | null | undefined,
  countryCode: string | null | undefined
): string {
  if (!provinceCode) return "";
  
  const canadianProvinces: Record<string, string> = {
    AB: "Alberta",
    BC: "British Columbia",
    MB: "Manitoba",
    NB: "New Brunswick",
    NL: "Newfoundland and Labrador",
    NS: "Nova Scotia",
    NT: "Northwest Territories",
    NU: "Nunavut",
    ON: "Ontario",
    PE: "Prince Edward Island",
    QC: "Quebec",
    SK: "Saskatchewan",
    YT: "Yukon",
  };
  
  const usStates: Record<string, string> = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
    DC: "District of Columbia",
  };
  
  const upperCode = provinceCode.toUpperCase();
  const upperCountry = countryCode?.toUpperCase();
  
  if (upperCountry === "CA" && canadianProvinces[upperCode]) {
    return canadianProvinces[upperCode];
  }
  
  if (upperCountry === "US" && usStates[upperCode]) {
    return usStates[upperCode];
  }
  
  // Fallback: return the code as-is
  return provinceCode;
}

/**
 * Combine first and last name into full name
 * @example formatFullName("John", "Doe") -> "John Doe"
 */
export function formatFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(" ");
}

/**
 * Constructs a data URL from base64 image data and media type
 * @example buildProfilePictureUrl("/9j/4AAQ...", "image/jpeg") -> "data:image/jpeg;base64,/9j/4AAQ..."
 * @returns Data URL string or null if inputs are invalid
 */
export function buildProfilePictureUrl(
  base64: string | null | undefined,
  mediaType: string | null | undefined
): string | null {
  if (!base64 || !mediaType) return null;
  return `data:${mediaType};base64,${base64}`;
}

/**
 * Format currency amount for display
 * @example formatCurrency("85000.00", "CAD") -> "$85,000.00"
 */
export function formatCurrency(
  amount: string | null | undefined,
  currency: string = "CAD"
): string {
  if (!amount) return "";
  
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
  }).format(num);
}

/**
 * Format direct deposit display string
 * @example formatDirectDeposit("TD Bank", "4521") -> "TD Bank ••••4521"
 */
export function formatDirectDeposit(
  bankName: string | null | undefined,
  accountLast4: string | null | undefined
): string {
  if (!bankName && !accountLast4) return "";
  if (!accountLast4) return bankName || "";
  return `${bankName || "Bank"} ••••${accountLast4}`;
}
