import React from 'react';
import {
  Wallet,
  ShoppingCart,
  Car,
  Home,
  Coffee,
  Utensils,
  Gift,
  Gamepad,
  Book,
  Laptop,
  Plane,
  Heart,
  Briefcase,
  CreditCard,
  PiggyBank,
  Users,
  GraduationCap,
  Fuel,
  Hospital,
  ShoppingBag,
  Film,
  TrendingUp,
  Wrench,
  Zap,
  Music,
  Shield,
  Tv,
  IndianRupee,
  Tag,
  type LucideProps,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<LucideProps>> = {
  wallet: Wallet,
  'shopping-cart': ShoppingCart,
  car: Car,
  home: Home,
  coffee: Coffee,
  utensils: Utensils,
  gift: Gift,
  gamepad: Gamepad,
  book: Book,
  laptop: Laptop,
  plane: Plane,
  heart: Heart,
  briefcase: Briefcase,
  'credit-card': CreditCard,
  'piggy-bank': PiggyBank,
  users: Users,
  'graduation-cap': GraduationCap,
  fuel: Fuel,
  hospital: Hospital,
  'shopping-bag': ShoppingBag,
  film: Film,
  'trending-up': TrendingUp,
  wrench: Wrench,
  zap: Zap,
  music: Music,
  shield: Shield,
  tv: Tv,
  'dollar-sign': IndianRupee,
  'indian-rupee': IndianRupee,
  rupee: IndianRupee,
  tag: Tag,
};

export interface CategoryIconProps extends LucideProps {
  name?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name = 'tag', ...props }) => {
  const normalizedKey = name.toLowerCase().trim();
  const IconComponent = ICON_MAP[normalizedKey] || Tag;
  return <IconComponent {...props} />;
};

export default CategoryIcon;
