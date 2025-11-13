import React from "react";
import Carousel from "./Carousel";

const Banner = ({ currency = "usd", symbol = "$" }) => {
  return (
        <div
      className="bg-cover bg-center"
      style={{ backgroundImage: "url('/banner2.jpg')" }}
    >
      <div className="max-w-6xl mx-auto py-10 md:py-10 px-4">
        {/* Text Section */}
        <div className="text-center text-white mb-8">
          <h1   
            className="text-3xl md:text-5xl font-extrabold"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            CryptoTradeX
          </h1>
          <p className="text-gray-300 mt-3 text-sm md:text-base">
            Get all the info regarding your favorite crypto currency
          </p>
        </div>

        {/* Carousel Section */}
        <Carousel currency={currency} symbol={symbol} />
      </div>
    </div>
  );
};

export default Banner;
