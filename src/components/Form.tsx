import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import bnbLogo from "../assets/bnb.svg";
import bnb from "../assets/bnb1.svg";
import arrow from "../assets/arrowdown.svg";
import axios from "axios";

interface DataProps {
  id: string;
  symbol: string;
  name: string;
}
interface CoinData {
  image: string;
}
const Form = () => {
  const [data, setData] = useState<DataProps[]>([]);
  const [coinDetails, setCoinDetails] = useState<CoinData>({
    image: "",
  });
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("Select");
  const toggleDropdownMenu = () => {
    setIsOpened(!isOpened);
  };

  const URL = "https://api.coingecko.com/api/v3/coins/";
  const fetchAllCoins = async () => {
    try {
      const response = await axios.get(`${URL}list`);
      setData(response.data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllCoins();
  }, []);

  const fetchCoinDetails = async (id: string) => {
    try {
      const response = await axios.get(`${URL}${id}`);
      setCoinDetails(response.data.image.thumb);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleSelectInput = (itm: string, id: string) => {
    setSelected(itm);
    setIsOpened(false);
    fetchCoinDetails(id);
  };
  return (
    <>
      <main className="flex flex-col items-center gap-6">
        <img src={logo} alt="logo" className="w-[30%] sm:w-1/2 h-auto" />
        <form className="w-80 sm:w-96">
          <div className="relative w-full mb-6">
            <input
              type="text"
              className="p-4 text-xl font-semibold w-full bg-[#0d0a10]"
              placeholder="0.00"
            />
            <div className="absolute flex gap-3 top-[30%] right-6">
              <img src={bnb} alt="bnblogo" />
              <img src={bnbLogo} alt="bnb" />
            </div>
          </div>
          <div className="relative p-4 text-xl font-semibold w-full bg-[#0d0a10] flex items-center justify-between">
            <p>0.00</p>
            <button
              className="flex items-center justify-center gap-2 pr-4"
              onClick={toggleDropdownMenu}
              type="button"
            >
              <p className="text-base">{selected}</p>
              {coinDetails.image !== "" ? (
                <p>bla</p>
              ) : (
                <img src={arrow} alt="arrow" />
              )}
            </button>
            {isOpened && (
              <div className="absolute top-20 right-[1px] flex flex-col gap-2 w-full h-[150px] overflow-y-auto p-4 bg-[#0d0a10]">
                {data?.map((itm, index) => (
                  <div
                    className="cursor-pointer hover:opacity-75"
                    onClick={() => handleSelectInput(itm.symbol, itm.id)}
                    key={index}
                  >
                    {itm.symbol}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
      </main>
    </>
  );
};

export default Form;
