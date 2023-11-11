import { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import bnbLogo from "../assets/bnb.svg";
import bnb from "../assets/bnb1.svg";
import arrow from "../assets/arrowdown.svg";
import axios from "axios";
import CustomConnectButton from "./CustomConnectButton";
import {DataProps, CoinData} from '../../type'


const Form = () => {
  const [data, setData] = useState<DataProps[]>([]);
  const [bnbValue, setBnbValue] = useState<string>("");
  const [parsedCrypto, setParsedCrypto] = useState<number|null>(null);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("Select");
  const [coinDetails, setCoinDetails] = useState<CoinData>({
    image: {
      thumb: "",
    },
    market_data:{
      current_price:{
        bnb:0
      }
    }
  });
  const toggleDropdownMenu = () => {
    setIsOpened(!isOpened);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setBnbValue(inputValue);
  }
  const calculateEquivalentValue=()=>{
    const parsedValue = parseFloat(bnbValue);
    const exchangeRate=coinDetails?.market_data?.current_price.bnb;
    const value=(parsedValue/exchangeRate).toFixed(4);
    const result=parseFloat(value);
    setParsedCrypto(result)
   }
   
  const URL = "https://api.coingecko.com/api/v3/coins/";

  const fetchAllCoins = async () => {
    try {
      const response = await axios.get(`${URL}list`);
      setData(response.data);
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
      const { image, market_data } = response.data;
      const { thumb } = image;
      const { bnb } = market_data.current_price;
      setCoinDetails(() => ({
        image: { thumb },
        market_data:{current_price:{bnb}}
      }));
    } catch (error) {
      console.error(error);
    }
  };
  const handleSelectInput = (itm: string, id: string) => {
    setSelected(itm);
    setIsOpened(false);
    fetchCoinDetails(id);
    calculateEquivalentValue();
  };
  return (
    <>
      <main className="flex flex-col items-center gap-6">
        <img src={logo} alt="logo" className="w-[30%] md:w-1/2 h-auto" />
        <form className="w-80 sm:w-96">
          <div className="relative w-full mb-6">
            <input
              value={bnbValue}
              onChange={handleInputChange}
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
            <p>{(parsedCrypto===null)?'0.00':parsedCrypto}</p>
            <button
              className="flex items-center justify-center gap-2 pr-4"
              onClick={toggleDropdownMenu}
              type="button"
            >
              <p className="text-base">{selected}</p>
              {coinDetails.image.thumb !== "" ? (
                <img src={coinDetails.image.thumb} alt="coinlogo" />
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
       <CustomConnectButton/>
      </main>
    </>
  );
};

export default Form;
