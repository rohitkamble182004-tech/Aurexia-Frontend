export {};

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    order_id: string;
    handler: (response: RazorpayResponse) => void;
    modal?: {
      ondismiss?: () => void;
    };
    theme?: {
      color?: string;
    };
  }

  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  interface RazorpayInstance {
    open: () => void;
  }
}