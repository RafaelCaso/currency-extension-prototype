"use client";

import { useState } from "react";
import { useGlobalState } from "~~/services/store/store";
import { notification } from "~~/utils/scaffold-eth";
import { validCurrencySymbols } from "~~/utils/scaffold-eth/currencySymbols";

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_API_KEY;

const Currency = () => {
  const conversionRates = useGlobalState(state => state.conversionRates);
  const nextUpdate = useGlobalState(state => state.nextUpdate);
  const setConversionRates = useGlobalState(state => state.setConversionRates);
  const setNextUpdate = useGlobalState(state => state.setNextUpdate);
  const appCurrencySymbol = useGlobalState(state => state.appCurrencySymbol);
  const setAppCurrencySymbol = useGlobalState(state => state.setAppCurrencySymbol);
  const setAppCurrencyValue = useGlobalState(state => state.setAppCurrencyValue);

  const [inputValue, setInputValue] = useState(appCurrencySymbol);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Handle input change and update suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    setAppCurrencySymbol(value);

    // Filter suggestions based on input value
    if (value) {
      const filteredSuggestions = validCurrencySymbols.filter(symbol => symbol.includes(value));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    setInputValue("");
    setSuggestions([]);
    // validate input currency symbol before updating
    if (!validCurrencySymbols.includes(appCurrencySymbol)) {
      notification.error("Invalid currency symbol");
      return;
    }

    // get current Unix timestamp to check if API update required
    const now = Math.floor(Date.now() / 1000);
    // if this is the first time calling API, or if update is available, call API
    if (nextUpdate === null || nextUpdate < now) {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`);

        if (!response.ok) {
          notification.error("Failed to fetch conversion rates");
          throw new Error("Network did not respond");
        }

        const data = await response.json();
        setNextUpdate(data.time_next_update_unix);
        setConversionRates(data.conversion_rates);
        setAppCurrencyValue(data.conversion_rates[appCurrencySymbol]);
        notification.success(`Currency changed to ${appCurrencySymbol}`);
      } catch (error) {
        notification.error("Something went wrong, please try again");
        throw new Error("Failed to process API response");
      }
    }
    // if no update is available, use cached data
    else {
      setAppCurrencyValue(conversionRates[appCurrencySymbol]);
      notification.success(`Currency changed to ${appCurrencySymbol}`);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="card w-96 bg-primary text-primary-content mt-4">
          <div className="card-title justify-center pt-5">
            <h1>Select Currency Symbol</h1>
          </div>
          <div className="card-body">
            <div>
              <input type="text" value={inputValue} onChange={handleInputChange} />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map(symbol => (
                    <li
                      key={symbol}
                      onClick={() => {
                        setInputValue(symbol);
                        setAppCurrencySymbol(symbol);
                        setSuggestions([]);
                      }}
                      className="suggestion-item"
                    >
                      {symbol}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button className="btn bg-secondary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Currency;
