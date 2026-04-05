export function getISTDateRange(dateStr?: string) {
  let year: number, month: number, day: number;

  if (dateStr) {
    // Parse YYYY-MM-DD manually (VERY IMPORTANT)
    const [y, m, d] = dateStr.split("-").map(Number);
    year = y;
    month = m - 1; // JS months are 0-based
    day = d;
  } else {
    // Get today's date in IST
    const now = new Date();
    const istNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    year = istNow.getFullYear();
    month = istNow.getMonth();
    day = istNow.getDate();
  }

  // Create IST midnight
  const startIST = new Date(Date.UTC(year, month, day, -5, -30, 0));

  // Next day IST midnight
  const endIST = new Date(Date.UTC(year, month, day + 1, -5, -30, 0));

  return { start: startIST, end: endIST };
}