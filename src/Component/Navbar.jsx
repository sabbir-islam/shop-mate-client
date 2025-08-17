import React, { use, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FiLogOut } from "react-icons/fi";
import axios from "axios";

import {
  HomeIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  TagIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const {logOut, user} = use(AuthContext);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState('');

  // Update current date and time in UTC format (YYYY-MM-DD HH:MM:SS)
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      setCurrentDateTime(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
    };
    
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.email) {
        try {
          setLoading(true);
          const response = await axios.get('https://shop-mate-server.vercel.app/users');
          const users = response.data;
          
          // Find the current user by email
          const currentUser = users.find(u => u.email === user.email);
          if (currentUser) {
            setUserData(currentUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [user]);

  const menuItems = [
    { name: "Dashboard", href: "/", icon: HomeIcon },
    { name: "Products", href: "/products", icon: ShoppingBagIcon },
    { name: "Add Sale", href: "/add-sale", icon: ClipboardDocumentListIcon },
    { name: "Sales Report", href: "/sales", icon: CurrencyDollarIcon },
    { name: "Suppliers", href: "/suppliers", icon: TruckIcon },
    { name: "Employee", href: "/employee", icon: UserGroupIcon },
    { name: "Notifications", href: "/notifications", icon: BellIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handelLOgOut = () => {
    logOut()
    .then(result => {
      toast.success("LogOut Successful")
      navigate("/login")
    })
    .catch(err => {
      toast.error(err)
    })
  }

  // Get user's initials for fallback avatar
  const getUserInitials = () => {
    if (userData && userData.name) {
      return userData.name.charAt(0).toUpperCase();
    } else if (user && user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-14 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-lg text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isSidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ${isSidebarOpen ? "w-64" : "w-20"} bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-center h-20 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#3B82DE] rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-6 w-6 text-white" />
              </div>
              {isSidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold text-white">ShopMate</h1>
                  <p className="text-xs text-slate-400">Shop Management</p>
                </div>
              )}
            </div>
          </div>

          

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    active
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  title={!isSidebarOpen ? item.name : ""}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      active ? "text-white" : "text-slate-400 group-hover:text-white"
                    } ${isSidebarOpen ? "mr-3" : "mx-auto"}`}
                  />
                  {isSidebarOpen && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {active && isSidebarOpen && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-700">
            <div className="flex items-center space-x-3">
              {userData && userData.photo ? (
                <img 
                  src={userData.photo} 
                  alt={userData.name} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">{getUserInitials()}</span>
                </div>
              )}
              
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {userData ? userData.name : user?.email || 'Shop User'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    Shop Manager
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* log out here  */}
          <div className="p-4 border-t border-slate-700">
            <button 
              onClick={handelLOgOut} 
              className={`btn bg-transparent text-white border-white rounded-xl shadow shadow-0 ${
                isSidebarOpen ? "flex items-center justify-center w-full" : "p-2"
              }`}
            >
              {isSidebarOpen ? (
                <>
                  Logout <FiLogOut className="ml-2" />
                </>
              ) : (
                <FiLogOut className="mx-auto" />
              )}
            </button>
          </div>

          {/* Toggle Button for Desktop */}
          <div className="hidden lg:block p-4 border-t border-slate-700">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors duration-200"
            >
              {isSidebarOpen ? (
                <>
                  <XMarkIcon className="h-5 w-5 mr-2" />
                  <span className="text-sm">Collapse</span>
                </>
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;