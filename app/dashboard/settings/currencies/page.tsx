"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCurrenciesSettingsLogic } from "./_hooks/useCurrenciesSettingsLogic";
import { CurrenciesSettingsHeader } from "./_components/CurrenciesSettingsHeader";
import { CurrenciesTab } from "./_components/CurrenciesTab";
import { RatesTab } from "./_components/RatesTab";
import { MarginsTab } from "./_components/MarginsTab";
import { CurrenciesSettingsInsight } from "./_components/CurrenciesSettingsInsight";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CurrencyRatesSettings() {
  const logic = useCurrenciesSettingsLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
      <CurrenciesSettingsHeader
        activeTab={logic.activeTab}
        isAddModalOpen={logic.isAddModalOpen}
        handleOpenChange={logic.handleOpenChange}
        editingItem={logic.editingItem}
      />

      <Tabs defaultValue="currencies" onValueChange={logic.setActiveTab} className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1.5 rounded-[1.5rem] h-16 border border-slate-200/60 w-full sm:w-auto">
          <TabsTrigger value="currencies" className="rounded-lg px-8 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">CURRENCIES</TabsTrigger>
          <TabsTrigger value="rates" className="rounded-lg px-8 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">EXCHANGE RATES</TabsTrigger>
          <TabsTrigger value="margins" className="rounded-lg px-8 font-black text-sm data-[state=active]:bg-white data-[state=active]:shadow-lg active:scale-95 transition-all">MARGIN RULES</TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="currencies">
            <CurrenciesTab
              currencies={logic.currencies} loadingCurrencies={logic.loadingCurrencies}
              handleEdit={logic.handleEdit} deleteCurrencyMutation={logic.deleteCurrencyMutation}
              itemVariants={item}
            />
          </TabsContent>

          <TabsContent value="rates">
            <RatesTab rates={logic.rates} loadingRates={logic.loadingRates} itemVariants={item} />
          </TabsContent>

          <TabsContent value="margins">
            <MarginsTab
              margins={logic.margins} loadingMargins={logic.loadingMargins}
              handleEdit={logic.handleEdit} deleteMarginMutation={logic.deleteMarginMutation}
              itemVariants={item}
            />
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <CurrenciesSettingsInsight itemVariants={item} />
    </motion.div>
  );
}
