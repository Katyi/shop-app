import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useOrderStore } from '../../store/orderStore';
import dayjs from 'dayjs';
import { Modal } from '../../components/UI/modal/Modal';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../lib/formatPrice';
import { getProductTranslation } from '../../lib/product-helpers';
import { useGenderOptions } from '../../constants/gender';
import UnderlineSelect from '../../components/UI/underlineSelect/UnderlineSelect';
import { formatPhoneNumber } from '../../lib/formatPhoneNumber';
import { profileSchema } from '../../lib/schema';
import UnderlineDatePicker from '../../components/UI/underlineDatePicker/UnderlineDatePicker';
import { useUserStore } from '../../store/userStore';
import { getImageUrl } from '../../lib/getImageUrl';

type FormData = {
  fullname?: string;
  gender?: string;
  birthday?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  img?: string;
};

type ValidationErrors = {
  [key in keyof FormData]?: string[];
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  // const { user, updateUser } = useAuthStore();
  const { user, updateUser } = useUserStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { orders, isLoading, fetchOrders } = useOrderStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({});
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user?.img || null);

  const [errors, setErrors] = useState<ValidationErrors>({});

  const genderOptions = useGenderOptions();

  useEffect(() => {
    fetchOrders();
    window.scrollTo(0, 0);
  }, [fetchOrders]);

  const handleUpdateAccount = () => {
    setFormData({ ...user });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // Показываем картинку сразу
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = profileSchema.safeParse(formData);

    if (result.success) {
      try {
        setErrors({});
        const updatePayload = {
          ...result.data,
          img: file ? file : user?.img,
        };
        const response = await updateUser(updatePayload);
        if (response.success) {
          setIsModalOpen(false);
          setFile(null);
        } else {
          console.log(response.error);
        }
      } catch (error) {
        console.error('Network or Server Error:', error);
      }
    } else {
      const validationErrors = result.error.flatten().fieldErrors;
      setErrors(validationErrors);
    }
  };

  const handleGenderChange = (value: string) => {
    const option = genderOptions.find((o) => o.value === value);
    if (option) {
      setFormData((prev) => ({ ...prev, gender: option.code }));
    }
    setGenderOpen(false);
  };

  return (
    <div className="pageContainer flex-col">
      <main className="p-4 md:p-10 w-full">
        {/* Top Controls & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 pb-8 border-b border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/cart')}
              className="text-sm uppercase opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              {t('profile.shoppingBag')} ({cartItems.length})
            </button>
            <button
              onClick={() => navigate('/wishlist')}
              className="text-sm uppercase  opacity-50 hover:opacity-100 transition cursor-pointer"
            >
              {t('profile.wishlist')} ({wishlistItems.length})
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/products?category=all')}
              className="px-5 py-2 border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              {t('profile.continueShoppingButton')}
            </button>
            <button
              onClick={() => navigate('/home')}
              className="px-5 py-2 border border-black text-xs uppercase font-bold hover:bg-black hover:text-white transition duration-300 cursor-pointer"
            >
              {t('profile.toHomePageButton')}
            </button>
            <button
              onClick={handleUpdateAccount}
              className="px-5 py-2 border border-teal-200 text-teal-500 text-xs uppercase font-bold hover:bg-teal-500 hover:text-white transition duration-300 cursor-pointer"
            >
              {t('profile.updateAccountButton')}
            </button>
          </div>
        </div>

        {/* user info */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20 shadow-sm rounded-sm p-8">
          <div className="flex-1">
            <h1 className="text-2xl font-light uppercase mb-8 tracking-tighter">
              {t('profile.personalInfo')} /{' '}
              <span className="font-bold">{user?.username}</span>
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {[
                {
                  label: t('profile.fullName'),
                  value: user?.fullname || 'Not specified',
                },
                {
                  label: t('profile.birthday'),
                  value: user?.birthday || '_',
                },
                { label: t('profile.email'), value: user?.email },
                { label: 'Phone', value: user?.phone || '—' },
                {
                  label: t('profile.address'),
                  value: user?.address || 'No address saved',
                },
                { label: t('profile.gender'), value: user?.gender || '—' },
                {
                  label: t('profile.occupation'),
                  value: user?.occupation || '—',
                },
                {
                  label: t('profile.active'),
                  value: user?.active === true ? 'Yes' : 'No',
                },
              ].map((field, idx) => (
                <div
                  key={idx}
                  className="border-b border-gray-50 last:border-0 pb-2"
                >
                  <p className="text-[10px] uppercase text-gray-400 tracking-widest mb-1">
                    {field.label}
                  </p>
                  <p className="text-sm font-medium">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* order history */}
        <div>
          <h2 className="text-2xl font-light uppercase mb-8 tracking-widest border-b border-gray-100 pb-4">
            {/* Order History */}
            {t('profile.orderHistory')}
          </h2>

          {isLoading ? (
            <div className="text-center py-10 text-gray-400 animate-pulse uppercase tracking-widest">
              {/* Loading history... */}
              {t('profile.loadingHistory')}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-sm text-gray-400 uppercase text-sm tracking-widest">
              {/* You haven't made any orders yet. */}
              {t('profile.noOrdersYet')}
            </div>
          ) : (
            <div className="space-y-12">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-100 rounded-sm overflow-hidden shadow-sm"
                >
                  {/* Orders header */}
                  <div className="bg-gray-50 p-4 md:px-8 flex flex-wrap justify-between items-center gap-4 text-xs uppercase tracking-wider">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-gray-400 mb-1">
                          {/* Date */}
                          {t('profile.orderDate')}
                        </p>
                        <p className="font-bold">
                          {dayjs(order.createdAt).format('DD.MM.YYYY')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">
                          {t('profile.orderID')}
                          {/* Order ID */}
                        </p>
                        <p className="font-bold">{order.id.slice(-8)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 mb-1">
                          {t('profile.status')}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold ${
                            order.status === 'DELIVERED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 mb-1">
                        {t('profile.orderTotalAmount')}
                      </p>
                      <p className="font-bold">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  {/* Products in order */}
                  <div className="p-4 md:p-8">
                    {order.items?.map((item) => {
                      const content = getProductTranslation(
                        item.product,
                        i18n.language,
                      );

                      return (
                        <div
                          key={item.id}
                          className="flex gap-6 py-4 border-b last:border-0 border-gray-50"
                        >
                          <img
                            src={getImageUrl(item.product.img)}
                            className="w-20 h-24 object-cover grayscale-[0.5] hover:grayscale-0 transition"
                            alt={content?.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = getImageUrl(
                                '/uploads/default-product.png',
                              );
                            }}
                          />
                          <div className="flex-1 flex flex-col justify-center">
                            <p className="text-sm font-bold uppercase">
                              {content?.title}
                            </p>
                            <p className="text-xs text-gray-500 mb-2">
                              {content?.description.slice(0, 100)}...
                            </p>
                            <div className="flex gap-4 text-[10px] uppercase font-bold text-gray-400">
                              <span>
                                {t('profile.orderUnitQuantity')}:{' '}
                                {item.quantity}
                              </span>
                              <span>
                                {t('profile.orderUnitPrice')}:{' '}
                                {formatPrice(item.price)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center font-bold text-sm">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-2">
            <h2 className="text-xl font-light uppercase tracking-tighter mb-3 border-b">
              {t('profile.updateAccountButton')}
            </h2>

            <form onSubmit={handleSubmit} noValidate>
              {/* image */}
              <div className="flex flex-col mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 mb-4 border border-gray-200">
                  <img
                    src={(file ? preview : getImageUrl(user?.img)) || undefined}
                    className="w-full h-full object-cover"
                    alt="Profile"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = getImageUrl('/uploads/default-avatar.png'); // Заглушка для аватара
                    }}
                  />
                </div>
                <label className="text-[10px] uppercase font-bold cursor-pointer hover:text-teal-500 transition">
                  {t('profile.changePhoto')}
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>

              {/* fields */}
              <div className="flex flex-wrap gap-3 justify-between">
                {[
                  {
                    label: 'username',
                    name: 'username',
                    type: 'text',
                  },
                  {
                    label: t('profile.fullName'),
                    name: 'fullname',
                    type: 'text',
                  },
                  {
                    label: t('profile.gender'),
                    name: 'gender',
                    type: 'select',
                  },
                  {
                    label: t('profile.birthday'),
                    name: 'birthday',
                    type: 'date',
                  },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: t('profile.phone'), name: 'phone', type: 'tel' },
                  {
                    label: t('profile.address'),
                    name: 'address',
                    type: 'text',
                  },
                  {
                    label: t('profile.occupation'),
                    name: 'occupation',
                    type: 'text',
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className="w-full md:w-[calc(50%-20px)]"
                  >
                    <label className="text-[10px] uppercase text-gray-400 tracking-widest block mb-1">
                      {field.label}
                    </label>

                    {field.name === 'gender' ? (
                      <UnderlineSelect
                        options={genderOptions}
                        selected={
                          genderOptions.find((o) => o.code === formData.gender)
                            ?.value ||
                          t('profile.selectGender') ||
                          'Select'
                        }
                        onChange={handleGenderChange}
                        open={genderOpen}
                        setOpen={setGenderOpen}
                      />
                    ) : field.name === 'birthday' ? (
                      <UnderlineDatePicker
                        selected={formData.birthday}
                        error={!!errors.birthday}
                        placeholder={t('profile.selectDate')}
                        onChange={(date) => {
                          // Сбрасываем ошибку при выборе даты
                          if (errors.birthday)
                            setErrors((prev) => ({
                              ...prev,
                              birthday: undefined,
                            }));

                          setFormData({
                            ...formData,
                            birthday: date
                              ? date.toISOString().split('T')[0]
                              : '',
                          });
                        }}
                      />
                    ) : (
                      <input
                        // type={field.type}
                        type={field.name === 'email' ? 'text' : field.type}
                        // className="w-full border-b border-gray-200 focus:border-black outline-none pb-1 text-sm transition-colors bg-transparent"
                        className={`w-full border-b outline-none pb-1 text-sm transition-colors bg-transparent ${
                          errors[field.name as keyof FormData]
                            ? 'border-red-500'
                            : 'border-gray-200 focus:border-black'
                        }`}
                        maxLength={field.name === 'phone' ? 16 : undefined}
                        value={formData[field.name as keyof FormData] || ''}
                        onChange={(e) => {
                          const { value } = e.target;
                          if (errors[field.name as keyof FormData]) {
                            setErrors((prev) => ({
                              ...prev,
                              [field.name]: undefined,
                            }));
                          }
                          setFormData({
                            ...formData,
                            [field.name]:
                              field.name === 'phone'
                                ? formatPhoneNumber(value)
                                : value,
                          });
                        }}
                      />
                    )}
                    <div className="min-h-[16px] mt-1">
                      {errors[field.name as keyof FormData] && (
                        <p className="text-[10px] text-red-500 font-medium lowercase first-letter:uppercase">
                          {errors[field.name as keyof FormData]?.[0]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* buttons */}
              <div className="pt-6 flex gap-3">
                <button
                  type="submit"
                  className="w-full bg-black text-white p-3 text-xs uppercase font-bold hover:bg-gray-800 transition cursor-pointer"
                >
                  {t('profile.saveChangesButton')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full border border-gray-200 p-3 text-xs uppercase font-bold hover:bg-gray-50 transition cursor-pointer"
                >
                  {t('profile.cancelButton')}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </main>
    </div>
  );
};

export default Profile;
