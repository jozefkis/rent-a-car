export interface Reservation {
  id?: string;
  userId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  pricePerDay: number; // Snapshot cene u trenutku rezervacije
  totalPrice: number;  // (broj dana) * pricePerDay
}