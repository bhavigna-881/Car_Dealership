import { CarProfile } from '@phosphor-icons/react';

interface MarketingHeroProps {
  onBookNow?: () => void;
}

export function MarketingHero({ onBookNow }: MarketingHeroProps) {
  return (
    <div className="mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        
        {/* Left Column */}
        <div className="flex flex-col justify-between">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-8">
            Elevate Your Travel <br /> Experience
          </h1>
          
          <div className="grid grid-cols-2 gap-4 h-48 sm:h-64 mt-auto">
            {/* Lamborghini Card */}
            <div className="relative rounded-3xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800" 
                alt="Lamborghini" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold">
                  Lamborghini
                </span>
                <div className="flex items-center gap-1 text-white font-medium">
                  6 <CarProfile size={20} weight="fill" />
                </div>
              </div>
            </div>
            
            {/* McLaren Card */}
            <div className="relative rounded-3xl overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800" 
                alt="McLaren" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <span className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-semibold">
                  McLaren
                </span>
                <div className="flex items-center gap-1 text-white font-medium">
                  3 <CarProfile size={20} weight="fill" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Mercedes */}
        <div className="relative rounded-3xl overflow-hidden h-[400px] lg:h-auto min-h-[500px] group">
          <img 
            src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800" 
            alt="Mercedes-Benz" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
            <span className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold">
              Mercedes-Benz
            </span>
            <div className="flex items-center gap-1 text-white font-medium text-lg">
              14 <CarProfile size={24} weight="fill" />
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-white w-full md:w-1/3 leading-tight">
          Luxury Meets <br /> Performance
        </h2>
        <p className="text-brand-gray text-sm md:text-[15px] w-full md:w-[40%] leading-relaxed">
          Discover the perfect solution for all your business transportation needs, 
          indulge in a luxurious wedding getaway experience, 
          or embark on an unforgettable thrill — experience excellence with 
          our unmatched service.
        </p>
        <div className="w-full md:w-auto flex justify-end">
          <button 
            onClick={onBookNow}
            className="w-full md:w-auto bg-white text-black font-bold uppercase text-sm tracking-wider px-10 py-4 rounded-full hover:bg-brand-beige transition-colors"
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
}
