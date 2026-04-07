"use client";

import { motion } from "framer-motion";
import { useExchangeRatesLogic } from "./_hooks/useExchangeRatesLogic";
import { ExchangeRatesHeader } from "./_components/ExchangeRatesHeader";
import { ExchangeRatesConverter } from "./_components/ExchangeRatesConverter";
import { ExchangeRatesTable } from "./_components/ExchangeRatesTable";
import { ExchangeRatesInsight } from "./_components/ExchangeRatesInsight";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function ExchangeRatesPage() {
  const logic = useExchangeRatesLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-10 p-2">
      <ExchangeRatesHeader isFetching={logic.isFetching} refetch={logic.refetch} />

      <ExchangeRatesConverter
        amount={logic.amount} setAmount={logic.setAmount}
        fromCurrency={logic.fromCurrency} setFromCurrency={logic.setFromCurrency}
        toCurrency={logic.toCurrency} setToCurrency={logic.setToCurrency}
        currencies={logic.currencies} selectedRate={logic.selectedRate}
        itemVariants={item}
      />

      <ExchangeRatesTable
        totalRates={logic.totalRates} isLoading={logic.isLoading}
        rates={logic.rates} page={logic.page} setPage={logic.setPage}
        hasPrev={logic.hasPrev} hasNext={logic.hasNext}
        itemVariants={item}
      />

      <ExchangeRatesInsight itemVariants={item} />
    </motion.div>
  );
}
