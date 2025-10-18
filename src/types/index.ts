export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  price: number;
  image?: string;
  maxTickets: number;
  soldTickets: number;
  category: string;
  status: 'active' | 'inactive' | 'sold_out';
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentId?: string;
  esewaTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface EsewaPaymentRequest {
  amount: number;
  taxAmount: number;
  totalAmount: number;
  transactionUUID: string;
  productCode: string;
  productServiceCharge: number;
  productDeliveryCharge: number;
  successUrl: string;
  failureUrl: string;
  signedFieldNames: string;
  signature: string;
}

export interface EsewaPaymentResponse {
  status: 'success' | 'failure';
  transactionId?: string;
  message: string;
}
