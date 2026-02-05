import {
  Favorite,
  FavoriteBorderOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../lib/getImageUrl';

interface ProductProps {
  item: {
    id: string;
    img: string;
    price: number;
    color: string[];
    size: string[];
  };
}

const Product = ({ item }: ProductProps) => {
  const { t } = useTranslation();
  const addToCart = useCartStore((state) => state.addToCart);
  const { items: wishlist, toggleWishlist } = useWishlistStore();

  // Check if the product is in the favorites (Zustand stores the current state)
  const isFavorite = wishlist.some((fav) => fav.id === item.id);

  const handleAddToCart = () => {
    // Send the object that your NestJS backend expects
    addToCart(item.id, 1);
  };

  return (
    <div className="w-full h-[350px] flex items-center justify-center bg-[#f5fbfd] relative group cursor-pointer">
      {/* Background circle */}
      <div className="w-[200px] h-[200px] rounded-full bg-white absolute overflow-hidden" />

      <img
        src={getImageUrl(item.img)}
        alt={item.img}
        className="h-[75%] z-[2] object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = getImageUrl('/uploads/default-product.png');
        }}
      />

      {/* Overlay (Info) using Tailwind group-hover */}
      <div className="opacity-0 group-hover:opacity-100 w-full h-full absolute top-0 left-0 bg-black/20 z-[3] flex items-center justify-center transition-all duration-500">
        <Tooltip title={t('product.addToCart')}>
          <div
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center m-2 transition-all duration-500 hover:bg-[#e9f5f5] hover:scale-110"
          >
            <ShoppingCartOutlined />
          </div>
        </Tooltip>

        <Tooltip title={t('product.quickView')}>
          <Link
            to={`/product/${item.id}`}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center m-2 transition-all duration-500 hover:bg-[#e9f5f5] hover:scale-110"
          >
            <SearchOutlined />
          </Link>
        </Tooltip>

        <Tooltip
          title={
            isFavorite
              ? t('product.removeFromWishlist')
              : t('product.addToWishlist')
          }
        >
          <div
            onClick={() => toggleWishlist(item.id)}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center m-2 transition-all duration-500 hover:bg-[#e9f5f5] hover:scale-110"
          >
            {isFavorite ? (
              <Favorite className="text-red-500" />
            ) : (
              <FavoriteBorderOutlined />
            )}
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

export default Product;
