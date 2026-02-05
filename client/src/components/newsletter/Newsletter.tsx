import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
// import Send from '../../assets/icons/send-horizontal.svg';
import { useTranslation } from 'react-i18next';

const Newsletter = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;

    setIsSubmitting(true);

    // Замени эти ID на свои из личного кабинета EmailJS
    emailjs
      .sendForm(
        'service_concl95', // 'YOUR_SERVICE_ID',
        'template_31uszxn', // 'YOUR_TEMPLATE_ID',
        formRef.current,
        'rWV4F6HwAyGhPrFOR' // 'YOUR_PUBLIC_KEY'
      )
      .then(
        (result) => {
          console.log(result.text);
          setIsSent(true);
          setIsSubmitting(false);
          formRef.current?.reset(); // Очистить форму
        },
        (error) => {
          console.log(error.text);
          setIsSubmitting(false);
          alert('Something went wrong, please try again.');
        }
      );
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center gap-5 pb-20 px-4">
      <h1 className="text-3xl md:text-4xl m-0 mt-10 font-bold uppercase tracking-tighter">
        {/* Contact Us */}
        {t('newsletter.title')}
      </h1>

      <div className="text-sm md:text-base font-light text-center uppercase tracking-widest mb-5">
        {/* {isSent ? "Thank you! We'll get back to you soon." : 'Send us an email'} */}
        {isSent ? t('newsletter.thank') : t('newsletter.desc')}
      </div>

      {!isSent ? (
        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="w-full flex flex-col items-center gap-4"
        >
          {/* Name */}
          <div className="w-[80%] md:w-1/2 bg-white flex border border-black/10 focus-within:border-black transition-colors">
            <input
              placeholder="NAME"
              type="text"
              name="name" // Должно совпадать с {{name}} в шаблоне
              required
              className="h-14 w-full border-none pl-5 outline-none text-[12px] uppercase tracking-widest"
            />
          </div>

          {/* Email */}
          <div className="w-[80%] md:w-1/2 bg-white flex border border-black/10 focus-within:border-black transition-colors">
            <input
              placeholder="EMAIL"
              type="email"
              name="email" // Должно совпадать с {{email}} в шаблоне
              required
              className="h-14 w-full border-none pl-5 outline-none text-[12px] uppercase tracking-widest"
            />
          </div>

          {/* Message */}
          <div className="w-[80%] md:w-1/2 bg-white flex border border-black/10 focus-within:border-black transition-colors">
            <textarea
              placeholder="MESSAGE"
              name="message" // Должно совпадать с {{message}} в шаблоне
              required
              className="h-[140px] w-full border-none p-5 outline-none resize-none text-[12px] uppercase tracking-widest"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-[80%] md:w-1/2 h-14 bg-black text-white text-[12px] font-medium uppercase tracking-[0.3em] hover:bg-gray-800 transition-all cursor-pointer flex items-center justify-center disabled:bg-gray-400"
          >
            {/* {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'} */}
            {isSubmitting ? t('newsletter.sending') : t('newsletter.send')}
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsSent(false)}
          className="mt-5 text-[12px] underline underline-offset-4 tracking-widest uppercase cursor-pointer"
        >
          {/* Send another message */}
          {t('newsletter.sendAgain')}
        </button>
      )}
    </div>
  );
};

export default Newsletter;
