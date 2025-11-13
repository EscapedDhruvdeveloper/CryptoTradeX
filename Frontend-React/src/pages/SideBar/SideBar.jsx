import { logout } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  ExitIcon,
  HandIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  BellIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, SettingsIcon, WalletIcon, BarChart3Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const menu = [
  { name: "Home", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
  {
    name: "Portfolio",
    path: "/portfolio",
    icon: <DashboardIcon className="h-5 w-5" />,
  },
  {
    name: "Watchlist",
    path: "/watchlist",
    icon: <BookmarkIcon className="h-5 w-5" />,
  },
  {
    name: "Compare",
    path: "/compare",
    icon: <BarChart3Icon className="h-5 w-5" />,
  },
  {
    name: "Activity",
    path: "/activity",
    icon: <ActivityLogIcon className="h-5 w-5" />,
  },
  { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-5 w-5" /> },
  {
    name: "Payment Details",
    path: "/payment-details",
    icon: <LandmarkIcon className="h-5 w-5" />,
  },
  {
    name: "Withdrawal",
    path: "/withdrawal",
    icon: <CreditCardIcon className="h-5 w-5" />,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: <PersonIcon className="h-5 w-5" />,
  },
  { name: "Logout", path: "/", icon: <ExitIcon className="h-5 w-5" /> },
];
const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleMenuClick = (item) => {
    if (item.name == "Logout") {
      handleLogout();
      navigate(item.path);
    } else {
      navigate(item.path);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Menu - Takes full height */}
      <div className="flex-1 flex flex-col justify-between px-6 py-12">
        {/* Main Menu Items */}
        <div className="space-y-4">
          {menu.slice(0, -1).map((item, index) => (
            <SheetClose key={item.name} className="w-full">
              <Button
                onClick={() => handleMenuClick(item)}
                variant="ghost"
                className="flex items-center gap-4 py-5 px-6 w-full text-left transition-all duration-200 rounded-xl text-gray-300 hover:text-white hover:bg-white/10"
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="text-base font-medium">{item.name}</span>
              </Button>
            </SheetClose>
          ))}
        </div>
        
        {/* Logout Button - Positioned at bottom */}
        <div className="mt-8">
          <SheetClose className="w-full">
            <Button
              onClick={() => handleMenuClick(menu[menu.length - 1])}
              variant="ghost"
              className="flex items-center gap-4 py-5 px-6 w-full text-left transition-all duration-200 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <span className="flex-shrink-0">{menu[menu.length - 1].icon}</span>
              <span className="text-base font-medium">{menu[menu.length - 1].name}</span>
            </Button>
          </SheetClose>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
