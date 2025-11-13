import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
  ExitIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Settings } from "lucide-react";
import SideBar from "../SideBar/SideBar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/Redux/Auth/Action";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleNavigate = () => {
    if (auth.user) {
      auth.user.role === "ROLE_ADMIN"
        ? navigate("/admin/withdrawal")
        : navigate("/profile");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
    setShowLogoutDialog(false);
  };
  return (
    <>
      <div className="px-2 sm:px-4 py-3 border-b z-50 bg-background bg-opacity-0 sticky top-0 left-0 right-0 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sheet className="">
            <SheetTrigger>
              <Button
                className="rounded-full h-11 w-11"
                variant="ghost"
                size="icon"
              >
                <DragHandleHorizontalIcon className=" h-7 w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-80 border-r-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-0 h-full"
              side="left"
            >
              <SheetHeader className="px-6 py-8 border-b border-white/10">
                <SheetTitle>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                      CryptoTradeX
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <div className="h-full flex flex-col">
                <SideBar />
              </div>
            </SheetContent>
          </Sheet>

          <div
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center"
          >
            <span className="text-lg sm:text-xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 via-blue-500 to-green-400 bg-clip-text text-transparent drop-shadow-sm">
              Crypto<span className="from-blue-500 to-green-400 bg-gradient-to-r bg-clip-text text-transparent">Trade</span>
              <span className="text-green-400">X</span>
            </span>
          </div>
          <div className="p-0 ml-4 sm:ml-9">
            <Button
              variant="outline"
              onClick={() => navigate("/search")}
              className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>
        </div>
        <div>
          {auth.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={auth.user.profilePicture} alt={auth.user.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      {auth.user?.fullName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{auth.user.fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {auth.user.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                  <PersonIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowLogoutDialog(true)}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <ExitIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate("/signin")}
              className="text-sm font-medium"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Confirm Logout</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to log out? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="px-6"
            >
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Navbar;
