import { useEffect, useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import { $api } from '../../api/interceptors';
import { useNavigate } from 'react-router-dom';
import { Add, Remove, DeleteOutline } from '@mui/icons-material';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { toast } from 'sonner';
// import { CheckoutForm } from '../../components/checkout/CheckoutForm';
import { Modal } from '../../components/UI/modal/Modal';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/formatPrice';
import {
  calculateFinalTotal,
  getFreeShippingThreshold,
  getShippingDiscount,
  SHIPPING_COST,
} from '../../lib/orderLogic';
import { getProductTranslation } from '../../lib/product-helpers';
import { getImageUrl } from '../../lib/getImageUrl';
import { FakeCheckoutForm } from '../../components/fakeCheckout/FakeCheckoutForm';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, {
//   developerTools: {
//     assistant: {
//       enabled: false,
//     },
//   },
// });

const Cart = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    items,
    fetchCart,
    removeItem,
    clearCart,
    getTotal,
    isLoading,
    updateCartItem,
  } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCart();
    window.scrollTo(0, 0);
  }, [fetchCart]);

  const total = getTotal();
  const freeThreshold = getFreeShippingThreshold();
  const shippingDiscount = getShippingDiscount(total);
  const finalTotal = calculateFinalTotal(total);
  const amountToFree = freeThreshold - total;

  const handleClearCart = () => {
    toast.warning(t('cart.toastClearEntireList'), {
      action: {
        label: t('cart.toastYes'),
        onClick: () => clearCart(false),
      },
      cancel: { label: t('cart.toastCancel'), onClick: () => {} },
    });
  };

  const totalCartItems =
    items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalWishlistItems = wishlistItems?.length || 0;

  const handleCheckout = async () => {
    const incompleteItem = items.find((item) => !item.color || !item.size);

    if (incompleteItem) {
      const content = getProductTranslation(
        incompleteItem.product,
        i18n.language,
      );

      // Выводим ошибку. Убедись, что ключ есть в i18next или напиши текстом
      toast.error(`${t('cart.toastAttributesError')} ${content?.title}`, {
        style: { border: '1px solid #ef4444' },
      });
      return; // Прерываем выполнение, модалка Stripe не откроется
    }

    try {
      const subtotal = getTotal();
      const payAmount = calculateFinalTotal(subtotal);
      const { data } = await $api.post('/payments/create-intent', {
        // amount: total,
        amount: Math.round(payAmount * 100),
      });
      setClientSecret(data.clientSecret);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error creating payment intent', error);
      toast.error(t('cart.toastCheckoutError'));
    }
  };

  return (
    <div className="pageContainer flex-col">
      <main className="flex-grow:1 p-4 md:p-10 w-full ">
        <h1 className="text-2xl md:text-[32px] font-light text-black text-center uppercase mb-10">
          {/* YOUR SHOPPING BAG */}
          {t('cart.title')}
        </h1>

        {/* Top Controls & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/products?category=all')}
              className="px-5 py-2 border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              {/* CONTINUE SHOPPING */}
              {t('cart.continueShoppingButton')}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-5 py-2 border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              {/* TO HOME PAGE */}
              {t('cart.toHomePageButton')}
            </button>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="px-5 py-2 border border-red-200 text-red-500 text-xs uppercase font-bold hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer"
              >
                {/* CLEAR CART */}
                {t('cart.clearAllButton')}
              </button>
            )}
          </div>

          <div className="hidden lg:flex gap-4 text-sm uppercase">
            <span className="border-b">
              {t('cart.shoppingBag')} ({totalCartItems})
            </span>
            <span
              className="opacity-50 hover:opacity-100 transition cursor-pointer"
              onClick={() => navigate('/wishlist')}
            >
              {t('cart.wishlist')} ({totalWishlistItems})
            </span>
          </div>
        </div>

        {/* Product list */}
        <div
          className={`flex flex-col lg:flex-row gap-10 lg:last:border-b border-gray-300 ${
            items.length === 0 ? 'pb-8' : 'pb-0'
          }`}
        >
          {/* Info (Left Column) */}
          <div className="flex-1 flex flex-col gap-6">
            {isLoading && (
              <div className="text-center py-20 text-gray-400 uppercase tracking-widest animate-pulse">
                {t('cart.loadingCart')}
              </div>
            )}

            {!isLoading && items.length === 0 && (
              <div className="text-center py-20 uppercase text-gray-400">
                {t('cart.cartEmpty')}
              </div>
            )}

            {!isLoading &&
              items.map((item) => {
                const content = getProductTranslation(
                  item.product,
                  i18n.language,
                );

                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row lg:flex-col justify-between pb-6  md:border-b lg:border-b-0 border-gray-300 last:border-0"
                  >
                    {/* image */}
                    <div className="flex gap-6 justify-around md:flex-grow">
                      <img
                        src={getImageUrl(item.product.img)}
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="w-32 md:w-56 lg:w-80 h-32 md:h-64 lg:h-96 object-cover cursor-pointer"
                        alt={content?.title}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = getImageUrl(
                            '/uploads/default-product.png',
                          );
                        }}
                      />

                      {/* product info */}
                      <div className="flex flex-col justify-center">
                        <span className="text-lg font-medium uppercase">
                          {content?.title}
                        </span>
                        <span className="text-sm text-gray-500 leading-relaxed">
                          {content?.description}
                        </span>
                        <div className="flex flex-col gap-4 text-sm uppercase font-bold mt-2">
                          {/* color */}
                          <div className="flex items-center gap-3 h-8">
                            <span className="font-bold">
                              {t('cart.color')}:
                            </span>
                            <div className="flex gap-2">
                              {item.product.color?.map((c: string) => (
                                <button
                                  key={c}
                                  onClick={() =>
                                    updateCartItem(item.id, { color: c })
                                  }
                                  className={`w-6 h-6 rounded-full border transition-all ${
                                    item.color === c
                                      ? 'border-black scale-110 shadow-md'
                                      : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>
                          </div>

                          {/* size */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold uppercase">
                              {t('cart.size')}:
                            </span>
                            {item.product.size && (
                              <div className="flex items-center gap-3 uppercase">
                                <div className="flex gap-2">
                                  {item.product.size?.map((s) => (
                                    <div
                                      key={s}
                                      onClick={() => {
                                        updateCartItem(item.id, {
                                          size: s,
                                        });
                                      }}
                                      className={`min-w-[30px] h-8 flex items-center justify-center border-2 cursor-pointer transition text-xs font-bold px-2 ${
                                        item.size === s
                                          ? 'border-black bg-black text-white'
                                          : 'border-gray-200 hover:border-black'
                                      }`}
                                    >
                                      {s}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* prices */}
                          <div className="flex items-center h-8 gap-3">
                            <span>{t('cart.unitPrice')}:</span>
                            <span
                              className={
                                item.product.oldPrice &&
                                item.product.oldPrice > item.product.price
                                  ? 'text-red-600'
                                  : ''
                              }
                            >
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.oldPrice &&
                              item.product.oldPrice > item.product.price && (
                                <span className="text-gray-400 line-through font-normal">
                                  {formatPrice(item.product.oldPrice)}
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col lg:flex-row items-center md:justify-center lg:justify-start gap-8 mt-4 md:mt-0 border md:border-0 lg:border border-gray-300">
                      <div className="flex items-center px-2 py-0.5">
                        <Remove
                          className="cursor-pointer"
                          style={{ width: '18', height: '18' }}
                          onClick={() =>
                            // updateQuantity(item.id, item.quantity - 1)
                            updateCartItem(item.id, {
                              quantity: item.quantity - 1,
                            })
                          }
                        />
                        <span className="h-6 px-4 font-bold">
                          {item.quantity}
                        </span>
                        <Add
                          className="cursor-pointer"
                          style={{ width: '18', height: '18' }}
                          onClick={() =>
                            // updateQuantity(item.id, item.quantity + 1)
                            updateCartItem(item.id, {
                              quantity: item.quantity + 1,
                            })
                          }
                        />
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <DeleteOutline style={{ fontSize: '24px' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Summary (Right Column) */}
          <div className="sticky bottom-4 left-0 w-full md:relative lg:w-96 border border-gray-200 p-5 h-fit bg-gray-50">
            <h2 className="text-2xl font-light uppercase mb-6">
              {t('cart.orderSummary')}
            </h2>
            <div className="flex flex-col gap-4 text-sm mb-6">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('cart.shipping')}</span>
                <span>
                  {total > 0 ? formatPrice(SHIPPING_COST) : formatPrice(0)}
                </span>
              </div>
              {shippingDiscount > 0 && (
                <div className="flex justify-between">
                  <span>{t('cart.shippingDiscount')}</span>
                  <span>- {formatPrice(shippingDiscount)}</span>
                </div>
              )}
              {/* Прогресс-подсказка (показываем, если еще не набрали на бесплатную) */}
              {items.length > 0 && amountToFree > 0 && (
                <div className="bg-blue-50 p-2 rounded text-xs text-blue-700">
                  {t('cart.freeShippingPromo', {
                    amount: formatPrice(amountToFree),
                  })}
                </div>
              )}
              <div className="flex justify-between text-2xl font-medium pt-4">
                <span>{t('cart.total')}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            {items.length > 0 && !clientSecret && (
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 uppercase font-bold text-sm hover:bg-gray-800 transition cursor-pointer"
              >
                {t('cart.checkout')}
              </button>
            )}

            <Modal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setClientSecret(null);
              }}
            >
              {clientSecret && (
                <div className="mt-8 border-t pt-8">
                  <h2 className="text-xl font-bold mb-4">
                    {t('cart.paymentDetails')}
                  </h2>
                  {/* old code for stipe */}
                  {/* <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'stripe',
                      },
                    }}
                  >
                    <CheckoutForm />
                  </Elements> */}

                  {/* fake checkout */}
                  <FakeCheckoutForm />
                </div>
              )}
            </Modal>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
