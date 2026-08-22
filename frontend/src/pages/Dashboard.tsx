import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchVehicles, purchaseVehicle } from '../store/slices/vehicleSlice';
import { VehicleCard } from '../components/VehicleCard';
import { Input } from '../components/ui/input';
import { MagnifyingGlass } from '@phosphor-icons/react';

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.vehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handlePurchase = async (id: string) => {
    setPurchasingId(id);
    try {
      await dispatch(purchaseVehicle(id)).unwrap();
    } catch (err) {
      console.error("Purchase failed", err);
    } finally {
      setPurchasingId(null);
    }
  };

  const filteredVehicles = items.filter(v => 
    v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight">Vehicle Inventory</h1>
          <p className="text-muted-foreground mt-1">Browse and purchase from our premium selection.</p>
        </div>
        <div className="relative w-full md:w-72">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input 
            placeholder="Search make, model, category..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map(vehicle => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              onPurchase={handlePurchase}
              isPurchasing={purchasingId === vehicle.id}
            />
          ))}
          {filteredVehicles.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No vehicles found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
