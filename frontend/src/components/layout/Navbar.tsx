import { Link, useNavigate } from 'react-router-dom';
import { CarProfile, SignOut, SignIn, UserPlus } from '@phosphor-icons/react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import { Button } from '../ui/button';

export function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <CarProfile size={32} weight="fill" />
          <span className="text-xl font-bold font-heading">AutoInventory</span>
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin">
                  <Button variant="outline" className="font-medium">Admin Dashboard</Button>
                </Link>
              )}
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-muted-foreground mr-2">Hello, {user?.email}</span>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
                  <SignOut size={20} />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="gap-2">
                  <SignIn size={20} /> Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="gap-2">
                  <UserPlus size={20} /> Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
