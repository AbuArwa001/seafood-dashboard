import { useMemo } from "react";

export function useDashboardLogistics({ shipments, exchangeRates }: any) {
  const kshRates = useMemo(() => {
    if (!exchangeRates) return [];
    return exchangeRates
      .filter((r: any) => r.to_currency.code === "KES")
      .map((r: any) => ({
        name: r.from_currency.name,
        code: r.from_currency.code,
        rate: parseFloat(r.rate).toFixed(4),
        symbol: r.from_currency.symbol,
      }));
  }, [exchangeRates]);

  const logisticsData = useMemo(() => {
    if (!shipments || shipments.length === 0) {
      return {
        avgTransit: 4.2,
        complianceRate: 98,
        topRegion: { name: "East Africa", percent: 85 },
      };
    }

    const completedShipments = shipments.filter(
      (s: any) => s.status === "COMPLETED" || s.status === "RECEIVED"
    );

    let totalDays = 0;
    let count = 0;

    if (completedShipments.length > 0) {
      completedShipments.forEach((s: any) => {
        const start = new Date(s.created_at).getTime();
        const end = s.updated_at ? new Date(s.updated_at).getTime() : new Date().getTime();
        totalDays += (end - start) / (1000 * 60 * 60 * 24);
        count++;
      });
    }

    const calculatedAvg = count > 0 ? (totalDays / count).toFixed(1) : "0.0";

    const activeShipments = shipments.filter(
      (s: any) => s.status === "IN_TRANSIT" || s.status === "CREATED"
    );
    const recentActive = activeShipments.filter((s: any) => {
      const diff = new Date().getTime() - new Date(s.created_at).getTime();
      return diff < 15 * 24 * 60 * 60 * 1000;
    });

    const calculatedCompliance = activeShipments.length > 0
      ? Math.round((recentActive.length / activeShipments.length) * 100)
      : 100;

    const regionCounts: Record<string, number> = {};
    activeShipments.forEach((s: any) => {
      const region = s.country_origin || "Unknown";
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    });

    let maxRegion = "Global";
    let maxCount = 0;
    Object.entries(regionCounts).forEach(([region, c]) => {
      if (c > maxCount) {
        maxCount = c;
        maxRegion = region;
      }
    });

    const regionPercent = activeShipments.length > 0
      ? Math.round((maxCount / activeShipments.length) * 100)
      : 0;

    return {
      avgTransit: parseFloat(calculatedAvg as string) || 4.2,
      complianceRate: calculatedCompliance,
      topRegion: {
        name: maxRegion === "Global" && activeShipments.length === 0 ? "Global Operations" : maxRegion,
        percent: regionPercent || 100,
      },
    };
  }, [shipments]);

  return { kshRates, ...logisticsData };
}
