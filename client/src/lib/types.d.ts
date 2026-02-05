interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  // password: string;
  role: Role;
  img: file | string;
  address: string;
  phone: string;
  occupation: string;
  gender: string;
  birthday: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

interface ValidationErrors {
  [key: string]: string[];
}

interface IProductTranslation {
  id: string;
  language: string;
  title: string;
  description: string;
  productId: string;
}

interface IProduct {
  id: string;
  // title: string;
  // description: string;
  img: string;
  categories: string[];
  size: string[];
  color: string[];
  price: number;
  oldPrice: number | null | undefined;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;

  productTranslations: IProductTranslation[];
  [key: string]: string | number | boolean | string[] | undefined;
  // [key: string]: any;
}

interface CartItem {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  quantity: number;
  product: IProduct; // Вложенный объект товара, который мы добавили через include в Prisma
}

interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: IProduct;
  // {
  //   title: string;
  //   img: string;
  //   description: string;
  // };
}

interface IOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  address: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[];
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
