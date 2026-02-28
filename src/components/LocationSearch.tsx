import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Location } from "../types";
import { RANCHI_BOUNDS, isWithinRanchi } from "../utils/ranchiBounds";
import { RANCHI_STOPS, type RanchiStop } from "../data/ranchiStops";
import { useApp } from "../context/AppContext";

interface LocationSearchProps {
  onSelect: (loc: Location) => void;
  placeholder?: string;
  initialValue?: string;
}

export default function LocationSearch({ onSelect, placeholder = "Search location...", initialValue = "" }: LocationSearchProps) {
  const { settings } = useApp();
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<Array<{ kind: "local"; stop: RanchiStop } | { kind: "nominatim"; place: any }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const latestQueryRef = useRef("");

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const viewbox = `${RANCHI_BOUNDS.west},${RANCHI_BOUNDS.north},${RANCHI_BOUNDS.east},${RANCHI_BOUNDS.south}`;

  const findLocalStops = (value: string): RanchiStop[] => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return RANCHI_STOPS
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 6);
  };

  const fetchNominatim = async (q: string) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=8&addressdetails=1&accept-language=en&countrycodes=in&viewbox=${encodeURIComponent(viewbox)}&bounded=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return Array.isArray(data)
      ? data.filter((p: any) => isWithinRanchi(parseFloat(p.lat), parseFloat(p.lon)))
      : [];
  };

  const searchLocation = async (value: string) => {
    setQuery(value);
    latestQueryRef.current = value;
    
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    const localStops = findLocalStops(value);
    const localResults = localStops.map((stop) => ({ kind: "local" as const, stop }));

    if (value.trim().length < 3) {
      setIsLoading(false);
      setResults(localResults);
      setShowResults(localResults.length > 0);
      return;
    }

    setResults(localResults);
    setShowResults(true);
    setIsLoading(true);

    searchTimeout.current = setTimeout(async () => {
      try {
        if (latestQueryRef.current !== value) return;
        const places = await fetchNominatim(value);
        if (latestQueryRef.current !== value) return;
        const nominatimResults = places.map((place: any) => ({ kind: "nominatim" as const, place }));
        setResults([...localResults, ...nominatimResults]);
        setShowResults(true);
      } catch (error) {
        console.error("Nominatim search error:", error);
        setResults(localResults);
      } finally {
        if (latestQueryRef.current === value) setIsLoading(false);
      }
    }, 450);
  };

  const handleSelect = async (item: { kind: "local"; stop: RanchiStop } | { kind: "nominatim"; place: any }) => {
    try {
      if (item.kind === "local") {
        const q = item.stop.query || item.stop.name;
        const places = await fetchNominatim(q);
        const best = places[0];
        if (!best) return;
        const lat = parseFloat(best.lat);
        const lng = parseFloat(best.lon);
        if (!isWithinRanchi(lat, lng)) return;

        const loc: Location = {
          name: item.stop.name,
          lat,
          lng,
          coordinates: [lng, lat],
        };
        onSelect(loc);
        setResults([]);
        setShowResults(false);
        setQuery(item.stop.name);
        return;
      }

      const place = item.place;
      const lat = parseFloat(place.lat);
      const lng = parseFloat(place.lon);
      if (!isWithinRanchi(lat, lng)) {
        setResults([]);
        setShowResults(false);
        return;
      }
      const loc: Location = {
        name: place.display_name,
        lat,
        lng,
        coordinates: [lng, lat],
      };
      onSelect(loc);
      setResults([]);
      setShowResults(false);
      setQuery(place.display_name);
    } catch (e) {
      console.error("Select location failed:", e);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          value={query}
          onChange={(e) => searchLocation(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          inputMode="search"
          enterKeyHint="search"
          className={`w-full pl-12 pr-10 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-sm text-base ${
            settings.darkMode ? "bg-slate-900 border border-slate-800 text-slate-100 placeholder:text-slate-500" : "bg-slate-50 border border-slate-100 text-slate-800 placeholder:text-slate-400"
          }`}
          onFocus={() => setShowResults(results.length > 0 || query.trim().length >= 3)}
        />
        {query && (
          <button 
            onClick={() => { setQuery(""); setResults([]); setShowResults(false); }}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors ${
              settings.darkMode ? "hover:bg-slate-800" : "hover:bg-slate-200"
            }`}
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showResults && (results.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute z-[6000] left-0 right-0 mt-2 rounded-2xl shadow-xl overflow-hidden max-h-64 overflow-y-auto border ${
              settings.darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-100"
            }`}
          >
            {isLoading ? (
              <div className="p-4 flex items-center justify-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm font-medium">Searching...</span>
              </div>
            ) : (
              results.map((item) => {
                const key = item.kind === "local" ? `local-${item.stop.id}` : `osm-${item.place.place_id}`;
                const label = item.kind === "local" ? item.stop.name : item.place.display_name;
                return (
                  <button
                    key={key}
                    onClick={() => void handleSelect(item)}
                    className={`w-full text-left p-4 flex items-start gap-3 last:border-0 transition-colors border-b ${
                      settings.darkMode ? "border-slate-900 hover:bg-slate-900/60" : "border-slate-50 hover:bg-slate-50"
                    }`}
                  >
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className={`text-sm font-medium line-clamp-2 ${settings.darkMode ? "text-slate-200" : "text-slate-700"}`}>
                      {label}
                      {item.kind === "local" && (
                        <span className={`ml-2 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/15 ${
                          settings.darkMode ? "text-emerald-300" : "text-emerald-600"
                        }`}>
                          Ranchi
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
