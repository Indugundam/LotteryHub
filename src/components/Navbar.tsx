
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, ChevronDown, Ticket, UserCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  userName?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, userName }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Lotteries', path: '/lotteries' },
    { name: 'Results', path: '/results' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            LotteryHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <Link 
              key={item.name}
              to={item.path}
              className={`text-sm font-medium hover:text-primary transition-colors ${
                location.pathname === item.path 
                  ? 'text-primary' 
                  : 'text-foreground/80'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User size={18} className="text-primary" />
                  <span>{userName || 'User'}</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 animate-slide-down">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer flex items-center">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/tickets" className="cursor-pointer flex items-center">
                    <Ticket className="h-4 w-4 mr-2" />
                    My Tickets
                  </Link>
                </DropdownMenuItem>
                {user?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" className="hover:bg-primary/5">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="animate-pulse-soft">
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm shadow-lg animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {navItems.map(item => (
              <Link 
                key={item.name}
                to={item.path}
                className={`text-base font-medium py-2 ${
                  location.pathname === item.path 
                    ? 'text-primary' 
                    : 'text-foreground/80'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-px w-full bg-border my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-base font-medium py-2 flex items-center">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                <Link to="/profile" className="text-base font-medium py-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <Link to="/tickets" className="text-base font-medium py-2 flex items-center">
                  <Ticket className="h-4 w-4 mr-2" />
                  My Tickets
                </Link>
                {user?.role === "admin" && (
                  <Link to="/admin" className="text-base font-medium py-2 flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-base font-medium py-2 text-left text-red-500 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Button asChild variant="outline">
                  <Link to="/login" className="w-full">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register" className="w-full">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
