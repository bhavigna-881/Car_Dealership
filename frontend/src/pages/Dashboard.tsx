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
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

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
    const searchWords = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matchesSearch = searchWords.length === 0 || searchWords.every(word =>
      v.make.toLowerCase().includes(word) ||
      v.model.toLowerCase().includes(word)
    );
    const matchesCategory = activeCategory === 'ALL' || v.category.toUpperCase() === activeCategory;

    let matchesPrice = true;
    if (minPrice !== '') {
      matchesPrice = matchesPrice && v.price >= Number(minPrice);
    }
    if (maxPrice !== '') {
      matchesPrice = matchesPrice && v.price <= Number(maxPrice);
    }

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleScrollToFleet = () => {
    document.getElementById('fleet-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 mb-20">
      {!isAuthenticated && <MarketingHero onBookNow={handleScrollToFleet} />}

      <div id="fleet-section" className="space-y-8">
        {/* Inventory Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight text-white">Our Vehicle Fleet</h1>
          <p className="text-brand-gray max-w-md text-sm md:text-base text-right leading-relaxed hidden md:block">
            We provide our customers with the most incredible driving emotions.
            That's why we have only world-class cars in our fleet.
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
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

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min $"
                className="w-24 bg-black/40 border-white/10"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Max $"
                className="w-24 bg-black/40 border-white/10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-64 shrink-0">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search make or model..."
                className="pl-10 bg-black/40 border-white/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
