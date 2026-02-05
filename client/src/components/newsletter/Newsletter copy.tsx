import Send from '../../assets/icons/send-horizontal.svg';

const Newsletter = () => {
  return (
    <form
      target="_blank"
      action="https://formsubmit.co/5d13c2bc82b9e52b4d8ba632e529897c"
      method="POST"
      className="bg-[#fcf5f5] flex flex-col items-center gap-5 pb-10 px-4"
      // className="bg-gray-100 flex flex-col items-center gap-5 pb-10 px-4"
    >
      {/* Title */}
      <h1 className="text-3xl md:text-[70px] md:leading-[70px] m-0 mt-10 font-bold">
        Contact Us
      </h1>

      {/* Desc */}
      <div className="text-lg md:text-2xl font-light text-center md:text-left">
        Send us an email and we'll get back to you soon.
      </div>

      <input
        type="hidden"
        name="_next"
        value="http://212.113.120.58:5173/thanks"
      />

      {/* Name Input */}
      <div className="w-[80%] md:w-1/2 bg-white flex justify-between border border-gray-300">
        <input
          placeholder="Name"
          type="text"
          name="name"
          required
          className="h-10 border-none flex-[8] pl-5 outline-none"
        />
      </div>

      {/* Message Textarea */}
      <div className="w-[80%] md:w-1/2 bg-white flex justify-between border border-gray-300">
        <textarea
          placeholder="Message"
          name="message"
          required
          className="h-[140px] border-none flex-[8] p-2.5 px-5 outline-none resize-none"
        />
      </div>

      {/* Email Input & Submit Button */}
      <div className="w-[80%] md:w-1/2 bg-white flex justify-between border border-gray-300">
        <input
          placeholder="Your email"
          type="email"
          name="email"
          required
          className="h-10 border-none flex-8 pl-5 outline-none"
        />
        <button
          type="submit"
          className="flex-1 border-none bg-teal-600 text-white cursor-pointer hover:bg-teal-700 transition-colors flex items-center justify-center"
        >
          <img src={Send} alt="Send" width={28} height={24} />
        </button>
      </div>
    </form>
  );
};

export default Newsletter;
