import {
  Target,
  Shield,
  Plane,
  Car,
  Home,
  Laptop,
  Gift,
  Heart,
  Briefcase,
  GraduationCap,
  DollarSign,
  Wallet,
} from 'lucide-react';

export const renderGoalIcon = (iconName?: string, className = 'h-5 w-5') => {
  switch (iconName?.toLowerCase()) {
    case 'shield':
      return <Shield className={className} />;
    case 'plane':
      return <Plane className={className} />;
    case 'car':
      return <Car className={className} />;
    case 'home':
      return <Home className={className} />;
    case 'laptop':
      return <Laptop className={className} />;
    case 'gift':
      return <Gift className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'graduationcap':
      return <GraduationCap className={className} />;
    case 'dollarsign':
      return <DollarSign className={className} />;
    case 'wallet':
      return <Wallet className={className} />;
    case 'target':
    default:
      return <Target className={className} />;
  }
};
