import { useCategories } from '../../constants/categories';
import CategoryItem from '../categoryItem/CategoryItem';

const Categories = () => {
  return (
    <div className="flex flex-col md:flex-row sm:py-1.5 gap-2 justify-between w-full">
      {useCategories()
        .filter((item) => item.img)
        .map((item) => (
          <CategoryItem item={item} key={item.id} />
        ))}
    </div>
  );
};

export default Categories;
