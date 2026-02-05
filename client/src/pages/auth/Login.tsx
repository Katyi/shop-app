import { useEffect, useState } from 'react';
import backGroundphoto from '../../assets/backGroundphoto1.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { loginSchema } from '../../lib/schema';
import { useTranslation } from 'react-i18next';

type ValidationErrors = {
  email?: string[] | undefined;
  password?: string[] | undefined;
};

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { login, token, error, resetError } = useAuthStore();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });

    if (result.success) {
      setErrors({});
      await login(email, password);
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
    if (error) resetError();
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password)
      setErrors((prev) => ({ ...prev, password: undefined }));
    if (error) resetError();
  };

  useEffect(() => {
    if (token) {
      navigate('/home');
    }
  }, [token, navigate]);

  return (
    <div
      className="authContainer justify-center items-center bg-center bg-cover max-sm:bg-[rgba(180,130,238,0.4)]"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.4)), url(${backGroundphoto})`,
      }}
    >
      <div className="bg-white p-5 w-3/4 lg:w-1/3">
        <h2 className="text-2xl font-light">{t('login.signIn')}</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className="min-w-[40%] mt-2.5 p-2.5 bg-[#f6f6f6] border border-gray-300 outline-teal-700"
          />
          <div className="h-4 mb-2">
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email[0]}</p>
            )}
          </div>
          <input
            placeholder={t('login.password')}
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="min-w-[40%] mt-2.5 p-2.5 bg-[#f6f6f6] border border-gray-300 outline-teal-700"
          />
          <div className="h-4">
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password[0]}</p>
            )}
          </div>

          {/* Ошибка сервера */}
          <div className="h-5 mb-4 min-h-4">
            {error && <p className="text-sm font-bold text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-[40%] mt-2.5 py-2.5 px-5 text-white bg-teal-700 hover:bg-teal-600 focus:outline-none cursor-pointer uppercase"
          >
            {/* LOGIN */}
            {t('login.login')}
          </button>
          <Link
            className="my-1 mt-4 text-xs font-medium underline cursor-pointer"
            to="/register"
          >
            {/* DO NOT YOU REMEMBER THE PASSWORD? */}
            {t('login.notRememberPassword')}
          </Link>
          <Link
            className="my-1 text-xs font-medium underline cursor-pointer uppercase"
            to="/register"
          >
            {/* CREATE A NEW ACCOUNT */}
            {t('login.createNewAccount')}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
