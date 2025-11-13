    import React, { useEffect, useState } from "react";
    import AliceCarousel from "react-alice-carousel";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";

    /* Helper to format numbers with commas */
    const numberWithCommas = (x) => {
    if (x === undefined || x === null) return x;
    const parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
    };

    const Carousel = ({ currency = "usd", symbol = "$" }) => {
    const [coins, setCoins] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
        try {
            const res = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
            params: {
                vs_currency: currency,
                order: "market_cap_desc",
                per_page: 12,
                page: 1,
                sparkline: false,
            },
            });
            setCoins(res.data);
        } catch (err) {
            console.error("fetch coins error:", err);
        }
        };
        fetch();
    }, [currency]);

    const items = coins.map((coin) => {
        const profit = coin.price_change_percentage_24h >= 0;
        return (
        <div
            key={coin.id}
            onClick={() => navigate(`/market/${coin.id}`)}
            className="flex flex-col items-center uppercase text-white cursor-pointer p-3 select-none hover:opacity-80 transition-opacity"
        >
            <img src={coin.image} alt={coin.name} className="h-20 mb-2" />
            <span className="text-sm font-medium">
            {coin.symbol.toUpperCase()} &nbsp;
            <span className={`font-semibold ${profit ? "text-green-400" : "text-red-400"}`}>
                {profit && "+"}
                {coin.price_change_percentage_24h?.toFixed(2)}%
            </span>
            </span>
            <span className="text-lg font-bold mt-1">
            {symbol} {numberWithCommas((coin.current_price || 0).toFixed(2))}
            </span>
        </div>
        );
    });

    const responsive = {
        0: { items: 2 },
        512: { items: 4 },
        1024: { items: 6 },
    };

    return (
        <div className="w-full">
        <AliceCarousel
            mouseTracking
            infinite
            autoPlayInterval={1000}
            animationDuration={1000}
            disableDotsControls
            disableButtonsControls
            responsive={responsive}
            items={items}
            autoPlay
        />
        </div>
    );
    };

    export default Carousel;
