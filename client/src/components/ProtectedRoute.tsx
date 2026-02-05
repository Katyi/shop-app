import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Если нет ни юзера, ни токена — отправляем на логин
  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  // Если все ок — рендерим вложенные роуты
  return <Outlet />;
};

export default ProtectedRoute;
