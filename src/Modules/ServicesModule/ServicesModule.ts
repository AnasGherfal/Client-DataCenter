export interface Service {
    id: number|null,
    name: string,
    amountOfPower: string ,
    acpPort: string,
    dns: string,
    monthlyVisits: number| null | undefined,
    price: number|null,
  }