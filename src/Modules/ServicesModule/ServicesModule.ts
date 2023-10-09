export interface Service {
  id: string;
  name: string;
  amountOfPower: string;
  acpPort: string;
  dns: string;
  monthlyVisits: number|null;
  price: number|null;
}
