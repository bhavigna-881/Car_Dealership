import { ShoppingCart } from '@phosphor-icons/react';
import type { Vehicle } from '../types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useAppSelector } from '../hooks/redux';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  isPurchasing: boolean;
}

const getImageForMake = (make: string) => {
  const m = make.toLowerCase();
  if (m.includes('toyota')) return 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?q=80&w=800';
  if (m.includes('honda')) return 'https://images.unsplash.com/photo-1606664515524-ed2f786a0b18?q=80&w=800';
  if (m.includes('ford')) return 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=800';
  if (m.includes('tesla')) return 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=800';
  if (m.includes('lamborghini')) return 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800';
  if (m.includes('mclaren')) return 'https://images.unsplash.com/photo-1620882814836-98a4497a151b?q=80&w=800';
  if (m.includes('mercedes')) return 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800';
  return 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=800';
};

export function VehicleCard({ vehicle, onPurchase, isPurchasing }: VehicleCardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <Card className="flex flex-col h-[28rem] overflow-hidden transition-all hover:shadow-xl hover:shadow-brand-pop-purple/10 border-white/10 bg-[#151515] group">
      {/* Top 2/3: Image Layout */}
      <div className="relative h-2/3 w-full overflow-hidden">
        <img 
          src={getImageForMake(vehicle.make)} 
          alt={`${vehicle.make} ${vehicle.model}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 right-4">
          <Badge variant={isOutOfStock ? "destructive" : "default"} className="font-medium bg-black/60 text-white backdrop-blur-md border border-white/10 px-3 py-1">
            {isOutOfStock ? "Out of Stock" : `${vehicle.quantity} Available`}
          </Badge>
        </div>
      </div>

      {/* Bottom 1/3: Content */}
      <CardContent className="h-1/3 flex flex-col justify-between p-5 bg-black/40 backdrop-blur-xl">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <h3 className="text-xl font-heading font-bold text-brand-beige truncate">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-sm text-brand-beige/60 mt-0.5 truncate">
              {vehicle.category}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-bold text-brand-beige tracking-tight">
              ${vehicle.price.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <button 
            className="w-full flex items-center justify-center gap-2 bg-brand-pop-purple hover:bg-brand-pop-purple/80 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isOutOfStock || isPurchasing || !isAuthenticated}
            onClick={() => onPurchase(vehicle.id)}
          >
            <ShoppingCart size={18} weight="bold" />
            {isPurchasing ? "Processing..." : isAuthenticated ? "Purchase Now" : "Log In to Purchase"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
