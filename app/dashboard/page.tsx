"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useDashboardLogic } from "./_hooks/useDashboardLogic";
import { DashboardHeader } from "./_components/DashboardHeader";
import { DashboardStats } from "./_components/DashboardStats";
import { PerformanceAnalytics } from "./_components/PerformanceAnalytics";
import { LiveFeed } from "./_components/LiveFeed";
import { CurrencyWatch } from "./_components/CurrencyWatch";
import { OperationalPulse } from "./_components/OperationalPulse";
import { QuickActions } from "./_components/QuickActions";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const router = useRouter();
  const logic = useDashboardLogic();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12 p-4 lg:p-8">
      <DashboardHeader
        sales={logic.sales} payments={logic.payments} products={logic.products} shipments={logic.shipments}
        isAddModalOpen={logic.isAddModalOpen} setIsAddModalOpen={logic.setIsAddModalOpen}
        canManageCatalog={logic.perms.canManageCatalog}
        handleExecutiveReport={logic.handleExecutiveReport} handleModuleReport={logic.handleModuleReport}
      />

      <DashboardStats stats={logic.stats} itemVariants={item} />

      <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
        {logic.perms.canViewSales && (
          <PerformanceAnalytics
            timeRange={logic.timeRange} setTimeRange={logic.setTimeRange}
            chartData={logic.chartData} visibleSeries={logic.visibleSeries} toggleSeries={logic.toggleSeries}
            itemVariants={item}
          />
        )}
        {logic.perms.canViewShipments && (
          <LiveFeed shipments={logic.shipments} isLoadingShipments={logic.loading.shipments} router={router} itemVariants={item} />
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
        {logic.perms.canViewExchangeRates && (
          <CurrencyWatch kshRates={logic.kshRates} itemVariants={item} />
        )}
        <OperationalPulse
          avgTransit={logic.avgTransit} complianceRate={logic.complianceRate}
          topRegion={logic.topRegion} itemVariants={item}
        />
      </div>

      <QuickActions
        user={logic.perms.user} isAdmin={logic.perms.isAdmin}
        canManageCatalog={logic.perms.canManageCatalog} itemVariants={item}
      />
    </motion.div>
  );
}
