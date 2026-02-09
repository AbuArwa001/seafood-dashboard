import * as XLSX from "xlsx";
import { format } from "date-fns";

/**
 * Generates and downloads a professional Excel report.
 * @param data Array of objects to be exported.
 * @param sheetName Name of the Excel sheet.
 * @param fileName Base name for the downloaded file.
 */
export const downloadIndividualReport = (data: any[], sheetName: string, fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns (rough implementation)
  const maxWidths = data.reduce((acc, row) => {
    Object.keys(row).forEach((key, i) => {
      const val = String(row[key] || "");
      acc[i] = Math.max(acc[i] || 0, val.length, key.length);
    });
    return acc;
  }, [] as number[]);

  worksheet["!cols"] = maxWidths.map((w: number) => ({ wch: w + 2 }));

  XLSX.writeFile(workbook, `${fileName}_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`);
};

/**
 * Generates and downloads a multi-sheet integrated executive report.
 */
export const downloadExecutiveReport = (reports: { sheetName: string; data: any[] }[]) => {
  const workbook = XLSX.utils.book_new();

  // 1. Executive Summary Sheet
  const executiveSummary = reports.reduce((summary: any, report) => {
    if (report.sheetName === "Sales") {
      summary.totalRevenue = report.data.reduce((sum, s) => sum + parseFloat(s.total_sale_amount || 0), 0);
      summary.totalSalesCount = report.data.length;
    } else if (report.sheetName === "Shipments") {
      summary.activeShipments = report.data.filter(s => s.status !== "COMPLETED").length;
      summary.totalShipments = report.data.length;
    } else if (report.sheetName === "Payments") {
      summary.totalPaid = report.data.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0);
      summary.pendingAmount = report.data.reduce((sum, p) => sum + (parseFloat(p.sale?.total_sale_amount || 0) - parseFloat(p.amount_paid || 0)), 0);
    }
    return summary;
  }, { totalRevenue: 0, totalSalesCount: 0, activeShipments: 0, totalShipments: 0, totalPaid: 0, pendingAmount: 0 });

  const summaryData = [
    ["EXECUTIVE BUSINESS SUMMARY", ""],
    ["Report Date", format(new Date(), "PPP HH:mm")],
    ["", ""],
    ["FINANCIAL PERFORMANCE", ""],
    ["Total Revenue", `$${executiveSummary.totalRevenue.toLocaleString()}`],
    ["Total Collected", `$${executiveSummary.totalPaid.toLocaleString()}`],
    ["Total Pending Payments", `$${executiveSummary.pendingAmount.toLocaleString()}`],
    ["", ""],
    ["OPERATIONAL STATUS", ""],
    ["Total Shipments", executiveSummary.totalShipments],
    ["Active Deployments", executiveSummary.activeShipments],
    ["Total Sales Recorded", executiveSummary.totalSalesCount],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Executive Summary");

  // 2. Data Sheets
  reports.forEach(report => {
    // Basic mapping to flatten nested objects if needed
    const flattenedData = report.data.map(item => {
      const flatItem: any = {};
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'object' && item[key] !== null) {
          flatItem[key] = item[key].name || item[key].code || JSON.stringify(item[key]);
        } else {
          flatItem[key] = item[key];
        }
      });
      return flatItem;
    });

    const ws = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, ws, report.sheetName);
  });

  XLSX.writeFile(workbook, `Executive_Business_Report_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`);
};
