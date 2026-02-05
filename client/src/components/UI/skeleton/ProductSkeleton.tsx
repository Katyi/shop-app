// src/components/products/ProductSkeleton.tsx
const ProductSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {/* Имитация изображения */}
      <div className="w-full h-[350px] bg-gray-200"></div>
    </div>
  );
};

export default ProductSkeleton;
