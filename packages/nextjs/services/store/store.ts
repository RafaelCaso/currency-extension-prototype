import create from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";

type GlobalState = {
  nativeCurrency: {
    price: number;
    isFetching: boolean;
  };
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
  setIsNativeCurrencyFetching: (newIsNativeCurrencyFetching: boolean) => void;
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;

  // 3 letter symbol denoting currency (USD, BGP, CNY etc.)
  appCurrencySymbol: string;
  setAppCurrencySymbol: (newCurrency: string) => void;
  // Conversion rate (USD to Selected Currency)
  appCurrencyValue: number;
  setAppCurrencyValue: (newValue: number) => void;
  // JSON of all conversion rates (Symbol/ConversionRate key/value pair)
  conversionRates: { [symbol: string]: number };
  setConversionRates: (newRates: { [symbol: string]: number }) => void;
  // Unix timestamp of when API will have new conversion rates
  nextUpdate: number | null;
  setNextUpdate: (newNextUpdate: number | null) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  nativeCurrency: {
    price: 0,
    isFetching: true,
  },
  setNativeCurrencyPrice: (newValue: number): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, price: newValue } })),
  setIsNativeCurrencyFetching: (newValue: boolean): void =>
    set(state => ({ nativeCurrency: { ...state.nativeCurrency, isFetching: newValue } })),
  targetNetwork: scaffoldConfig.targetNetworks[0],
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
  appCurrencySymbol: "USD",
  setAppCurrencySymbol: (newCurrencySymbol: string) => set(() => ({ appCurrencySymbol: newCurrencySymbol })),
  appCurrencyValue: 1,
  setAppCurrencyValue: (newValue: number) =>
    set(state => {
      const { nativeCurrency } = state;
      return {
        appCurrencyValue: newValue,
        nativeCurrency: {
          ...nativeCurrency,
          price: nativeCurrency.price * (newValue / (state.appCurrencyValue || 1)),
        },
      };
    }),
  conversionRates: {},
  setConversionRates: (newRates: { [symbol: string]: number }) => set(() => ({ conversionRates: newRates })),
  nextUpdate: null,
  setNextUpdate: (newNextUpdate: number | null) => set(() => ({ nextUpdate: newNextUpdate })),
}));
