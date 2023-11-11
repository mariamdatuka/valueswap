export interface DataProps {
    id: string;
    symbol: string;
    name: string;
  }
export interface CoinData {
    image: {
      thumb: string;
    };
    market_data:CurrentPrice
  }
export interface CurrentPrice{
      current_price:{
        bnb:number;
      }
  }