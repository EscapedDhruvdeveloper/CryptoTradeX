/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { AssetTable } from "./AssetTable";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
} from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useRef } from "react";
import {
  fetchCoinDetails,
  fetchCoinList,
  fetchTreadingCoinList,
  getTop50CoinList,
} from "@/Redux/Coin/Action";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop"; 
import Banner from "../../components/Banner/Banner";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "@/Redux/Chat/Action";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");
  const { coin, auth, chatBot } = useSelector((store) => store);
  const [isBotRelease, setIsBotRelease] = useState(false);

  useEffect(() => {
    dispatch(fetchCoinList(page));
  }, [page]);

  useEffect(() => {
    if (category === "top50") {
      dispatch(getTop50CoinList());
    } else if (category === "trading") {
      dispatch(fetchTreadingCoinList());
    }
  }, [category]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleCoinClick = (coinId) => {
    navigate(`/coin/${coinId}`);
  };


  const handleBotRelease = () => setIsBotRelease(!isBotRelease);

  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("Enter key pressed:", inputValue);
      dispatch(
        sendMessage({
          prompt: inputValue,
          jwt: auth.jwt || localStorage.getItem("jwt"),
        })
      );
      setInputValue("");
    }
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatBot.messages]);

  if (coin.loading) {
    return <SpinnerBackdrop />;
  }
  
  return (
    <div className="relative">
      {/* Banner */}
      <div className="bg-gray-900">
        <Banner />
      </div>

      {/* Coin list */}
      <div className="p-3">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant={category === "all" ? "default" : "outline"}
            onClick={() => setCategory("all")}
            className="rounded-full"
          >
            All
          </Button>
          <Button
            variant={category === "top50" ? "default" : "outline"}
            onClick={() => setCategory("top50")}
            className="rounded-full"
          >
            Top 50
          </Button>
        </div>

        <AssetTable
          category={category}
          coins={category === "all" ? coin.coinList : coin.top50}
          onRowClick={handleCoinClick} // pass click handler
        />

        {category === "all" && (
          <Pagination className="border-t py-3">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={page === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(2)}
                  isActive={page === 2}
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(3)}
                  isActive={page === 3}
                >
                  3
                </PaginationLink>
              </PaginationItem>
              {page > 3 && (
                <PaginationItem>
                  <PaginationLink isActive>{page}</PaginationLink>
                </PaginationItem>
              )}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  className="cursor-pointer"
                  onClick={() => handlePageChange(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <section className="absolute bottom-5 right-5 z-40 flex flex-col justify-end items-end gap-2">
        {isBotRelease && (
          <div className="rounded-md w-[20rem]  md:w-[25rem] lg:w-[25rem] h-[70vh] bg-slate-900">
            <div className="flex justify-between items-center border-b px-6 h-[12%]">
              <p>Chat Bot</p>
              <Button onClick={handleBotRelease} size="icon" variant="ghost">
                <Cross1Icon />
              </Button>
            </div>

            <div className="h-[76%]  flex flex-col overflow-y-auto  gap-5 px-5 py-2 scroll-container">
            <div
                 
                  
                  className={`${ "self-start"
                  } pb-5 w-auto`}
                >
                  <div className="justify-end self-end px-5 py-2 rounded-md bg-slate-800 w-auto">
                      {`hi, ${auth.user?.fullName}`}
                      <p>you can ask crypto related any question</p>
                      <p>like, price, market cap extra...</p>
                    </div>
                  
                </div>
              {chatBot.messages.map((item, index) => (
                <div
                  ref={chatContainerRef}
                  key={index}
                  className={`${
                    item.role == "user" ? "self-end" : "self-start"
                  } pb-5 w-auto`}
                >
                 
                  {item.role == "user" ? (
                    <div className="justify-end self-end px-5 py-2 rounded-full bg-slate-800 w-auto">
                      {item.prompt}
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="bg-slate-700 flex gap-2 py-4 px-4 rounded-md min-w-[15rem] w-full">
                        <p className="">{item.ans}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {chatBot.loading && <p>fetchin data...</p>}
            </div>

            <div className="h-[12%] border-t">
              <Input
                className="w-full h-full border-none outline-none"
                placeholder="write prompt"
                onChange={handleChange}
                value={inputValue}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>
        )}
        <div
          onClick={handleBotRelease}
          className="relative w-[10rem] cursor-pointer group"
        >
          <Button  className="w-full h-[3rem] gap-2 items-center">
            
            <MessageCircle
            fill=""
            className="fill-[#1e293b] -rotate-[90deg] stroke-none group-hover:fill-[#1a1a1a] "
            size={30}
          />
          
          <span className=" text-2xl">
            Chat Bot
          </span>
          </Button>
          
        </div>
      </section>
    </div>
  );
};

export default Home;
