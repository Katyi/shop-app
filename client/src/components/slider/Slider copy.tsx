import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image_0 from '../../assets/slider/photo_0.png';
import image_1 from '../../assets/slider/photo_1.png';
import image_2 from '../../assets/slider/photo_2.png';
import leftArrow from '../../assets/icons/arrow-left.svg';
import rightArrow from '../../assets/icons/arrow-right.svg';

const Slider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();

  const sliderItems = [
    {
      id: 1,
      img: image_0,
      title: 'SUMMER SALE',
      desc: `DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.`,
      bg: '#fcf1ed',
    },
    {
      id: 2,
      img: image_1,
      title: 'WINTER SALE',
      desc: `DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.`,
      bg: '#f5fafd',
    },
    {
      id: 3,
      img: image_2,
      title: 'POPULAR SALE',
      desc: `DON'T COMPROMISE ON STYLE! GET FLAT 30% OFF FOR NEW ARRIVALS.`,
      bg: '#fbf0f4',
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
    <div className="flex w-full h-screen relative overflow-hidden bg-green-50">
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
            className="w-screen h-full flex shrink items-center justify-center"
            style={{ backgroundColor: item.bg }}
            key={item.id}
          >
            {/* ImgContainer */}
            {/* <div className="flex flex-1 max-md:hidden h-full items-center justify-center">
              <img
                src={item.img}
                alt={item.title}
                className={`h-[80%] w-auto object-contain ${
                  item.id === 1 ? 'md:pl-10' : item.id === 2 ? 'md:pl-5' : ''
                }`}
              />
            </div> */}

            {/* InfoContainer */}
            <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col items-center md:items-start justify-center text-center md:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {item.title}
              </h1>
              <p className="w-[80%] my-5 md:my-10 text-lg md:text-xl font-medium tracking-widest uppercase">
                {item.desc}
              </p>
              <button
                onClick={() => navigate('/products/all')}
                className="px-6 py-3 text-lg md:text-xl bg-transparent border-2 border-black cursor-pointer hover:bg-black hover:text-white transition-all duration-300 uppercase font-semibold"
              >
                SHOP NOW
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
