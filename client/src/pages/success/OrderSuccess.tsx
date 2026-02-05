import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useTranslation } from 'react-i18next';

const OrderSuccess = () => {
  const { t } = useTranslation();
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Очищаем корзину сразу при попадании на страницу
    clearCart(true);
    window.history.replaceState({}, document.title, window.location.pathname);
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px-28px)] text-center mx-10 border-b border-gray-300">
      <div className="bg-green-100 p-4 rounded-full mb-4">
        <svg
          className="w-12 h-12 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-2">{t('orderSuccess.thankYou')}</h1>
      <p className="text-gray-600 mb-8">
        {t('orderSuccess.paymentSuccessful')}
        {/* Your payment was successful and your order is being processed. */}
      </p>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 uppercase text-sm font-bold tracking-widest"
      >
        {t('orderSuccess.backToShopping')}
        {/* Back to Shopping */}
      </Link>
    </div>
  );
};

export default OrderSuccess;
