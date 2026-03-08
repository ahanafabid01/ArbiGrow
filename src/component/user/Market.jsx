import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2 } from "lucide-react";
import CurrencyList from "./CurrencyList";
import { MarketHeader } from "./MarketHeader";

const PAIRS = [
  { pair: "BTCUSDT", symbol: "BTC", name: "Bitcoin" },
  { pair: "ETHUSDT", symbol: "ETH", name: "Ethereum" },
  { pair: "BNBUSDT", symbol: "BNB", name: "BNB" },
  { pair: "SOLUSDT", symbol: "SOL", name: "Solana" },
  { pair: "ARBUSDT", symbol: "ARB", name: "Arbitrum" },
  { pair: "XRPUSDT", symbol: "XRP", name: "XRP" },
  { pair: "DOGEUSDT", symbol: "DOGE", name: "Dogecoin" },
  { pair: "ADAUSDT", symbol: "ADA", name: "Cardano" },
  { pair: "AVAXUSDT", symbol: "AVAX", name: "Avalanche" },
  { pair: "DOTUSDT", symbol: "DOT", name: "Polkadot" },
  { pair: "LINKUSDT", symbol: "LINK", name: "Chainlink" },
  { pair: "LTCUSDT", symbol: "LTC", name: "Litecoin" },
  { pair: "UNIUSDT", symbol: "UNI", name: "Uniswap" },
  { pair: "ATOMUSDT", symbol: "ATOM", name: "Cosmos" },
  { pair: "TRXUSDT", symbol: "TRX", name: "TRON" },
  { pair: "XLMUSDT", symbol: "XLM", name: "Stellar" },
  { pair: "NEARUSDT", symbol: "NEAR", name: "NEAR Protocol" },
  { pair: "ALGOUSDT", symbol: "ALGO", name: "Algorand" },
  { pair: "ETCUSDT", symbol: "ETC", name: "Ethereum Classic" },
  { pair: "MATICUSDT", symbol: "MATIC", name: "Polygon" },
  // { pair: "SANDUSDT", symbol: "SAND", name: "The Sandbox" },
];

// CoinGecko CDN — reliable hotlinking for all coins
const COIN_ICONS = {
  BTC: "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
  ETH: "https://coin-images.coingecko.com/coins/images/279/large/ethereum.png",
  BNB: "https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
  SOL: "https://coin-images.coingecko.com/coins/images/4128/large/solana.png",
  XRP: "https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
  ARB: "https://assets.coingecko.com/coins/images/16547/standard/arb.jpg?1721358242",
  DOGE: "https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png",
  ADA: "https://coin-images.coingecko.com/coins/images/975/large/cardano.png",
  AVAX: "https://coin-images.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
  DOT: "https://coin-images.coingecko.com/coins/images/12171/large/polkadot.png",
  LINK: "https://coin-images.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
  LTC: "https://coin-images.coingecko.com/coins/images/2/large/litecoin.png",
  UNI: "https://coin-images.coingecko.com/coins/images/12504/large/uniswap-uni.png",
  ATOM: "https://coin-images.coingecko.com/coins/images/1481/large/cosmos_hub.png",
  TRX: "https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png",
  XLM: "https://coin-images.coingecko.com/coins/images/100/large/Stellar_symbol_black_RGB.png",
  NEAR: "https://coin-images.coingecko.com/coins/images/10365/large/near.jpg",
  ALGO: "https://assets.coingecko.com/coins/images/4380/standard/download.png?1696504978",
  ETC: "https://coin-images.coingecko.com/coins/images/453/large/ethereum-classic-logo.png",
  MATIC:
    "https://coin-images.coingecko.com/coins/images/4713/large/matic-token-icon.png",
};

const getCoinIcon = (symbol) => COIN_ICONS[symbol] ?? "";

const pairMeta = Object.fromEntries(PAIRS.map((p) => [p.pair, p]));

const REST_URL = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(
  JSON.stringify(PAIRS.map((p) => p.pair)),
)}`;

const WS_URL = `wss://stream.binance.com:9443/stream?streams=${PAIRS.map(
  (p) => `${p.pair.toLowerCase()}@ticker`,
).join("/")}`;

const mapTicker = (t) => {
  const s = t.s ?? t.symbol ?? "";
  const meta = pairMeta[s] ?? {
    pair: s,
    symbol: s.replace("USDT", ""),
    name: s,
  };
  return {
    id: meta.pair,
    symbol: meta.symbol,
    name: meta.name,
    image: getCoinIcon(meta.symbol),
    price: parseFloat(t.c ?? t.lastPrice ?? 0),
    change24h: parseFloat(t.P ?? t.priceChangePercent ?? 0),
    volume: parseFloat(t.q ?? t.quoteVolume ?? 0),
  };
};

export function Market() {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wsStatus, setWsStatus] = useState("connecting");
  const [lastUpdated, setLastUpdated] = useState(null);
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const connectWs = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close();
    }
    clearTimeout(reconnectRef.current);
    setWsStatus("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus("open");

    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        const data = msg.data ?? msg;
        if (!data?.s) return;
        const updated = mapTicker(data);
        setCurrencies((prev) => {
          const idx = prev.findIndex((c) => c.id === updated.id);
          if (idx === -1) return prev;
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            price: updated.price,
            change24h: updated.change24h,
            volume: updated.volume,
          };
          return next;
        });
        setLastUpdated(new Date());
      } catch (_) {}
    };

    ws.onerror = () => setWsStatus("error");
    ws.onclose = () => {
      setWsStatus("error");
      reconnectRef.current = setTimeout(connectWs, 5000);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        const res = await fetch(REST_URL);
        const data = await res.json();
        if (cancelled) return;
        setCurrencies(data.map(mapTicker).sort((a, b) => b.volume - a.volume));
        setLastUpdated(new Date());
      } catch (_) {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    init().then(() => {
      if (!cancelled) connectWs();
    });
    return () => {
      cancelled = true;
      clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.close();
      }
    };
  }, [connectWs]);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(REST_URL);
      const data = await res.json();
      setCurrencies(data.map(mapTicker).sort((a, b) => b.volume - a.volume));
      setLastUpdated(new Date());
    } catch (_) {
    } finally {
      setLoading(false);
    }
    connectWs();
  }, [connectWs]);

  return (
    <div className="p-4 md:p-6">
      <MarketHeader
        lastUpdated={lastUpdated}
        wsStatus={wsStatus}
        onRefresh={handleRefresh}
        loading={loading}
      />
      {loading && currencies.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-gray-400 text-sm">Connecting to Binance...</p>
        </div>
      ) : (
        <CurrencyList currencies={currencies} />
      )}
    </div>
  );
}
