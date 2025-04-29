import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { FaClipboardList, FaRegBell, FaRegUser, FaShoppingCart, FaSignOutAlt } from "react-icons/fa";
import { RiSearch2Line } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import avatar from "@/images/avatar.png";
import ButtonCircle3 from "@/shared/Button/ButtonCircle3";
import Input from "@/shared/Input/Input";
import Logo from "@/shared/Logo/Logo";
import {LOCAL_CUSTINFO_KEY} from "@/utils/constants";
import { editCustomer } from "@/utils/SecureDataService";

import CartSideBar from "../CartSideBar";
import MenuBar from "./MenuBar";
import UserProfileModal from "./UserProfile";

// Define a proper type for user data
interface UserData {
  customerId: string;
  name: string;
  mobileNo: string;
  gender?: string | null;
  dob?: string | null;
  email?: string;
}

const MainNav = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { isAuthenticated, logout, getCustInfo } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    customerId: "",
    name: "",
    mobileNo: "",
    email: ""
  });
  // const [isLoading, setIsLoading] = useState(false);
  const getUserDetails = async () => {
    try {
      const customerInfo = await getCustInfo();
      setUserData(customerInfo || {});
    } catch (error) {
      console.error("Error fetching customer info:", error);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  const handleLogOut = useCallback(() => {
    try {
      setShowLogoutModal(false);
      logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [logout, router]);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleSaveUser = useCallback(async (updatedData: UserData) => {
    try {
      const convertedData = {
        ...updatedData,
        gender: updatedData.gender ?? undefined,
        dob: updatedData.dob === null ? undefined : updatedData.dob
      };
      await editCustomer(convertedData).then((res) => {
        setUserData(res);
        localStorage.setItem(LOCAL_CUSTINFO_KEY, JSON.stringify(res));
      });
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsModalOpen(false);
    }
  }, []);

  return (
    <header className="w-full flex items-center justify-between py-4 bg-gray-900 text-white px-3 lg:px-12">
      <div className="flex items-center gap-5">
        <div className="lg:hidden">
          <MenuBar />
        </div>
        <Logo className="shrink-0" />
      </div>
      <div className="hidden max-w-2xl flex-1 items-center gap-3 rounded-full border border-gray px-4 lg:flex transition-colors">
        <button
          className="shrink-0 text-black hover:text-green-400 transition-colors"
          type="button"
        >
          <RiSearch2Line className="text-2xl" />
        </button>
        <Input
          type="text"
          className="grow border-none bg-transparent placeholder-gray-400 text-[17px] font-light focus:ring-0 text-black"
          placeholder="Search..."
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="relative hidden lg:block mr-4">
          <span className="absolute right-0 top-0 aspect-square w-3 rounded-full bg-red-500" />
          <FaRegBell className="text-2xl hover:text-green-400 text-green-800 transition-colors" />
        </div>
        <div className="flex items-center justify-end">
          <CartSideBar />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <ButtonCircle3
                  className="overflow-hidden hover:ring-2 transition-all"
                  size="w-10 h-10"
                >
                  <Image
                    src={avatar}
                    alt="User Avatar"
                    className="object-cover w-full h-full"
                  />
                </ButtonCircle3>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>{userData.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenModal()} className="flex items-center gap-2">
                  <FaRegUser className="text-gray-600" /> View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/cart")} className="flex items-center gap-2">
                  <FaShoppingCart className="text-gray-600" /> My Cart
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/orders")} className="flex items-center gap-2">
                  <FaClipboardList className="text-gray-600" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-300 focus:bg-red-300 focus:text-white"
                >
                  <FaSignOutAlt /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition-colors"
            >
              Login
            </Button>
          )}
        </div>
      </div>
      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogOut}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UserProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userData={userData}
        onSave={handleSaveUser}
      />
    </header>
  );
};

export default MainNav;
