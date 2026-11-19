// Randevu saatleri. Çalışma saatlerini buradan değiştirebilirsiniz.
// 0 = Pazar, 1 = Pazartesi ... 6 = Cumartesi
export const WORK_HOURS: Record<number, string[]> = {
  0: [],
  1: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  2: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  3: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  4: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  5: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  6: ["10:00", "11:00", "12:00", "13:00"],
};
export const BOOK_AHEAD_DAYS = 60;

/** "2026-11-20" -> o günün saatleri (İstanbul saatiyle bugünün geçmiş saatleri hariç) */
export function slotsFor(day: string, now = new Date()) {
  const d = new Date(`${day}T12:00:00+03:00`);
  const hours = WORK_HOURS[d.getUTCDay()] ?? [];
  const today = istanbulToday(now);
  if (day < today) return [];
  if (day === today) {
    const hm = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Istanbul", hour: "2-digit", minute: "2-digit", hour12: false }).format(now);
    return hours.filter((h) => h > hm);
  }
  return hours;
}
export function istanbulToday(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul" }).format(now);
}
export function isBookable(day: string, slot: string, now = new Date()) {
  const max = new Date(now.getTime() + BOOK_AHEAD_DAYS * 864e5);
  if (day > istanbulToday(max)) return false;
  return slotsFor(day, now).includes(slot);
}
