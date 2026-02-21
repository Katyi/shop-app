import { useEffect, useState } from 'react';
import backGroundphoto from '../../../public/backGroundPhoto/backGroundphoto1.avif';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { registerSchema } from '../../lib/schema';
import { useTranslation } from 'react-i18next';

type ValidationErrors = {
  username?: string[];
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
};

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const { register, token, error, resetError } = useAuthStore();

  useEffect(() => {
    resetError();
  }, [resetError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse({
      username,
      email,
      password,
      confirmPassword,
    });

    if (result.success) {
      setErrors({});
      await register(username, email, password);
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: keyof ValidationErrors,
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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
        <h2 className="text-2xl font-light">{t('register.createAccount')}</h2>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <input
            placeholder={t('register.username')}
            value={username}
            onChange={handleInputChange(setUsername, 'username')}
            className="min-w-[40%] mt-2.5 p-2.5 bg-[#f6f6f6] border border-gray-300 outline-teal-700"
          />
          <div className="h-4 mb-2">
            {errors.username && (
              <p className="text-xs text-red-500">{errors.username[0]}</p>
            )}
          </div>

          <input
            placeholder="Email"
            value={email}
            onChange={handleInputChange(setEmail, 'email')}
            className="min-w-[40%] mt-2.5 p-2.5 bg-[#f6f6f6] border border-gray-300 outline-teal-700"
          />
          <div className="h-4 mb-2">
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email[0]}</p>
            )}
          </div>

          <input
            placeholder={t('register.password')}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            className="min-w-[40%] mt-2.5 p-2.5 bg-[#f6f6f6] border border-gray-300 outline-teal-700"
          />
          <div className="h-4">
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password[0]}</p>
            )}
          </div>

          <input
            placeholder={t('register.confirmPassword')}
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            className="min-w-[40%] mt-2.5 p-2.5 bg-[#f6f6f6] border border-gray-300 outline-teal-700"
          />
          <div className="h-4 mb-2">
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword[0]}
              </p>
            )}
          </div>

          {/* Ошибка сервера */}
          <div className="h-5 mb-4 min-h-4">
            {error && !errors.email && !errors.password && !errors.username && (
              <p className="text-sm font-bold text-red-500">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-[40%] mt-2.5 py-2.5 px-5 text-white bg-teal-700 hover:bg-teal-600 focus:outline-none cursor-pointer"
          >
            {t('register.create')}
          </button>

          <Link
            className="my-1 mt-4 text-xs font-medium underline cursor-pointer uppercase"
            to="/"
          >
            {/* SIGN IN IF YOU ALREADY HAVE AN ACCOUNT */}
            {t('register.alreadyHaveAccount')}
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
