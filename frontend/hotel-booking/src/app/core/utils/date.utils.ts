export class DateUtils {
  static calculateNights(checkInDate: string, checkOutDate: string): number {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }

  static formatLocation(city?: string, country?: string): string {
    if (city && country) {
      return `${city}, ${country}`;
    }
    return 'Location not available';
  }
}
