import { useState } from 'react';
import { toast } from 'sonner';
import { useOrderStore } from '../../store/orderStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const FakeCheckoutForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createOrder } = useOrderStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      await createOrder('Online Payment Address', 'Customer Phone');
      toast.success(t('checkoutForm.toastPaymentSuccess'));
      navigate('/order-success');
    } catch (error) {
      console.log(error);
      toast.error(t('checkoutForm.toastFailedSaveOrder'));
      setIsProcessing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="p-2 bg-blue-50 text-blue-700 text-xs rounded">
        {t('checkoutForm.demoMode')}
      </div>

      <input
        className="w-full p-2 bg-gray-100 rounded outline-0"
        placeholder="Card Number"
        defaultValue="4242 4242 4242 4242"
        readOnly
      />
      <div className="flex gap-2">
        <input
          className="w-1/2 p-2 bg-gray-100 rounded outline-0"
          placeholder="MM/YY"
          defaultValue="12/26"
          readOnly
        />
        <input
          className="w-1/2 p-2 bg-gray-100 rounded outline-0"
          placeholder="CVC"
          defaultValue="123"
          readOnly
        />
      </div>
      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-lg font-medium disabled:bg-gray-400 cursor-pointer"
      >
        {isProcessing ? t('checkoutForm.processing') : t('checkoutForm.payNow')}
      </button>
    </form>
  );
};
