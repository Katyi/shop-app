import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'sonner';
import { Add, Remove } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/formatPrice';
import { getProductTranslation } from '../../lib/product-helpers';
import { getImageUrl } from '../../lib/getImageUrl';

const Wishlist = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [selectedColors, setSelectedColors] = useState<Record<string, string>>(
    {},
  );
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    {},
  );

  const { items, fetchWishlist, toggleWishlist, isLoading, clearWishlist } =
    useWishlistStore();
  const { items: cartItems, fetchCart, addToCart } = useCartStore();

  const totalWishlistItems =
    items?.reduce((acc, item) => acc + Number(item.quantity || 1), 0) || 0;
  const totalCartItems =
    cartItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;

  const handleQuantity = (id: string, type: 'inc' | 'dec') => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      if (type === 'dec' && currentQty > 1)
        return { ...prev, [id]: currentQty - 1 };
      if (type === 'inc') return { ...prev, [id]: currentQty + 1 };
      return prev;
    });
  };

  const handleClearClick = () => {
    toast.warning(t('wishlist.toastClearEntireList'), {
      action: {
        label: t('wishlist.toastYes'),
        onClick: () => clearWishlist(),
      },
      cancel: {
        label: t('wishlist.toastCancel'),
        onClick: () => {},
      },
    });
  };

  useEffect(() => {
    fetchCart();
    fetchWishlist();
    window.scrollTo(0, 0); // Scroll up when opening page
  }, [fetchWishlist, fetchCart]);

  return (
    <div className="pageContainer flex-col">
      <main className="flex-grow:1 p-4 md:p-10 w-full">
        <h1 className="text-2xl md:text-[32px] font-light text-black text-center uppercase mb-10">
          {/* YOUR WISHLIST */}
          {t('wishlist.title')}
        </h1>

        {/* Top Controls & Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:flex gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/products?category=all')}
              className="px-5 py-2 border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              {/* CONTINUE SHOPPING */}
              {t('wishlist.continueShoppingButton')}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-5 py-2 border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              {/* TO HOME PAGE */}
              {t('wishlist.toHomePageButton')}
            </button>
            {items.length > 0 && (
              <button
                onClick={handleClearClick}
                className="px-5 py-2 border border-red-200 text-red-500 text-xs uppercase font-bold hover:bg-red-500 hover:text-white transition duration-300 cursor-pointer"
              >
                {/* CLEAR WISHLIST */}
                {t('wishlist.clearAllButton')}
              </button>
            )}
          </div>

          <div className="hidden lg:flex gap-4 text-sm uppercase">
            <span
              className="opacity-50 hover:opacity-100 transition cursor-pointer"
              onClick={() => navigate('/cart')}
            >
              {t('wishlist.shoppingBag')} ({totalCartItems})
            </span>
            <span className="border-b">
              {t('wishlist.wishlist')} ({totalWishlistItems})
            </span>
          </div>
        </div>

        {/* Product list */}
        <div className="flex flex-col gap-6">
          {isLoading && (
            <div className="text-center py-20 text-gray-400 uppercase tracking-widest animate-pulse">
              {/* Loading wishlist... */}
              {t('wishlist.loadingWishlist')}
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="text-center py-20 uppercase text-gray-400 border-b border-gray-300">
              {/* Your wishlist is empty */}
              {t('wishlist.wishlistEmpty')}
            </div>
          )}

          {!isLoading &&
            items.map((product) => {
              const content = getProductTranslation(product, i18n.language);

              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row md:flex-grow justify-between gap-4 pb-6 border-b border-gray-200"
                >
                  {/* image */}
                  <div className="flex gap-6 justify-around md:flex-grow">
                    <img
                      src={getImageUrl(product.img)}
                      alt={content?.title}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-32 md:w-56 lg:w-80 h-32 md:h-64 lg:h-96 object-cover cursor-pointer"
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

                      <div className="flex flex-col gap-4 text-sm uppercase mt-2">
                        {/* color */}
                        <div className="flex items-center gap-3 h-8">
                          <span className="font-bold">
                            {t('wishlist.color')}:
                          </span>
                          {product.color && (
                            <div className="flex gap-2">
                              {product.color?.map((c) => (
                                <div
                                  key={c}
                                  onClick={() =>
                                    setSelectedColors((prev) => ({
                                      ...prev,
                                      [product.id]: c,
                                    }))
                                  }
                                  className={`w-6 h-6 rounded-full cursor-pointer border-2 transition ${
                                    selectedColors[product.id] === c
                                      ? 'border-black scale-110 shadow-md'
                                      : 'border-transparent'
                                  }`}
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* size */}
                        <div className="flex items-center gap-3">
                          <span className="font-bold">
                            {t('wishlist.size')}:
                          </span>
                          {product.size && (
                            <div className="flex gap-2">
                              {product.size?.map((s) => (
                                <div
                                  key={s}
                                  onClick={() =>
                                    setSelectedSizes((prev) => ({
                                      ...prev,
                                      [product.id]: s,
                                    }))
                                  }
                                  className={`min-w-[30px] h-8 flex items-center justify-center border-2 cursor-pointer transition text-xs font-bold px-2 ${
                                    selectedSizes[product.id] === s
                                      ? 'border-black bg-black text-white'
                                      : 'border-gray-200 hover:border-black'
                                  }`}
                                >
                                  {s}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* quantity */}
                        <div className="flex items-center gap-4">
                          <span className="font-bold">
                            {t('wishlist.unitQuantity')}:
                          </span>
                          <div className="flex items-center border-2 border-gray-300 px-2 p-0.5">
                            <Remove
                              className="cursor-pointer"
                              style={{ width: '18', height: '18' }}
                              onClick={() => handleQuantity(product.id, 'dec')}
                            />
                            <span className="px-4 font-bold">
                              {quantities[product.id] || 1}
                            </span>
                            <Add
                              className="cursor-pointer"
                              style={{ width: '18', height: '18' }}
                              onClick={() => handleQuantity(product.id, 'inc')}
                            />
                          </div>
                        </div>

                        <div className="flex items-center h-8 gap-3 font-bold">
                          <span>{t('wishlist.unitPrice')}:</span>
                          <span
                            className={
                              product.oldPrice &&
                              product.oldPrice > product.price
                                ? 'text-red-600'
                                : ''
                            }
                          >
                            {formatPrice(product.price)}
                          </span>
                          {product.oldPrice &&
                            product.oldPrice > product.price && (
                              <span className="text-gray-400 line-through font-normal">
                                {formatPrice(product.oldPrice)}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col gap-3 justify-center md:min-w-36 lg:min-w-44">
                    <button
                      onClick={() => {
                        const color = selectedColors[product.id];
                        const size = selectedSizes[product.id];

                        // Check for mandatory selection
                        if (product.color?.length && !color)
                          return toast.error(t('wishlist.toastSelectColor'));
                        if (product.size?.length && !size)
                          return toast.error(t('wishlist.toastSelectSize'));

                        addToCart(
                          product.id,
                          quantities[product.id] || 1,
                          color,
                          size,
                        );
                      }}
                      className="w-full bg-black text-white py-4 border-2 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition cursor-pointer"
                    >
                      {/* ADD TO CART */}
                      {t('wishlist.addToCartButton')}
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="w-full border-2 border-gray-200 text-gray-400 py-4 px-8 text-xs font-bold uppercase tracking-widest hover:text-red-500 hover:border-red-500 transition cursor-pointer"
                    >
                      {/* DELETE */}
                      {t('wishlist.deleteButton')}
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
};

export default Wishlist;
