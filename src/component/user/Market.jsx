import { popularCurrencies } from "../../constants/mockdata";
import CurrencyList from "./CurrencyList";
import { MarketHeader } from "./MarketHeader";

export function Market() {
  return (
    <div className="p-4 md:p-6">
      <MarketHeader />
      <CurrencyList currencies={popularCurrencies} />
    </div>
  );
}
