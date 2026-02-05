import loadingIcon from '../../../assets/loadingIcon.svg';

const Loader = () => {
  return (
    <img
      src={loadingIcon}
      alt="Loading..."
      className="w-12 h-12 animate-spin"
    />
  );
};

export default Loader;
