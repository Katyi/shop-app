import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/UI/scrollToTop/ScrollToTop';
import { Toaster } from 'sonner';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/home/Home';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import MainLayout from './components/MainLayout';
import Profile from './pages/profile/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetail from './pages/product/ProductDetail';
import ProductList from './pages/productList/ProductList';
import Wishlist from './pages/wishlist/Wishlist';
import Cart from './pages/cart/Cart';
import OrderSuccess from './pages/success/OrderSuccess';
import { useCartStore } from './store/cartStore';
import { useWishlistStore } from './store/wishlistStore';
import { useUserStore } from './store/userStore';

function App() {
  const { token } = useAuthStore();
  const { fetchMe } = useUserStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);
  const fetchOrders = useUserStore((state) => state.fetchMe);

  useEffect(() => {
    if (token) {
      fetchMe();
      fetchCart();
      fetchWishlist();
      fetchOrders();
    }
  }, [token, fetchMe, fetchCart, fetchWishlist]);

  return (
    <Router>
      <ScrollToTop />

      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{
          style: { marginTop: '30%' },
        }}
      />

      <Routes>
        {/* Публичные страницы БЕЗ Header */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ЗАЩИЩЕННЫЕ страницы */}
        <Route element={<ProtectedRoute />}>
          {/* Группа страниц С Header */}
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
