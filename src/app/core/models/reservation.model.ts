export interface Reservation {
  id?: string;
  userId: string;
  vehicleId: string;
  startDate: string; // Date + time
  endDate: string; // Date + time
  pricePerDay: number; // Snapshot cene u trenutku rezervacije
  totalPrice: number;  // (broj dana) * pricePerDay
  status: "active" | "finished"
}