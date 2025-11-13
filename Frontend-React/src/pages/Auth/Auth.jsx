/* eslint-disable no-unused-vars */
import "./Auth.css";
import { Button } from "@/components/ui/button";

import SignupForm from "./signup/SignupForm";
import LoginForm from "./login/login";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import ForgotPassword from "./ForgotPassword";
import ForgotPasswordForm from "./ForgotPassword";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import CustomeToast from "@/components/custome/CustomeToast";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useSelector((store) => store);
  const { toast } = useToast();

  const [animate, setAnimate] = useState(false);

  const handleNavigation = (path) => {
    // setAnimate(true);
    // setTimeout(() => {
    navigate(path);
    //   setAnimate(false);
    // }, 500);
    // Adjust the delay as needed to match your animation duration
    // setAnimate(false)
  };

  const [showToast, setShowToast] = useState(false);

  const handleShowToast = () => {
    setShowToast(true);
  };

  console.log("---------- ", auth.error);

  return (
    <div className={`authContainer h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>
      
      {/* Overlay for better contrast */}
      <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/30"></div>

      <div
        className={`bgBlure absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 box flex flex-col justify-center items-center h-[90vh] w-[95vw] max-w-md max-h-[40rem] rounded-2xl z-50 bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 mx-4`}
      >
        <CustomeToast show={auth.error} message={auth.error?.error} />

        <div className="text-center mb-6 px-4">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            CryptoTradeX
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm mt-2">Your Gateway to Crypto Trading</p>
        </div>
        {/* <Avatar>
          <AvatarImage src="https://cdn.pixabay.com/photo/2019/04/15/20/42/bitcoin-4130299_1280.png"/>
          <AvatarFallback>BTC</AvatarFallback>
        </Avatar> */}

        {location.pathname == "/signup" ? (
          <section
            className={`w-full login  ${animate ? "slide-down" : "slide-up"}`}
          >
            <div className={`loginBox w-full px-6 sm:px-10 space-y-4 sm:space-y-5`}>
              <SignupForm />

              {location.pathname == "/signup" ? (
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="text-gray-200">Don't have an account?</span>
                    <Button
                      onClick={() => handleNavigation("/signin")}
                      variant="ghost"
                      className="text-blue-300 hover:text-blue-200 p-0 h-auto font-medium"
                    >
                      Sign In
                    </Button>
                  </div>
              ) : (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <span className="text-gray-200">Already have an account?</span>
                  <Button
                    onClick={() => handleNavigation("/signup")}
                    variant="ghost"
                    className="text-blue-300 hover:text-blue-200 p-0 h-auto font-medium"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </section>
        ) : location.pathname == "/forgot-password" ? (
          <section className="p-4 sm:p-5 w-full">
            <ForgotPasswordForm />
            {/* <Button variant="outline" className="w-full py-5 mt-5">
              Try Using Mobile Number
            </Button> */}
            <div className="flex items-center justify-center mt-5 space-x-2 text-sm">
              <span className="text-gray-200">Back to Login?</span>
              <Button 
                onClick={() => navigate("/signin")} 
                variant="ghost"
                className="text-blue-300 hover:text-blue-200 p-0 h-auto font-medium"
              >
                Sign In
              </Button>
            </div>
          </section>
        ) : (
          <>
            {
              <section className={`w-full login`}>
                <div className={`loginBox w-full px-6 sm:px-10 space-y-4 sm:space-y-5`}>
                  <LoginForm />

                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <span className="text-gray-200">Already have an account?</span>
                    <Button
                      onClick={() => handleNavigation("/signup")}
                      variant="ghost"
                      className="text-blue-300 hover:text-blue-200 p-0 h-auto font-medium"
                    >
                      Sign Up
                    </Button>
                  </div>
                  <div className="pt-2">
                    <Button
                      onClick={() => navigate("/forgot-password")}
                      variant="ghost"
                      className="w-full text-gray-200 hover:text-white text-sm py-2"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </div>
              </section>
            }
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
