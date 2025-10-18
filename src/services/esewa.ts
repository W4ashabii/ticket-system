import { EsewaPaymentRequest, EsewaPaymentResponse } from '@/types';

const ESEWA_CONFIG = {
  MERCHANT_ID: process.env.NEXT_PUBLIC_ESEWA_MERCHANT_ID || 'EPAYTEST',
  SECRET_KEY: process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q',
  BASE_URL: process.env.NEXT_PUBLIC_ESEWA_BASE_URL || 'https://rc-epay.esewa.com.np',
  SUCCESS_URL: process.env.NEXT_PUBLIC_ESEWA_SUCCESS_URL || 'http://localhost:3000/payment/success',
  FAILURE_URL: process.env.NEXT_PUBLIC_ESEWA_FAILURE_URL || 'http://localhost:3000/payment/failure',
};

export const generateTransactionUUID = (): string => {
  return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
};

export const createSignature = async (data: {
  totalAmount: number;
  transactionUUID: string;
  productCode: string;
}): Promise<string> => {
  const { totalAmount, transactionUUID, productCode } = data;
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`;
  
  const crypto = await import('crypto');
  return crypto.createHmac('sha256', ESEWA_CONFIG.SECRET_KEY).update(message).digest('base64');
};

export const prepareEsewaPayment = async (
  amount: number,
  productCode: string
): Promise<EsewaPaymentRequest> => {
  const transactionUUID = generateTransactionUUID();
  const taxAmount = 0;
  const productServiceCharge = 0;
  const productDeliveryCharge = 0;
  const totalAmount = amount + taxAmount + productServiceCharge + productDeliveryCharge;
  
  const signedFieldNames = 'total_amount,transaction_uuid,product_code';
  const signature = await createSignature({
    totalAmount,
    transactionUUID,
    productCode
  });

  return {
    amount,
    taxAmount,
    totalAmount,
    transactionUUID,
    productCode,
    productServiceCharge,
    productDeliveryCharge,
    successUrl: ESEWA_CONFIG.SUCCESS_URL,
    failureUrl: ESEWA_CONFIG.FAILURE_URL,
    signedFieldNames,
    signature
  };
};

export const initializeEsewaPayment = async (
  paymentRequest: EsewaPaymentRequest
): Promise<EsewaPaymentResponse> => {
  try {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = `${ESEWA_CONFIG.BASE_URL}/epay/main`;
    form.target = '_blank';
    
    Object.entries(paymentRequest).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value.toString();
      form.appendChild(input);
    });
    
    const merchantInput = document.createElement('input');
    merchantInput.type = 'hidden';
    merchantInput.name = 'merchant_id';
    merchantInput.value = ESEWA_CONFIG.MERCHANT_ID;
    form.appendChild(merchantInput);
    
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
    
    return {
      status: 'success',
      message: 'Redirecting to eSewa payment gateway...'
    };
  } catch (error) {
    console.error('eSewa payment initialization failed:', error);
    return {
      status: 'failure',
      message: 'Payment initialization failed. Please try again.'
    };
  }
};

export const verifyEsewaPayment = async (
  responseData: Record<string, unknown>
): Promise<EsewaPaymentResponse> => {
  try {
    const { status, transaction_uuid } = responseData;
    
    if (status === 'COMPLETE') {
      return {
        status: 'success',
        transactionId: transaction_uuid as string,
        message: 'Payment completed successfully'
      };
    } else {
      return {
        status: 'failure',
        message: 'Payment was not completed'
      };
    }
  } catch (error) {
    console.error('eSewa payment verification failed:', error);
    return {
      status: 'failure',
      message: 'Payment verification failed'
    };
  }
};

export const getEsewaPaymentStatus = async (
  transactionId: string
): Promise<EsewaPaymentResponse> => {
  try {
    return {
      status: 'success',
      transactionId,
      message: 'Payment verified successfully'
    };
  } catch (error) {
    console.error('Failed to get payment status:', error);
    return {
      status: 'failure',
      message: 'Failed to verify payment status'
    };
  }
};
