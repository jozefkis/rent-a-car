export class DateUtils {
  
  /**
   * Generiše niz svih datuma (kao stringove) između dva datuma.
   * Korisno za pravljenje "blacklist-e" zauzetih dana.
   */
  static getDatesInRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    let currentDate = new Date(startDate);
    const lastDate = new Date(endDate);

    // Postavljamo na početak dana da izbegnemo probleme sa satima
    currentDate.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    while (currentDate <= lastDate) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  /**
   * Proverava da li se dva vremenska intervala preklapaju.
   */
  static isOverlapping(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && start2 < end1;
  }

  /**
   * Pomoćna funkcija za formatiranje datuma u YYYY-MM-DD
   */
  static formatToISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}