"use client";

import { useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { validCurrencySymbols } from "~~/utils/scaffold-eth/currencySymbols";

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_API_KEY;

const Currency = () => {
  const [feedback, setFeedback] = useState("");

  const appCurrencySymbol = useGlobalState(state => state.appCurrencySymbol);
  const setAppCurrencySymbol = useGlobalState(state => state.setAppCurrencySymbol);
  const setAppCurrencyValue = useGlobalState(state => state.setAppCurrencyValue);

  const handleSubmit = async () => {
    if (!validCurrencySymbols.includes(appCurrencySymbol)) {
      setFeedback("Invalid Currency Symbol");
      return;
    }

    try {
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);

      if (!response.ok) {
        throw new Error("Network did not respond");
      }

      const data = await response.json();
      const newCurrencyValue = data.conversion_rates[appCurrencySymbol];

      setAppCurrencyValue(newCurrencyValue);
      setFeedback(`App currency has been changed to ${appCurrencySymbol}`);
    } catch (error) {
      console.error(error);
      setFeedback("Something went wrong, please try again");
    }
  };

  return (
    <>
      <div className="card w-96 bg-primary text-primary-content mt-4">
        <div className="card-title justify-center">
          <h1>Hello, World!</h1>
        </div>
        <div className="card-body">
          <div>
            <label className="p-5">Currency</label>
            <input type="text" value={appCurrencySymbol} onChange={e => setAppCurrencySymbol(e.target.value)} />
          </div>
          <button className="btn bg-secondary" onClick={handleSubmit}>
            Submit
          </button>
          {feedback && <p>{feedback}</p>}
        </div>
      </div>
    </>
  );
};

export default Currency;
