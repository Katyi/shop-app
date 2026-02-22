import {
  Facebook,
  Instagram,
  MailOutlined,
  Phone,
  Pinterest,
  Room,
  Telegram,
  Twitter,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Select from '../UI/selectLang/SelectLang';
import { LANGUAGES } from '../../constants/languages';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // General style for social media icons
  const socialIconBase =
    'w-10 h-10 rounded-full text-white flex items-center justify-center mr-5 cursor-pointer hover:opacity-80 transition-opacity';

  return (
    <footer className="flex flex-col md:flex-row pl-0 md:pl-[3%]">
      {/* LEFT SECTION */}
      <div className="flex-1 flex flex-col p-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('footer.shop_name')}</h1>
          <Select
            className="md:hidden"
            options={LANGUAGES}
            open={open}
            setOpen={setOpen}
          />
        </div>
        <p className="my-5 mb-[30px] leading-6">
          {/* This is my portfolio online-shop. */}
          {t('footer.description')}
          <br />
          {/* Full-Stack shopping app using React, NestJS, Postgres, JWT, Zustand,
          Stripe. */}
          {t('footer.techStack')}
        </p>
        <div className="flex">
          <div className={`${socialIconBase} bg-[#3B5999]`}>
            <Facebook />
          </div>
          <div className={`${socialIconBase} bg-[#E4405F]`}>
            <Instagram />
          </div>
          <div className={`${socialIconBase} bg-[#55ACEE]`}>
            <Twitter />
          </div>
          <div className={`${socialIconBase} bg-[#E60023]`}>
            <Pinterest />
          </div>
          <div className={`${socialIconBase} bg-[#55ACEE]`}>
            <Telegram />
          </div>
        </div>
      </div>

      {/* CENTER SECTION (Hidden on mobile) */}
      <div className="flex-1 p-5 block max-md:hidden">
        <h3 className="mb-[30px] font-bold text-xl">
          {/* Useful Links */}
          {t('footer.links')}
        </h3>
        <ul className="m-0 p-0 list-none flex flex-wrap">
          <li
            onClick={() => navigate('/home')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* Home */}
            {t('footer.home')}
          </li>
          <li
            onClick={() => navigate('/cart')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* Cart */}
            {t('footer.cart')}
          </li>
          <li
            onClick={() => navigate('/products?category=men')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* Men  */}
            {t('footer.men')}
          </li>
          <li
            onClick={() => navigate('/products?category=women')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* Women */}
            {t('footer.women')}
          </li>
          <li
            onClick={() => navigate('/products?category=accessories')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* Accessories */}
            {t('footer.accessories')}
          </li>
          <li
            onClick={() => navigate('/profile')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* My Account */}
            {t('footer.myAccount')}
          </li>
          <li
            onClick={() => navigate('/wishlist')}
            className="w-1/2 mb-2.5 cursor-pointer hover:underline"
          >
            {/* Wishlist */}
            {t('footer.wishlist')}
          </li>
        </ul>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex-1 p-5 bg-transparent">
        <h3 className="mb-[30px] font-bold text-xl">{t('footer.contact')}</h3>
        <div className="mb-5 flex items-center">
          <Room className="mr-2.5" />
          {/* 151 W 34th St., New York, NY 10001 */}
          {t('footer.address')}
        </div>
        <div className="mb-5 flex items-center">
          <Phone className="mr-2.5" /> {t('footer.phone')}
        </div>
        <div className="mb-5 flex items-center">
          <MailOutlined className="mr-2.5" /> admin@shop.com
        </div>
        <img
          src="/footer/creditCards.png"
          alt="Payment methods"
          className="w-[70%]"
        />
      </div>
    </footer>
  );
};

export default Footer;
