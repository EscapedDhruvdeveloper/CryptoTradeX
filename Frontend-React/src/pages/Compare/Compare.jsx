import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import allCoinsData from "@/data/data.js";

const timePeriods = [
  { label: "7 Days", value: 7 },
  { label: "30 Days", value: 30 },
  { label: "60 Days", value: 60 },
  { label: "90 Days", value: 90 },
  { label: "120 Days", value: 120 },
  { label: "1 Year", value: 365 },
];

const chartTabs = ["PRICES", "MARKET CAP", "TOTAL VOLUME"];

// Generate synthetic chart data based on current price
const generateChartData = (coin, days) => {
  const currentPrice = coin.current_price || 0;
  const currentMarketCap = coin.market_cap || 0;
  const currentVolume = coin.total_volume || 0;
  const priceChange = coin.price_change_percentage_24h || 0;
  
  const dataPoints = days === 7 ? 7 : days === 30 ? 30 : days === 60 ? 60 : days === 90 ? 90 : days === 120 ? 120 : 365;
  const prices = [];
  const marketCaps = [];
  const volumes = [];
  
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  // Calculate starting price (going backwards, so start should be lower if price increased)
  const totalChange = (priceChange / 100) * (days / 30); // Scale change over the period
  const startPrice = currentPrice / (1 + totalChange);
  
  // Generate data points going backwards from now with smooth trend
  for (let i = dataPoints - 1; i >= 0; i--) {
    const timestamp = now - (i * oneDayMs);
    
    // Smooth progression from start to current price
    const progress = i / dataPoints;
    const basePrice = startPrice + (currentPrice - startPrice) * (1 - progress);
    
    // Add some realistic daily variation (±2-3%)
    const dailyVariation = (Math.random() - 0.5) * 0.04;
    const price = Math.max(0.01, basePrice * (1 + dailyVariation));
    
    // Market cap scales with price
    const marketCap = currentMarketCap * (price / currentPrice);
    
    // Volume has independent variation (±15%)
    const volumeVariation = (Math.random() - 0.5) * 0.3;
    const volume = Math.max(0, currentVolume * (1 + volumeVariation));
    
    prices.push([timestamp, price]);
    marketCaps.push([timestamp, marketCap]);
    volumes.push([timestamp, volume]);
  }
  
  return { prices, marketCaps, volumes };
};

const Compare = () => {
  const [allCoins, setAllCoins] = useState([]);
  const [crypto1, setCrypto1] = useState("bitcoin");
  const [crypto2, setCrypto2] = useState("ethereum");
  const [days, setDays] = useState(30);
  const [activeTab, setActiveTab] = useState("PRICES");
  const [loading, setLoading] = useState(false);
  const [coin1Data, setCoin1Data] = useState(null);
  const [coin2Data, setCoin2Data] = useState(null);
  const [chartData, setChartData] = useState({ prices: [], marketCaps: [], volumes: [] });

  // Load coins from local data
  useEffect(() => {
    if (allCoinsData && allCoinsData.length > 0) {
      console.log("Loading coins from local data:", allCoinsData.length);
      setAllCoins(allCoinsData);
      // Set default coins if not already set
      if (allCoinsData.length >= 2 && !crypto1 && !crypto2) {
        setCrypto1(allCoinsData[0].id);
        setCrypto2(allCoinsData[1].id);
      }
    }
  }, []);

  // Load coin data and generate chart data from local data
  useEffect(() => {
    if (!crypto1 || !crypto2 || !allCoinsData || allCoinsData.length === 0) return;
    
    setLoading(true);
    
    try {
      // Find coins from local data
      const coin1 = allCoinsData.find((coin) => coin.id === crypto1);
      const coin2 = allCoinsData.find((coin) => coin.id === crypto2);
      
      if (!coin1 || !coin2) {
        console.error("Coin not found in local data");
        setLoading(false);
        return;
      }
      
      // Format coin data to match expected structure
      const formattedCoin1 = {
        id: coin1.id,
        symbol: coin1.symbol,
        name: coin1.name,
        image: { small: coin1.image },
        market_data: {
          current_price: { usd: coin1.current_price },
          price_change_percentage_24h: coin1.price_change_percentage_24h,
          total_volume: { usd: coin1.total_volume },
          market_cap: { usd: coin1.market_cap },
        },
      };
      
      const formattedCoin2 = {
        id: coin2.id,
        symbol: coin2.symbol,
        name: coin2.name,
        image: { small: coin2.image },
        market_data: {
          current_price: { usd: coin2.current_price },
          price_change_percentage_24h: coin2.price_change_percentage_24h,
          total_volume: { usd: coin2.total_volume },
          market_cap: { usd: coin2.market_cap },
        },
      };
      
      setCoin1Data(formattedCoin1);
      setCoin2Data(formattedCoin2);
      
      // Generate chart data
      const chart1Data = generateChartData(coin1, days);
      const chart2Data = generateChartData(coin2, days);
      
      setChartData({
        prices: [chart1Data.prices, chart2Data.prices],
        marketCaps: [chart1Data.marketCaps, chart2Data.marketCaps],
        volumes: [chart1Data.volumes, chart2Data.volumes],
      });
      
      console.log("Data loaded successfully for", coin1.name, "and", coin2.name);
    } catch (error) {
      console.error("Error loading coin data:", error);
    } finally {
      setLoading(false);
    }
  }, [crypto1, crypto2, days]);

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatLargeNumber = (num) => {
    return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const getPriceChange = (coinData) => {
    if (!coinData?.market_data?.price_change_percentage_24h) return 0;
    return coinData.market_data.price_change_percentage_24h;
  };

  const getCurrentPrice = (coinData) => {
    return coinData?.market_data?.current_price?.usd || 0;
  };

  const getVolume = (coinData) => {
    return coinData?.market_data?.total_volume?.usd || 0;
  };

  const getMarketCap = (coinData) => {
    return coinData?.market_data?.market_cap?.usd || 0;
  };

  const getCoinImage = (coinData) => {
    return coinData?.image?.small || coinData?.image || "";
  };

  const getCoinSymbol = (coinData) => {
    return coinData?.symbol?.toUpperCase() || "";
  };

  const getCoinName = (coinData) => {
    return coinData?.name || "";
  };

  // Get selected coin display name for dropdowns
  const getSelectedCoinName = (coinId) => {
    if (!coinId) return "";
    const coin = allCoins.find((c) => c.id === coinId);
    return coin ? coin.name : coinId;
  };
  

  // Prepare chart series based on active tab
  const getChartSeries = () => {
    const coin1Name = coin1Data ? getCoinName(coin1Data) : "Crypto 1";
    const coin2Name = coin2Data ? getCoinName(coin2Data) : "Crypto 2";
    
    if (activeTab === "PRICES") {
      return [
        {
          name: coin1Name,
          data: chartData.prices[0] || [],
        },
        {
          name: coin2Name,
          data: chartData.prices[1] || [],
        },
      ];
    } else if (activeTab === "MARKET CAP") {
      return [
        {
          name: coin1Name,
          data: chartData.marketCaps[0] || [],
        },
        {
          name: coin2Name,
          data: chartData.marketCaps[1] || [],
        },
      ];
    } else {
      return [
        {
          name: coin1Name,
          data: chartData.volumes[0] || [],
        },
        {
          name: coin2Name,
          data: chartData.volumes[1] || [],
        },
      ];
    }
  };

  // Chart options - defined as a function to ensure it updates when coin data changes
  const getChartOptions = () => ({
    chart: {
      type: "line",
      height: 500,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: [
      {
        title: {
          text: coin1Data ? getCoinSymbol(coin1Data) : "Crypto 1",
        },
        labels: {
          formatter: (val) => formatNumber(val),
          style: {
            colors: "#3b82f6",
          },
        },
      },
      {
        opposite: true,
        title: {
          text: coin2Data ? getCoinSymbol(coin2Data) : "Crypto 2",
        },
        labels: {
          formatter: (val) => formatNumber(val),
          style: {
            colors: "#10b981",
          },
        },
      },
    ],
    colors: ["#3b82f6", "#10b981"],
    legend: {
      show: true,
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: {
        format: "dd MMM yyyy",
      },
      y: {
        formatter: (val) => formatNumber(val),
      },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
    },
  });

  // Don't block the entire page - show content even while loading

  const priceChange1 = coin1Data ? getPriceChange(coin1Data) : 0;
  const priceChange2 = coin2Data ? getPriceChange(coin2Data) : 0;
  const isPositive1 = priceChange1 >= 0;
  const isPositive2 = priceChange2 >= 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with dropdowns */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2 text-gray-300">Crypto 1</label>
            <Select value={crypto1} onValueChange={(value) => setCrypto1(value)}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Crypto 1" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px] overflow-y-auto">
                {allCoins && allCoins.length > 0 ? (
                  allCoins
                    .filter((coin) => coin.id !== crypto2)
                    .map((coin) => (
                      <SelectItem key={coin.id} value={coin.id} className="text-white hover:bg-gray-700 cursor-pointer">
                        {coin.name || coin.id}
                      </SelectItem>
                    ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-gray-400">Loading coins...</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium mb-2 text-gray-300">Crypto 2</label>
            <Select value={crypto2} onValueChange={(value) => setCrypto2(value)}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Crypto 2" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 max-h-[300px] overflow-y-auto">
                {allCoins && allCoins.length > 0 ? (
                  allCoins
                    .filter((coin) => coin.id !== crypto1)
                    .map((coin) => (
                      <SelectItem key={coin.id} value={coin.id} className="text-white hover:bg-gray-700 cursor-pointer">
                        {coin.name || coin.id}
                      </SelectItem>
                    ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-gray-400">Loading coins...</div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium mb-2 text-gray-300">Time Period</label>
            <Select value={days.toString()} onValueChange={(val) => setDays(parseInt(val))}>
              <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {timePeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value.toString()} className="text-white hover:bg-gray-700">
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Coin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Crypto 1 Card */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            {loading && !coin1Data ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : coin1Data ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={getCoinImage(coin1Data)}
                      alt={getCoinName(coin1Data)}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{getCoinSymbol(coin1Data)}</h3>
                      <p className="text-sm text-gray-400">{getCoinName(coin1Data)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isPositive1 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {isPositive1 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {isPositive1 ? "+" : ""}
                        {priceChange1.toFixed(2)}%
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${isPositive1 ? "text-green-400" : "text-red-400"}`}>
                      {formatNumber(getCurrentPrice(coin1Data))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Volume</p>
                    <p className="text-lg font-semibold">{formatLargeNumber(getVolume(coin1Data))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Market Cap</p>
                    <p className="text-lg font-semibold">{formatLargeNumber(getMarketCap(coin1Data))}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Star className={`w-5 h-5 ${isPositive1 ? "text-green-400" : "text-red-400"}`} />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No data available</p>
              </div>
            )}
          </Card>

          {/* Crypto 2 Card */}
          <Card className="bg-gray-800 border-gray-700 p-6">
            {loading && !coin2Data ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : coin2Data ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={getCoinImage(coin2Data)}
                      alt={getCoinName(coin2Data)}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-bold">{getCoinSymbol(coin2Data)}</h3>
                      <p className="text-sm text-gray-400">{getCoinName(coin2Data)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isPositive2 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                      {isPositive2 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold">
                        {isPositive2 ? "+" : ""}
                        {priceChange2.toFixed(2)}%
                      </span>
                    </div>
                    <div className={`text-2xl font-bold ${isPositive2 ? "text-green-400" : "text-red-400"}`}>
                      {formatNumber(getCurrentPrice(coin2Data))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Volume</p>
                    <p className="text-lg font-semibold">{formatLargeNumber(getVolume(coin2Data))}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Market Cap</p>
                    <p className="text-lg font-semibold">{formatLargeNumber(getMarketCap(coin2Data))}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Star className={`w-5 h-5 ${isPositive2 ? "text-green-400" : "text-red-400"}`} />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p>No data available</p>
              </div>
            )}
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="bg-gray-800 border-gray-700 p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            {chartTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                onClick={() => setActiveTab(tab)}
                className={`rounded-none border-b-2 ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-400 bg-transparent"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-sm text-gray-300">
                {coin1Data ? getCoinName(coin1Data) : "Crypto 1"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-300">
                {coin2Data ? getCoinName(coin2Data) : "Crypto 2"}
              </span>
            </div>
          </div>

          {/* Chart */}
          {loading && (!chartData.prices[0]?.length || !chartData.prices[1]?.length) ? (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
          ) : (chartData.prices[0]?.length > 0 || chartData.prices[1]?.length > 0) ? (
            <ReactApexChart
              key={`${crypto1}-${crypto2}-${days}-${activeTab}`}
              options={getChartOptions()}
              series={getChartSeries()}
              type="line"
              height={500}
            />
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center text-gray-400">
                <p>No chart data available</p>
                <p className="text-sm mt-2">Please select coins to compare</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Compare;

