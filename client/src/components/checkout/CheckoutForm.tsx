import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { useOrderStore } from '../../store/orderStore';
// import { useCartStore } from '../../store/cartStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const CheckoutForm = () => {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { createOrder } = useOrderStore();
  // const { clearCart } = useCartStore();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) return;

    setIsProcessing(true);
    let orderCreated = false;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-success`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      toast.error(result.error.message || t('checkoutForm.toastError'));
      setIsProcessing(false);
    } else {
      const paymentIntent = result.paymentIntent;

      if (
        paymentIntent &&
        paymentIntent.status === 'succeeded' &&
        !orderCreated
      ) {
        orderCreated = true;

        try {
          await createOrder('Online Payment Address', 'Customer Phone');
          // await clearCart();
          toast.success(t('checkoutForm.toastPaymentSuccess'));
          navigate('/order-success');
        } catch (orderError) {
          console.error('Order creation failed:', orderError);
          toast.error(t('checkoutForm.toastFailedSaveOrder'));
          setIsProcessing(false);
        }
      } else {
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <PaymentElement
        options={{
          layout: {
            type: 'accordion',
            defaultCollapsed: true,
            radios: false,
            spacedAccordionItems: false,
            paymentMethodLogoPosition: 'start',
          },
        }}
      />
      <button
        disabled={isProcessing || !stripe || !elements}
        className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:bg-gray-400"
      >
        {isProcessing ? t('checkoutForm.processing') : t('checkoutForm.payNow')}
      </button>
    </form>
  );
};
