export interface Vehicle {
  id?: string;
  brand: string;
  model: string;
  year: number;
  enginePower: number;
  transmission: 'automatic' | 'manual';
  seats: number;
  doors: number;
  fuel: string;
  category: 'Economy' | 'Business' | 'Luxury' | 'SUV' | 'Sport';
  pricePerDay: number;
  imageUrl?: string;        
  isAvailable: boolean;
}