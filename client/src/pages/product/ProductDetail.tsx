import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { $api } from '../../api/interceptors';
import { Add, Remove, Favorite, FavoriteBorder } from '@mui/icons-material';
import Newsletter from '../../components/newsletter/Newsletter';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/formatPrice';
import { getProductTranslation } from '../../lib/product-helpers';
import { getImageUrl } from '../../lib/getImageUrl';
import AiStylistChat from '../../components/aiStylistChat/AiStylistChat';
import RelatedProducts from '../../components/products/RelatedProducts';

const ProductDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');

  const addToCartStore = useCartStore((state) => state.addToCart);
  const { items: wishlist, toggleWishlist, fetchWishlist } = useWishlistStore();

  // const isFavorite = wishlist.some((item) => item.id === id);
  const isFavorite = wishlist.some((item) => item.id === id || item._id === id);

  const content = product
    ? getProductTranslation(product, i18n.language)
    : null;

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await $api.get(`/products/${id}`);
        setProduct(res.data);
        // Устанавливаем значения по умолчанию из пришедших данных
        if (res.data.color?.length > 0) setColor(res.data.color[0]);
        if (res.data.size?.length > 0) setSize(res.data.size[0]);
      } catch (err) {
        console.error('Error fetching product', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getProduct();
      fetchWishlist();
    }
  }, [id]);

  const handleQuantity = (type: 'dec' | 'inc') => {
    if (type === 'dec') {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCartStore(product.id, quantity, color, size);
    }
  };

  const handleAddToWishlist = () => {
    if (product) {
      toggleWishlist(product.id);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        {/* Loading... */}
        {t('productDetail.loading')}
      </div>
    );
  if (!product)
    return (
      <div className="flex h-screen items-center justify-center">
        {/* Product not found */}
        {t('productDetail.noProductFound')}
      </div>
    );

  return (
    <div className="pageContainer flex-col">
      {/* Главный контейнер (Wrapper) */}
      <div className="p-4 md:p-12 flex flex-col lg:flex-row gap-8">
        {/* Контейнер изображения (ImgContainer) */}
        <div className="flex-1">
          <img
            src={getImageUrl(product.img)}
            alt={content?.title}
            className="w-full h-[40vh] md:h-[80vh] object-contain rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = getImageUrl('/uploads/default-product.png');
            }}
          />
        </div>

        {/* Контейнер информации (InfoContainer) */}
        <div className="flex-1 flex flex-col gap-6 px-0 md:px-12">
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => navigate('/home')}
              className="border-2 border-teal-600 p-1 lg:px-4 lg:py-2 hover:bg-[#f8f4f4] transition cursor-pointer"
            >
              {t('productDetail.toHomePageButton')}
            </button>
            <button
              onClick={() => navigate('/products?category=all')}
              className="border-2 border-teal-600 p-1 lg:px-4 lg:py-2 hover:bg-[#f8f4f4] transition cursor-pointer"
            >
              {t('productDetail.continueShoppingButton')}
              {/* Continue Shopping */}
            </button>
          </div>

          <div className="flex items-start gap-4 h-auto">
            <h1 className="text-3xl md:text-4xl font-extralight">
              {content?.title}
            </h1>
            <div
              onClick={handleAddToWishlist}
              className="mt-2 cursor-pointer hover:scale-110 active:scale-95 transition-transform"
            >
              {isFavorite ? (
                <Favorite className="text-red-500 text-3xl" />
              ) : (
                <FavoriteBorder className="text-3xl" />
              )}
            </div>
          </div>

          <p className="text-gray-600 text-lg font-bold leading-relaxed">
            {content?.description}
          </p>

          <AiStylistChat
            productId={id!}
            lang={i18n.language}
            productTitle={content?.title || 'this item'}
          />

          <div className="flex items-center gap-4 h-12">
            {/* <span className="text-2xl md:text-[40px] font-thin"> */}
            <span
              className={`text-2xl md:text-[40px] font-thin ${
                product.oldPrice && product.oldPrice > product.price
                  ? 'text-red-600'
                  : ''
              }`}
            >
              {t('productDetail.unitPrice')} {formatPrice(product.price)}
            </span>

            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xl md:text-2xl text-gray-400 line-through mt-2">
                {formatPrice(product.oldPrice)}
              </span>
            )}

            {product.oldPrice && product.oldPrice > product.price && (
              <span className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-sm mt-2">
                -
                {Math.round(
                  ((product.oldPrice - product.price) / product.oldPrice) * 100,
                )}
                %
              </span>
            )}
          </div>

          {/* Контейнер фильтров */}
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="flex items-center gap-4">
              <span className="text-xl font-extralight">
                {t('productDetail.color')}
              </span>
              <div className="flex gap-2">
                {product.color?.map((c) => (
                  <div
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-5 h-5 rounded-full cursor-pointer border-2 ${
                      color === c
                        ? 'border-black scale-125'
                        : c !== 'white'
                          ? 'border-transparent'
                          : 'border-gray-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xl font-extralight">
                {t('productDetail.size')}
              </span>
              <div className="flex gap-2 uppercase">
                {product.size?.map((s) => (
                  <div
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[30px] h-8 flex items-center justify-center border-2 cursor-pointer transition text-xs font-bold px-2 ${
                      size === s
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Контейнер добавления (AddContainer) */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4">
            <div className="flex items-center font-bold mr-8">
              <Remove
                onClick={() => handleQuantity('dec')}
                className="cursor-pointer hover:text-teal-600 transition"
              />
              <span className="w-8 h-8 rounded-lg border border-teal-600 flex items-center justify-center mx-2 font-medium">
                {quantity}
              </span>
              <Add
                onClick={() => handleQuantity('inc')}
                className="cursor-pointer hover:text-teal-600 transition"
              />
            </div>

            <button
              onClick={handleAddToCart}
              className="border-2 border-teal-600 p-1 lg:p-3 font-medium bg-white hover:bg-[#f8f4f4] transition disabled:opacity-50 cursor-pointer"
            >
              {t('productDetail.addToCart')}
            </button>
            <button
              onClick={handleAddToWishlist}
              className="border-2 border-teal-600 p-1 lg:p-3 font-medium bg-white hover:bg-[#f8f4f4] transition disabled:opacity-50 cursor-pointer"
            >
              {isFavorite
                ? t('productDetail.removeFromWishlist')
                : t('productDetail.addToWishlist')}
            </button>
          </div>
        </div>
      </div>

      <RelatedProducts currentProductId={id!} />

      <Newsletter />
    </div>
  );
};

export default ProductDetail;
