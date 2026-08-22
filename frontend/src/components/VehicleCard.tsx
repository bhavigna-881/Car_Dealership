import { ShoppingCart } from '@phosphor-icons/react';
import { Vehicle } from '../types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAppSelector } from '../hooks/redux';

interface VehicleCardProps {
  vehicle: Vehicle;
  onPurchase: (id: string) => void;
  isPurchasing: boolean;
}

export function VehicleCard({ vehicle, onPurchase, isPurchasing }: VehicleCardProps) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all hover:shadow-lg border-muted">
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{vehicle.make} {vehicle.model}</CardTitle>
            <CardDescription className="mt-1">{vehicle.category}</CardDescription>
          </div>
          <Badge variant={isOutOfStock ? "destructive" : "default"}>
            {isOutOfStock ? "Out of Stock" : `${vehicle.quantity} Available`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-4">
        <p className="text-3xl font-bold text-primary">
          ${vehicle.price.toLocaleString()}
        </p>
      </CardContent>
      <CardFooter className="pt-4 border-t border-muted/50">
        <Button 
          className="w-full gap-2" 
          disabled={isOutOfStock || isPurchasing || !isAuthenticated}
          onClick={() => onPurchase(vehicle.id)}
        >
          <ShoppingCart size={20} />
          {isPurchasing ? "Purchasing..." : "Purchase"}
        </Button>
      </CardFooter>
      {!isAuthenticated && !isOutOfStock && (
        <div className="px-6 pb-4 text-xs text-center text-muted-foreground">
          Log in to purchase
        </div>
      )}
    </Card>
  );
}
