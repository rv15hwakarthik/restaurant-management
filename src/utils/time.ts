export function getISTDateRange(dateStr?: string) {
    console.log('dateStr', dateStr)
    const date = dateStr ? new Date(dateStr) : new Date();
  
    // Convert to IST manually
    const IST_OFFSET = 5.5 * 60; // minutes
  
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
  
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
  
    // Adjust for IST offset
    start.setMinutes(start.getMinutes() - IST_OFFSET);
    end.setMinutes(end.getMinutes() - IST_OFFSET);
  
    return { start, end };
  }