import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image_0 from '../../assets/slider/photo_3.avif';
import image_1 from '../../assets/slider/photo_4.avif';
import image_2 from '../../assets/slider/photo_5.avif';
import leftArrow from '../../assets/icons/arrow-left.svg';
import rightArrow from '../../assets/icons/arrow-right.svg';
import { useTranslation } from 'react-i18next';

const Slider = () => {
  const { t } = useTranslation();
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const sliderItems = [
    {
      id: 1,
      img: image_0,
      title: t('slider.sliderOneTitle'),
      desc: t('slider.sliderOneDesc'),
    },
    {
      id: 2,
      img: image_2,
      title: t('slider.sliderTwoTitle'),
      desc: t('slider.sliderTwoDesc'),
    },
    {
      id: 3,
      img: image_1,
      title: t('slider.sliderThreeTitle'),
      desc: t('slider.sliderThreeDesc'),
    },
  ];

  const handleClick = (direction: string) => {
    if (direction === 'left') {
      setSlideIndex(slideIndex > 0 ? slideIndex - 1 : 2);
    } else {
      setSlideIndex(slideIndex < 2 ? slideIndex + 1 : 0);
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-108px)] relative overflow-hidden bg-gray-100">
      {/* Arrow Left */}
      <div
        onClick={() => handleClick('left')}
        className="w-12 h-12 bg-[#fff7f7] rounded-full flex items-center justify-center absolute top-0 bottom-0 left-[10px] my-auto cursor-pointer opacity-50 z-10 select-none hover:opacity-100 transition-opacity"
      >
        <img src={leftArrow} alt="leftArrow" className="w-6 h-6" />
      </div>

      {/* Wrapper */}
      <div
        className="h-full flex transition-transform duration-[1500ms] ease-in-out"
        style={{
          transform: `translateX(${slideIndex * -100}vw)`,
        }}
      >
        {sliderItems.map((item) => (
          <div
            className="relative w-screen h-full flex shrink-0 items-center justify-center"
            key={item.id}
          >
            {/* ImgContainer */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* InfoContainer */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white drop-shadow-md">
                {item.title}
              </h1>
              <p className="my-5 md:my-10 text-lg md:text-2xl font-medium tracking-widest uppercase text-white drop-shadow-sm">
                {item.desc}
              </p>
              <button
                onClick={() => navigate('/products?category=all')}
                className="px-7 py-3 text-xs md:text-sm bg-white text-black border-none cursor-pointer hover:bg-black hover:text-white transition-all duration-300 uppercase font-bold tracking-widest"
              >
                {/* SHOP NOW */}
                {t('slider.shopNowButton')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Arrow Right */}
      <div
        onClick={() => handleClick('right')}
        className="w-12 h-12 bg-[#fff7f7] rounded-full flex items-center justify-center absolute top-0 bottom-0 right-[10px] my-auto cursor-pointer opacity-50 z-10 select-none hover:opacity-100 transition-opacity"
      >
        <img src={rightArrow} alt="rightArrow" className="w-6 h-6" />
      </div>
    </div>
  );
};

export default Slider;
