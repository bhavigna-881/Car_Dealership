import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui/navigation-menu"

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="pt-4 px-4 w-full sticky top-0 z-50 flex justify-center">
      <NavigationMenu className="w-full max-w-7xl">
        <NavigationMenuList className="flex w-full items-center justify-between bg-[#020403] rounded-full border border-white/10 shadow-2xl px-8 h-[4.5rem]">
          
          {/* Logo */}
          <NavigationMenuItem>
            <Link to="/" className="flex items-center text-white shrink-0" aria-label="Home">
              <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0L0 24H8L18 0H10Z" fill="white"/>
                <path d="M21 0L11 24H19L29 0H21Z" fill="white"/>
                <path d="M32 0L22 24H30L40 0H32Z" fill="white"/>
              </svg>
            </Link>
          </NavigationMenuItem>

          {/* Right Actions */}
          <div className="flex items-center gap-8 shrink-0">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <NavigationMenuItem className="hidden sm:block">
                    <Link to="/admin" className="text-brand-beige font-body hover:opacity-80 transition-opacity text-[15px] font-medium">
                      Admin Dashboard
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-brand-beige font-body font-normal uppercase text-sm tracking-wider hover:opacity-80 transition-opacity"
                  >
                    <span>LOGOUT</span>
                  </button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem className="hidden sm:block">
                  <Link to="/login" className="text-brand-beige font-body hover:opacity-80 transition-opacity text-[15px] font-medium">
                    Login
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/register" className="flex items-center text-brand-beige font-body font-normal uppercase text-sm tracking-wider hover:opacity-80 transition-opacity">
                    <span>REGISTER</span>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
