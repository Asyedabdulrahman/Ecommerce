"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "../hooks/useWixClient";
import Cookies from "js-cookie";
import { useCartStore } from "../hooks/useCartStore";

const NavIcons = () => {
  const [isProfileOpen, setisProfileOpen] = useState(false);
  const [CartOpen, setisCartOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const router = useRouter();
  const pathName = usePathname();

  const myWixClient = useWixClient();
  const wixclient = useWixClient();
  const isloggedin = wixclient.auth.loggedIn();

  const { getCart, counter } = useCartStore();

  // temporary
  // const isloggedin = false;

  const handleProfile = () => {
    if (!isloggedin) {
      router.push("/login");
    } else {
      setisProfileOpen((prev) => !prev);
    }
  };

  const toggleCart = () => {
    setisCartOpen((prev) => !prev);
    getCart(wixclient);
  };
  //AUTH WIX WIX MANAGED AUTH

  const login = async () => {
    const loginRequestData = myWixClient.auth.generateOAuthData(
      "http://localhost:3000"
    );
    console.log(loginRequestData);

    localStorage.setItem(
      "oAuthRedirectedData",
      JSON.stringify(loginRequestData)
    );
    const { authUrl } = await myWixClient.auth.getAuthUrl(loginRequestData);
    window.location.href = authUrl;
    // separate function
  };

  const LogoutwixClient = async () => {
    setisLoading(true);
    Cookies.remove("refreshToken");
    const { logoutUrl } = await myWixClient.auth.logout(window.location.href);
    setisLoading(false);
    setisProfileOpen(false);
    router.push("/");
    // router.push(logoutUrl);
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative ">
      <Image
        src="/profile.png"
        alt="userimage"
        width={22}
        height={22}
        className="cursor-pointer"
        onClick={handleProfile}
        // onClick={login}
      />
      {isProfileOpen && (
        <div className="absolute p-2 bg-white rounded-md top-12 left-0 text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
          {/* <Link href="/profiler">Profile</Link> */}
          <div className="mt-2 cursor-pointer" onClick={LogoutwixClient}>
            {isLoading ? "Logging out" : "Log out"}
          </div>
        </div>
      )}
      <Image
        src="/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div className="relative cursor-pointer" onClick={toggleCart}>
        <Image
          src="/cart.png"
          alt="jlhk"
          width={22}
          height={22}
          className="cursor-pointer "
        />
        <div className="absolute -top-4 -right-2.5 w-6 h-6 bg-lama rounded-full text-sm flex items-center justify-center text-white">
          {counter}
        </div>
      </div>
      {CartOpen && <CartModal />}
    </div>
  );
};

export default NavIcons;
