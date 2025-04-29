interface CreateOrderParams {
    amount: number;
    currency?: string;
    receipt?: string;
    notes?: Record<string, string>;
  }
  
  export const createOrder = async (params: CreateOrderParams) => {
    try {
      const response = await fetch('/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }
  
      return data;
    } catch (err) {
      throw new Error('Failed to process payment. Please try again.');
    }
  };
