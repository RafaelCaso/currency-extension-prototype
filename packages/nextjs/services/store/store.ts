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
  appCurrencySymbol: string;
  setAppCurrencySymbol: (newCurrency: string) => void;
  appCurrencyValue: number;
  setAppCurrencyValue: (newValue: number) => void;
  conversionRates: { [symbol: string]: number };
  setConversionRates: (newRates: { [symbol: string]: number }) => void;
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
