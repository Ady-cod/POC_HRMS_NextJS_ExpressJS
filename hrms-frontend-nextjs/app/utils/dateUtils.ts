/**
 * Utility function for consistent date formatting across the application
 * @param dateString - The date string to format
 * @param format - The format type: 'display' for YYYY-MM-DD or 'csv' for DD-MM-YYYY
 * @returns Formatted date string or "N/A" if invalid
 */
export const formatDate = (dateString: string, format: 'display' | 'csv' = 'display'): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    
    if (format === 'csv') {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `'${day}-${month}-${year}`;
    }
    
    // Default display format (YYYY-MM-DD for consistency)
    return date.toISOString().split("T")[0];
  } catch {
    return "N/A";
  }
}; 