import { useMemo, useState } from "react";

export function useDashboardCharts({ sales, shipments, timeRange }: any) {
  const [visibleSeries, setVisibleSeries] = useState({
    shipments: true,
    sales: true,
  });

  const salesChartData = useMemo(() => {
    if (!sales) return [0, 0, 0, 0, 0, 0, 0];
    const last7 = sales.slice(-7).map((s: any) => parseFloat(s.total_sale_amount || 0));
    while (last7.length < 7) last7.unshift(0);
    return last7;
  }, [sales]);

  const shipmentChartData = useMemo(() => {
    if (!shipments) return [0, 0, 0, 0, 0, 0, 0];
    return shipments.slice(-7).map((s: any) => s.items?.length || 0);
  }, [shipments]);

  const chartData = useMemo(() => {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
    if (timeRange === "30D") {
      months = ["Week 1", "Week 2", "Week 3", "Week 4"];
    } else if (timeRange === "6M") {
      months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    }

    return months.map((month, i) => ({
      month,
      shipments: visibleSeries.shipments
        ? (shipmentChartData[i] || 0) * (timeRange === "30D" ? 5 : 10)
        : 0,
      sales: visibleSeries.sales
        ? (salesChartData[i] || 0) / (timeRange === "30D" ? 500 : 1000)
        : 0,
    }));
  }, [salesChartData, shipmentChartData, timeRange, visibleSeries]);

  const toggleSeries = (entry: any) => {
    const { dataKey } = entry;
    setVisibleSeries((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof typeof prev],
    }));
  };

  return { salesChartData, shipmentChartData, chartData, visibleSeries, toggleSeries };
}
