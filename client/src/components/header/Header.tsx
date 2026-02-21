import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import Select from '../UI/selectLang/SelectLang';
import { useState } from 'react';
import { LANGUAGES } from '../../constants/languages';
import { MenuOutlined, Search } from '@mui/icons-material';
import logOut from '../../assets/icons/log-out.svg';
import heart from '../../assets/icons/heart.svg';
import shoppingCart from '../../assets/icons/shopping-cart.svg';
import { useTranslation } from 'react-i18next';
import CategoryDrawer from '../categoryDrawer/CategoryDrawer';
import SearchDrawer from '../searchDrawer/SearchDrawer';
import { useUserStore } from '../../store/userStore';
import { getImageUrl } from '../../lib/getImageUrl';

const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const cartItemsCount = useCartStore((state) => state.items.length);
  const wishlistItemsCount = useWishlistStore((state) => state.items.length);

  const [open, setOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isSearchDrawerOpen, setSearchDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-7 z-50 bg-white h-20 py-2.5 px-5 flex justify-between items-center">
      <div className="flex lg:w-1/3 items-center gap-2 max-lg:hidden">
        <div onClick={() => setDrawerOpen(true)} className="cursor-pointer p-2">
          <MenuOutlined />
        </div>

        <Select options={LANGUAGES} open={open} setOpen={setOpen} />
      </div>

      <Link to="/home" className="lg:w-1/3 flex md:justify-center">
        <h1 className="text-3xl font-bold md:text-[37px] uppercase -tracking-tighter">
          {t('header.shop_name')}
        </h1>
      </Link>

      <div className="lg:w-1/3 flex justify-end gap-3 items-center">
        {/* Search icon */}
        <button
          onClick={() => setSearchDrawerOpen(true)}
          className="outline-0 cursor-pointer"
        >
          <Search className="text-gray-500" style={{ fontSize: 24 }} />
        </button>

        {user && (
          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="w-4 h-4 md:w-7 md:h-7 rounded-[50%] overflow-hidden border-2 border-gray-400 flex items-center justify-center"
            >
              <img
                src={getImageUrl(user.img)}
                alt="user_img"
                className="w-full h-full cursor-pointer object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = getImageUrl('/uploads/default-avatar.png');
                }}
              />
            </Link>

            <button onClick={handleLogout} className="cursor-pointer">
              <img
                src={logOut}
                className="w-4 h-4 md:w-6 md:h-6"
                alt="logout"
              />
            </button>

            <Link to="/wishlist" className="relative">
              <img
                src={heart}
                className="w-4 h-4 md:w-6 md:h-6"
                alt="Wishlist"
              />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] px-1 rounded-full">
                  {wishlistItemsCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <img
                src={shoppingCart}
                className="w-4 h-4 md:w-6 md:h-6"
                alt="Cart"
              />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-[9px] font-bold px-1 rounded-full">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        )}

        <div
          onClick={() => setDrawerOpen(true)}
          className="lg:hidden cursor-pointer p-2"
        >
          <MenuOutlined />
        </div>
      </div>

      <CategoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onClose={() => setSearchDrawerOpen(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </header>
  );
};

export default Header;
