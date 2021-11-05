import axios from 'axios';


export const getPriceData = (days: number, interval: string = 'daily'): Promise<number[][]> => new Promise<number[][]>((resolve, reject) => {
  axios.get(`https://api.coingecko.com/api/v3/coins/bankless-bed-index/market_chart?vs_currency=usd&days=${days}&interval=${interval}`)
    .then(res => resolve(res.data.prices))
    .catch(err => reject(err));
});
