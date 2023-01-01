const csv = require("csv-parser");
const fs = require("fs");
const axios = require("axios");

const key = "da696156fa81d32c1f32103d79b2036af9c80f732ce952ceeb1d8b00cfb06d65";

const stream = fs.createReadStream("transactions.csv").pipe(csv());

function getLatestPortfolioValueForAllTokens() {
  let BTCTotal = 0;
  let ETHTotal = 0;
  let XRPTotal = 0;

  stream
    .on("data", (data) => {
      if (data.token === "BTC" && data.transaction_type === "DEPOSIT") {
        BTCTotal += Number(data.amount);
      } else if (
        data.token === "BTC" &&
        data.transaction_type === "WITHDRAWAL"
      ) {
        BTCTotal -= Number(data.amount);
      } else if (data.token === "XRP" && data.transaction_type === "DEPOSIT") {
        XRPTotal += Number(data.amount);
      } else if (
        data.token === "XRP" &&
        data.transaction_type === "WITHDRAWAL"
      ) {
        XRPTotal -= Number(data.amount);
      } else if (data.token === "ETH" && data.transaction_type === "DEPOSIT") {
        ETHTotal += Number(data.amount);
      } else if (
        data.token === "ETH" &&
        data.transaction_type === "WITHDRAWAL"
      ) {
        ETHTotal -= Number(data.amount);
      }
    })
    .on("end", () => {
      const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,XRP&tsyms=USD&api_key=${key}`;
      axios({
        method: "GET",
        url,
      }).then((response) => {
        const body = response.data;
        const BTC = body["BTC"]["USD"] * BTCTotal;
        const ETH = body["ETH"]["USD"] * ETHTotal;
        const XRP = body["XRP"]["USD"] * XRPTotal;
        console.log(
          "BTC in USD: $" + BTC.toLocaleString(),
          "\nETH in USD: $" + ETH.toLocaleString(),
          "\nXRP in USD: $" + XRP.toLocaleString()
        );
      });
    });
}
function getLatestPortfolioValueForToken(token) {
  let total = 0;
  stream
    .on("data", (data) => {
      if (data.token === token && data.transaction_type === "DEPOSIT") {
        total += Number(data.amount);
      } else if (
        data.token === token &&
        data.transaction_type === "WITHDRAWAL"
      ) {
        total -= Number(data.amount);
      }
    })
    .on("end", () => {
      const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${token}&tsyms=USD&api_key=${key}`;
      axios({
        method: "GET",
        url,
      }).then((response) => {
        const body = response.data;
        const amountInUSD = body[token]["USD"] * total;
        console.log(`${token} in USD: $` + amountInUSD.toLocaleString());
      });
    });
}

function getPortfolioValueOfAllTokensOnDate(date) {
  const dateObj = new Date(date);
  let BTCTotal = 0;
  let ETHTotal = 0;
  let XRPTotal = 0;
  stream
    .on("data", (data) => {
      const allDates = new Date(data.timestamp * 1000);
      allDates.setHours(0, 0, 0, 0);
      if (
        data.token === "BTC" &&
        data.transaction_type === "DEPOSIT" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        BTCTotal += Number(data.amount);
      } else if (
        data.token === "BTC" &&
        data.transaction_type === "WITHDRAWAL" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        BTCTotal -= Number(data.amount);
      } else if (
        data.token === "XRP" &&
        data.transaction_type === "DEPOSIT" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        XRPTotal += Number(data.amount);
      } else if (
        data.token === "XRP" &&
        data.transaction_type === "WITHDRAWAL" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        XRPTotal -= Number(data.amount);
      } else if (
        data.token === "ETH" &&
        data.transaction_type === "DEPOSIT" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        ETHTotal += Number(data.amount);
      } else if (
        data.token === "ETH" &&
        data.transaction_type === "WITHDRAWAL" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        ETHTotal -= Number(data.amount);
      }
    })
    .on("end", () => {
      const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=1&toTs=${
        dateObj.valueOf() / 1000
      }&api_key=${key}`;
      axios({
        method: "GET",
        url,
      }).then((response) => {
        const body = response.data;
        console.log(
          `BTC in USD: $${(
            body.Data.Data[0].close * BTCTotal
          ).toLocaleString()}`
        );
      });
    })
    .on("end", () => {
      const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=ETH&tsym=USD&limit=1&toTs=${
        dateObj.valueOf() / 1000
      }&api_key=${key}`;
      axios({
        method: "GET",
        url,
      }).then((response) => {
        const body = response.data;
        console.log(
          `ETH in USD: $${(
            body.Data.Data[0].close * ETHTotal
          ).toLocaleString()}`
        );
      });
    })
    .on("end", () => {
      const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=XRP&tsym=USD&limit=1&toTs=${
        dateObj.valueOf() / 1000
      }&api_key=${key}`;
      axios({
        method: "GET",
        url,
      }).then((response) => {
        const body = response.data;
        console.log(
          `XRP in USD: $${(
            body.Data.Data[0].close * XRPTotal
          ).toLocaleString()}`
        );
      });
    });
}

function getPortfolioValueOfTokenOnDate(token, date) {
  const dateObj = new Date(date);
  let total = 0;
  stream
    .on("data", (data) => {
      const allDates = new Date(data.timestamp * 1000);
      allDates.setHours(0, 0, 0, 0);
      if (
        data.token === token &&
        data.transaction_type === "DEPOSIT" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        total += Number(data.amount);
      } else if (
        data.token === token &&
        data.transaction_type === "WITHDRAWAL" &&
        allDates.valueOf() === dateObj.valueOf()
      ) {
        total -= Number(data.amount);
      }
    })
    .on("end", () => {
      const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${token}&tsym=USD&limit=1&toTs=${
        dateObj.valueOf() / 1000
      }&api_key=${key}`;
      axios({
        method: "GET",
        url,
      }).then((response) => {
        const body = response.data;
        console.log(
          `${token} in USD: $${(
            body.Data.Data[0].close * total
          ).toLocaleString()}`
        );
      });
    });
}

getLatestPortfolioValueForAllTokens();
getLatestPortfolioValueForToken("BTC");
getLatestPortfolioValueForToken("ETH");
getLatestPortfolioValueForToken("XRP");
getPortfolioValueOfAllTokensOnDate("10/25/2019");
getPortfolioValueOfTokenOnDate("BTC", "10/25/2019");
getPortfolioValueOfTokenOnDate("ETH", "10/25/2019");
getPortfolioValueOfTokenOnDate("XRP", "10/25/2019");
