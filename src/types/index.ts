export interface App {
  deposit: number;
  initialDeposit: number;
  duration: number;
  includeWealthTax: boolean;
  fiscalStatus: number;
  portfolios: Portfolio[];
  brokers: Broker[];
}

export interface Security {
  id: string;
  name: string;
  annualReturn: number;
  tertd: number;
  dividend?: number;
  fixedTransactionCost: number;
  variableTransactionCost: number;
  exitCost: number;
  allocation: number;
}

export interface Broker {
  id: string;
  name: string;
  serviceFee: string;
  securities: Security[];
}

export interface Portfolio {
  id: string;
  name: string;
  values: number[];
}
