"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  User,
  LogOut,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useCategories } from "@/hooks/use-api";

interface NavbarProps {
  onCategorySelect?: (category: string | undefined) => void;
  selectedCategory?: string;
  onLocationSelect?: (location: string | undefined) => void;
  selectedLocation?: string;
}

export function Navbar({ onCategorySelect, selectedCategory, onLocationSelect, selectedLocation }: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Popular Ethiopian regions/cities for location filter
  const locations = [
    "Addis Ababa",
    "Dire Dawa",
    "Bahir Dar",
    "Gondar",
    "Mekelle",
    "Hawassa",
    "Jimma",
    "Adama (Nazret)",
    "Dessie",
    "Harar",
    "Shashamane",
    "Arba Minch",
  ];

  const handleCategorySelect = (category: string) => {
    if (onCategorySelect) {
      // If same category is selected, clear the filter
      if (selectedCategory === category) {
        onCategorySelect(undefined);
      } else {
        onCategorySelect(category);
      }
    }
    setMobileMenuOpen(false);
  };

  const handleLocationSelect = (location: string) => {
    if (onLocationSelect) {
      // If same location is selected, clear the filter
      if (selectedLocation === location) {
        onLocationSelect(undefined);
      } else {
        onLocationSelect(location);
      }
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  const navigateToLogin = () => {
    router.push("/login");
    setMobileMenuOpen(false);
  };

  const navigateToRegisterBusiness = () => {
    router.push("/register-business");
    setMobileMenuOpen(false);
  };

  const navigateToMyCompanies = () => {
    router.push("/my-companies");
    setMobileMenuOpen(false);
  };

  const navigateToProfile = () => {
    router.push("/profile");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
            <span className="ml-2 text-xl font-bold text-green-700 dark:text-green-500">
              Misikir
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-3">
          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                Categories <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
              {categoriesLoading ? (
                <DropdownMenuItem disabled>Loading categories...</DropdownMenuItem>
              ) : categories.length > 0 ? (
                <>
                  <DropdownMenuItem
                    onClick={() => onCategorySelect && onCategorySelect(undefined)}
                    className="cursor-pointer font-medium"
                  >
                    All Categories
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => handleCategorySelect(category)}
                      className={`cursor-pointer ${
                        selectedCategory === category ? "bg-accent" : ""
                      }`}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </>
              ) : (
                <DropdownMenuItem disabled>No categories available</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Location Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {selectedLocation || "Location"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 max-h-96 overflow-y-auto">
              <DropdownMenuItem
                onClick={() => onLocationSelect && onLocationSelect(undefined)}
                className="cursor-pointer font-medium"
              >
                All Locations
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {locations.map((location) => (
                <DropdownMenuItem
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`cursor-pointer ${
                    selectedLocation === location ? "bg-accent" : ""
                  }`}
                >
                  {location}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Section */}
          {authLoading ? (
            <div className="h-10 w-20 animate-pulse rounded-md bg-muted" />
          ) : isAuthenticated && user ? (
            <>
              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user.profile_picture || undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline-block">{user.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Role: {user.role.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400">
                        Points: {user.point}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={navigateToProfile}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {(user.role === "COMPANY_OWNER" || user.role === "ADMIN") && (
                    <DropdownMenuItem
                      onClick={navigateToMyCompanies}
                      className="cursor-pointer"
                    >
                      <Building2 className="mr-2 h-4 w-4" />
                      My Companies
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Register Business Button (for company owners) */}
              {user.role === "COMPANY_OWNER" && (
                <Button
                  onClick={navigateToRegisterBusiness}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Add Company
                </Button>
              )}
            </>
          ) : (
            <>
              {/* Login & Register Buttons for non-authenticated users */}
              <Button onClick={navigateToLogin} variant="outline">
                Login
              </Button>
              <Button
                onClick={navigateToRegisterBusiness}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                Register Your Business
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container px-4 py-4 space-y-3">
            {/* Categories */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-muted-foreground px-2">
                Categories
              </p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    onCategorySelect && onCategorySelect(undefined);
                    setMobileMenuOpen(false);
                  }}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className={`w-full justify-start ${
                      selectedCategory === category ? "bg-accent" : ""
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="border-t pt-3">
              {/* Locations */}
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground px-2">
                  Location
                </p>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      onLocationSelect && onLocationSelect(undefined);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    All Locations
                  </Button>
                  {locations.map((location) => (
                    <Button
                      key={location}
                      variant="ghost"
                      className={`w-full justify-start ${
                        selectedLocation === location ? "bg-accent" : ""
                      }`}
                      onClick={() => handleLocationSelect(location)}
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">

              {/* Auth Section */}
              {isAuthenticated && user ? (
                <>
                  <div className="py-3 px-2 border-t mt-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Points: {user.point}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={navigateToProfile}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  {(user.role === "COMPANY_OWNER" || user.role === "ADMIN") && (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={navigateToMyCompanies}
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        My Companies
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={navigateToRegisterBusiness}
                      >
                        <Building2 className="mr-2 h-4 w-4" />
                        Add Company
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 dark:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={navigateToLogin}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full justify-start bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 mt-2"
                    onClick={navigateToRegisterBusiness}
                  >
                    Register Your Business
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
