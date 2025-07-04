import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Home, MapPin, Phone, Briefcase, LogOut, UserCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-foreground hover:bg-primary/80 transition-colors"
  >
    {icon && React.cloneElement(icon, { className: "mr-2 h-5 w-5" })}
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, icon, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-secondary transition-colors"
  >
    {icon && React.cloneElement(icon, { className: "mr-2 h-5 w-5" })}
    {children}
  </Link>
);

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-secondary/30">
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="sticky top-0 z-50 shadow-lg bg-primary/90 backdrop-blur-md"
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <MapPin className="h-10 w-10 text-accent animate-pulse" />
              <span className="ml-3 text-3xl font-bold text-primary-foreground tracking-tight">TourBook</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/" icon={<Home />}>Home</NavLink>
              <NavLink to="/places" icon={<MapPin />}>Tourist Places</NavLink>
              <NavLink to="/contact" icon={<Phone />}>Contact</NavLink>
              {user && <NavLink to="/bookings" icon={<Briefcase />}>Bookings</NavLink>}
            </div>

            <div className="flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-accent">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullName}`} alt={user.fullName} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glassmorphic" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/')}>
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/bookings')}>
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>My Bookings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="outline" className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/login')}>Login</Button>
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={() => navigate('/register')}>Sign Up</Button>
                </div>
              )}

              {/* Mobile Navigation Menu */}
              <div className="md:hidden ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-primary-foreground">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 glassmorphic" align="end" forceMount>
                    <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild><MobileNavLink to="/" icon={<Home />}>Home</MobileNavLink></DropdownMenuItem>
                    <DropdownMenuItem asChild><MobileNavLink to="/places" icon={<MapPin />}>Tourist Places</MobileNavLink></DropdownMenuItem>
                    <DropdownMenuItem asChild><MobileNavLink to="/contact" icon={<Phone />}>Contact</MobileNavLink></DropdownMenuItem>
                    {user && <DropdownMenuItem asChild><MobileNavLink to="/bookings" icon={<Briefcase />}>Bookings</MobileNavLink></DropdownMenuItem>}
                    <DropdownMenuSeparator />
                    {!user && (
                      <>
                        <DropdownMenuItem onClick={() => navigate('/login')}>
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Login</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate('/register')}>
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Sign Up</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
        className="bg-primary/90 text-primary-foreground py-8 text-center shadow-top"
      >
        <div className="container mx-auto px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} TourBook. All rights reserved.</p>
          <p className="text-xs mt-1">Crafted with by Tour Book</p>
        </div>
      </motion.footer>
      <Toaster />
    </div>
  );
};

export default Layout;