import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const validateMobile = (mobile: string) => {
    // 10 without country code OR 12/13 with country code (e.g., +123456789012 or +12345678901)
    const regex = /^(?:\+\d{11,12}|\d{10})$/;
    return regex.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validateMobile(formData.mobile)) {
      setError('Invalid mobile number. Use 10 digits or 12/13 digits with + country code.');
      return;
    }

    // TODO: Call API
    console.log('Registration submitted:', formData);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex w-full bg-[#020403]">
      
      {/* Left Half: Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1600" 
          alt="Luxury Car" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        
        <div className="absolute bottom-16 left-12 right-12">
          <h1 className="text-5xl font-heading font-bold text-white leading-tight mb-4">
            Begin Your <br /> Journey
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Create an account to gain exclusive access to our premium vehicle fleet.
          </p>
        </div>
      </div>

      {/* Right Half: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-[#f7f3e8]/60 hover:text-[#f7f3e8] transition-colors text-sm font-medium mb-6">
              <ArrowLeft size={16} />
              Return to Home
            </Link>
            <h2 className="text-3xl font-heading font-bold text-[#f7f3e8]">Create an Account</h2>
            <p className="text-[#f7f3e8]/60 mt-2">Enter your details to register.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#f7f3e8]">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                required
                className="bg-[#151515] border-white/10 text-white h-12 focus-visible:ring-[#51158c]"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#f7f3e8]">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required
                className="bg-[#151515] border-white/10 text-white h-12 focus-visible:ring-[#51158c]"
                placeholder="john@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-[#f7f3e8]">Mobile Number</Label>
              <Input 
                id="mobile" 
                type="tel" 
                required
                className="bg-[#151515] border-white/10 text-white h-12 focus-visible:ring-[#51158c]"
                placeholder="+123456789012 or 1234567890"
                value={formData.mobile}
                onChange={e => setFormData({...formData, mobile: e.target.value})}
              />
              <p className="text-xs text-[#f7f3e8]/40">10 digits, or 12/13 digits with + country code</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#f7f3e8]">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required
                className="bg-[#151515] border-white/10 text-white h-12 focus-visible:ring-[#51158c]"
                placeholder="••••••••"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#f7f3e8]">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                required
                className="bg-[#151515] border-white/10 text-white h-12 focus-visible:ring-[#51158c]"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-12 bg-[#51158c] hover:bg-[#51158c]/90 text-white font-medium rounded-lg transition-colors mt-4"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-[#f7f3e8]/60">
            Already have an account?{' '}
            <Link to="/login" className="text-[#a78bfa] hover:text-[#f7f3e8] font-medium transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
