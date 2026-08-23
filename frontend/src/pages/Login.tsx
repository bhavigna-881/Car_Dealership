import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch } from '../hooks/redux';
import { login } from '../store/slices/authSlice';
import { api } from '../services/api';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await api.login({ email: formData.email, password: formData.password });
      dispatch(login({
        user: response.user,
        token: response.token
      }));
      navigate('/');
    } catch (error: any) {
      alert(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#020403]">
      
      {/* Left Half: Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-black">
        <img 
          src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1600" 
          alt="Luxury Car" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
        
        <div className="absolute bottom-16 left-12 right-12">
          <h1 className="text-5xl font-heading font-bold text-white leading-tight mb-4">
            Welcome <br /> Back
          </h1>
          <p className="text-white/70 text-lg max-w-md">
            Sign in to access your account and explore our premium vehicle fleet.
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
            <h2 className="text-3xl font-heading font-bold text-[#f7f3e8]">Sign In</h2>
            <p className="text-[#f7f3e8]/60 mt-2">Enter your credentials to continue. <br/><span className="text-xs text-[#a78bfa]">(Hint: use 'admin@test.com' to test admin privileges)</span></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#f7f3e8]">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required
                className="bg-[#151515] border-white/10 text-white h-12 focus-visible:ring-[#51158c]"
                placeholder="m@example.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#f7f3e8]">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  required
                  className="bg-[#151515] border-white/10 text-white h-12 pr-10 focus-visible:ring-[#51158c]"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f7f3e8]/40 hover:text-[#f7f3e8] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#f7f3e8] hover:bg-[#f7f3e8]/90 text-[#020403] font-heading font-bold rounded-lg transition-colors mt-4 text-lg disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#f7f3e8]/60 mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#a78bfa] hover:text-[#f7f3e8] font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
