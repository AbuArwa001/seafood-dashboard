import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getExchangeRates, getCurrencies, getSpecificRate } from "../_services/exchangeRates";

export function useExchangeRatesLogic() {
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [amount, setAmount] = useState<string>("1.00");
  const [page, setPage] = useState(1);

  const { data: ratesData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["exchange-rates", page],
    queryFn: () => getExchangeRates(page),
  });

  const rates = ratesData?.results || [];
  const totalRates = ratesData?.count || 0;
  const hasNext = !!ratesData?.next;
  const hasPrev = !!ratesData?.previous;

  const { data: currenciesData } = useQuery({
    queryKey: ["currencies", "all"],
    queryFn: getCurrencies,
  });
  const currencies = currenciesData?.results || currenciesData || [];

  const fromCode = useMemo(() => currencies?.find((c: any) => c.id === fromCurrency)?.code, [currencies, fromCurrency]);
  const toCode = useMemo(() => currencies?.find((c: any) => c.id === toCurrency)?.code, [currencies, toCurrency]);

  const { data: specificRateData } = useQuery({
    queryKey: ["exchange-rate", fromCode, toCode],
    queryFn: () => getSpecificRate(fromCode!, toCode!),
    enabled: !!fromCode && !!toCode && fromCode !== toCode,
  });

  const { data: inverseRateData } = useQuery({
    queryKey: ["exchange-rate", toCode, fromCode],
    queryFn: () => getSpecificRate(toCode!, fromCode!),
    enabled: !!fromCode && !!toCode && fromCode !== toCode && (!specificRateData?.results || specificRateData.results.length === 0),
  });

  const selectedRate = useMemo(() => {
    if (!fromCurrency || !toCurrency) return null;
    if (fromCurrency === toCurrency) return { rate: "1.0000" };

    if (specificRateData?.results?.[0]) return specificRateData.results[0];
    if (inverseRateData?.results?.[0]) {
      const inverse = inverseRateData.results[0];
      return { ...inverse, rate: (1 / parseFloat(inverse.rate)).toFixed(6) };
    }

    if (!rates) return null;
    const direct = rates.find((r: any) => r.from_currency.id === fromCurrency && r.to_currency.id === toCurrency);
    if (direct) return direct;
    const inverse = rates.find((r: any) => r.from_currency.id === toCurrency && r.to_currency.id === fromCurrency);
    if (inverse) return { ...inverse, rate: (1 / parseFloat(inverse.rate)).toFixed(6) };

    return null;
  }, [fromCurrency, toCurrency, rates, specificRateData, inverseRateData]);

  return {
    fromCurrency, setFromCurrency,
    toCurrency, setToCurrency,
    amount, setAmount,
    page, setPage,
    rates, totalRates, hasNext, hasPrev,
    currencies, selectedRate,
    isLoading, isFetching, refetch
  };
}
