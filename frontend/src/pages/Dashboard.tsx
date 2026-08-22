import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchVehicles, purchaseVehicle } from '../store/slices/vehicleSlice';
import { VehicleCard } from '../components/VehicleCard';
import { Input } from '../components/ui/input';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { MarketingHero } from '../components/MarketingHero';
import { cn } from '../lib/utils';
import { useToast } from '../hooks/use-toast';

const CATEGORIES = ['ALL', 'PREMIUM', 'COUPE', 'HYPERCAR', 'SUPERCAR', 'CABRIOLET', 'SUV'];

export function Dashboard() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.vehicles);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const handlePurchase = async (id: string) => {
    setPurchasingId(id);
    const vehicle = items.find(v => v.id === id);
    try {
      await dispatch(purchaseVehicle(id)).unwrap();
      if (vehicle) {
        toast({
          title: "Purchase Successful",
          description: `Congratulations! You are the new owner of a ${vehicle.make} ${vehicle.model}.`,
          className: "bg-[#151515] text-[#f7f3e8] border-[#51158c]",
        });
      }
    } catch (err) {
      console.error("Purchase failed", err);
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: "Something went wrong while processing your request.",
      });
    } finally {
      setPurchasingId(null);
    }
  };

  const filteredVehicles = items.filter(v => {
    const matchesSearch = v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'ALL' || v.category.toUpperCase() === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 mb-20">
      {!isAuthenticated && <MarketingHero />}

      <div className="space-y-8">
        {/* Inventory Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white">Our Vehicle Fleet</h1>
          <p className="text-brand-gray max-w-md text-sm md:text-base text-right leading-relaxed hidden md:block">
            We provide our customers with the most incredible driving emotions. 
            That's why we have only world-class cars in our fleet.
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  activeCategory === cat 
                    ? "border-white text-white" 
                    : "border-white/20 text-brand-gray hover:border-white/50 hover:text-white/90"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              placeholder="Search make or model..." 
              className="pl-10 bg-black/40 border-white/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-white/5 animate-pulse" />
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
              <div className="col-span-full py-20 text-center text-muted-foreground">
                No vehicles found matching your criteria.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
