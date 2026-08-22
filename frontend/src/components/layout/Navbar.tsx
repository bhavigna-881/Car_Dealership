import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="pt-4 px-4 w-full sticky top-0 z-50">
      <header className="mx-auto max-w-7xl bg-[#020403] rounded-2xl border border-white/10 shadow-2xl flex h-[4.5rem] items-center justify-between px-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center text-white shrink-0" aria-label="Home">
          <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0L0 24H8L18 0H10Z" fill="white"/>
            <path d="M21 0L11 24H19L29 0H21Z" fill="white"/>
            <path d="M32 0L22 24H30L40 0H32Z" fill="white"/>
          </svg>
        </Link>

        {/* Central Nav Links */}
        <nav className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-brand-gray hover:text-white transition-colors text-[15px] font-medium">About Us</Link>
          <Link to="/" className="text-brand-gray hover:text-white transition-colors text-[15px] font-medium">Cars</Link>
          <Link to="/" className="text-brand-gray hover:text-white transition-colors text-[15px] font-medium">Features</Link>
          <Link to="/" className="text-brand-gray hover:text-white transition-colors text-[15px] font-medium">Help</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-8 shrink-0">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-brand-gray hover:text-white transition-colors text-[15px] font-medium hidden sm:block">
                  Admin Dashboard
                </Link>
              )}
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 text-white font-bold uppercase text-sm tracking-wider hover:text-white/80 transition-colors group"
              >
                <span className="border-b border-white group-hover:border-white/80 pb-[2px]">Logout</span>
                <ArrowUpRight size={18} weight="bold" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-brand-gray hover:text-white transition-colors text-[15px] font-medium hidden sm:block">
                Login
              </Link>
              <Link to="/register" className="flex items-center gap-1 text-white font-bold uppercase text-sm tracking-wider hover:text-white/80 transition-colors group">
                <span className="border-b border-white group-hover:border-white/80 pb-[2px]">Register</span>
                <ArrowUpRight size={18} weight="bold" />
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
