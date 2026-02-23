import * as XLSX from "xlsx";
import { format } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { REPORT_STYLES, TABLE_STYLES } from "./report-templates";

/**
 * Helper to flatten nested objects for report generation.
 * extracted logic to be shared between individual and executive reports.
 */
const flattenData = (data: any[]): any[] => {
  return data.map((item) => {
    const flatItem: any = {};
    Object.keys(item).forEach((key) => {
      const value = item[key];
      if (typeof value === "object" && value !== null) {
        // Check for common display properties in order of preference
        if ("full_name" in value) {
          flatItem[key] = value.full_name;
        } else if ("name" in value) {
          flatItem[key] = value.name;
        } else if ("code" in value) {
          flatItem[key] = value.code;
        } else if ("username" in value) {
          flatItem[key] = value.username;
        } else if ("email" in value) {
          flatItem[key] = value.email;
        } else {
          // Fallback to JSON string if no common display property exists
          flatItem[key] = JSON.stringify(value);
        }
      } else {
        flatItem[key] = value;
      }
    });
    return flatItem;
  });
};

/**
 * Generates and downloads a professional Excel report.
 * @param data Array of objects to be exported.
 * @param sheetName Name of the Excel sheet.
 * @param fileName Base name for the downloaded file.
 */
export const downloadIndividualReport = (
  data: any[],
  sheetName: string,
  fileName: string,
) => {
  const flattenedData = flattenData(data);
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Auto-size columns (rough implementation)
  const maxWidths = flattenedData.reduce((acc, row) => {
    Object.keys(row).forEach((key, i) => {
      const val = String(row[key] || "");
      acc[i] = Math.max(acc[i] || 0, val.length, key.length);
    });
    return acc;
  }, [] as number[]);

  worksheet["!cols"] = maxWidths.map((w: number) => ({ wch: w + 2 }));

  XLSX.writeFile(
    workbook,
    `${fileName}_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`,
  );
};

/**
 * Generates and downloads a professional PDF report.
 */
export const downloadProfessionalPDF = (
  data: any[],
  title: string,
  fileName: string,
  preparedBy: string = "System Administrator",
) => {
  const doc = new jsPDF();
  const flattenedData = flattenData(data);

  // 1. Header & Logo Placeholder
  // Since we don't have the real logo as a base64 yet, we use a placeholder or stylized text
  doc.setFillColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
  doc.rect(15, 10, 8, 8, "F");
  doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("apexsolutions", 25, 17);

  // 2. Report Title
  doc.setFontSize(24);
  doc.text(title.toUpperCase(), 15, 35);

  // 3. Metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Prepared by: ${preparedBy}`, 15, 45);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${format(new Date(), "MMMM dd, yyyy")}`, 15, 52);

  // 4. Section Heading
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Report Overview", 15, 65);

  // 5. Data Table
  if (flattenedData.length > 0) {
    const headers = Object.keys(flattenedData[0]).map(h =>
      h.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    const body = flattenedData.map(row => Object.values(row));

    autoTable(doc, {
      startY: 70,
      head: [headers],
      body: body as any[][],
      ...TABLE_STYLES,
    });
  }

  // 6. Approval Section (Bottom)
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  if (finalY < 250) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Approval", 15, finalY);

    doc.setDrawColor(REPORT_STYLES.colors.border[0], REPORT_STYLES.colors.border[1], REPORT_STYLES.colors.border[2]);
    doc.line(15, finalY + 15, 80, finalY + 15);
    doc.line(115, finalY + 15, 180, finalY + 15);

    doc.setFontSize(10);
    doc.text(preparedBy, 15, finalY + 22);
    doc.text("Operations Manager", 115, finalY + 22);

    doc.setFont("helvetica", "normal");
    doc.text(format(new Date(), "MMMM dd, yyyy"), 15, finalY + 28);
    doc.text(format(new Date(), "MMMM dd, yyyy"), 115, finalY + 28);
  }

  doc.save(`${fileName}_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
};

/**
 * Generates and downloads a multi-sheet integrated executive report.
 */
export const downloadExecutiveReport = (
  reports: { sheetName: string; data: any[] }[],
) => {
  const workbook = XLSX.utils.book_new();

  // 1. Executive Summary Sheet
  const executiveSummary = reports.reduce(
    (summary: any, report) => {
      if (report.sheetName === "Sales") {
        summary.totalRevenue = report.data.reduce(
          (sum, s) => sum + parseFloat(s.total_sale_amount || 0),
          0,
        );
        summary.totalSalesCount = report.data.length;
      } else if (report.sheetName === "Shipments") {
        summary.activeShipments = report.data.filter(
          (s) => s.status !== "COMPLETED",
        ).length;
        summary.totalShipments = report.data.length;
      } else if (report.sheetName === "Payments") {
        summary.totalPaid = report.data.reduce(
          (sum, p) => sum + parseFloat(p.amount_paid || 0),
          0,
        );
        summary.pendingAmount = report.data.reduce(
          (sum, p) =>
            sum +
            (parseFloat(p.sale?.total_sale_amount || 0) -
              parseFloat(p.amount_paid || 0)),
          0,
        );
      }
      return summary;
    },
    {
      totalRevenue: 0,
      totalSalesCount: 0,
      activeShipments: 0,
      totalShipments: 0,
      totalPaid: 0,
      pendingAmount: 0,
    },
  );

  const summaryData = [
    ["EXECUTIVE BUSINESS SUMMARY", ""],
    ["Report Date", format(new Date(), "PPP HH:mm")],
    ["", ""],
    ["FINANCIAL PERFORMANCE", ""],
    ["Total Revenue", `$${executiveSummary.totalRevenue.toLocaleString()}`],
    ["Total Collected", `$${executiveSummary.totalPaid.toLocaleString()}`],
    [
      "Total Pending Payments",
      `$${executiveSummary.pendingAmount.toLocaleString()}`,
    ],
    ["", ""],
    ["OPERATIONAL STATUS", ""],
    ["Total Shipments", executiveSummary.totalShipments],
    ["Active Deployments", executiveSummary.activeShipments],
    ["Total Sales Recorded", executiveSummary.totalSalesCount],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Executive Summary");

  // 2. Data Sheets
  reports.forEach((report) => {
    // Use shared flattening logic
    const flattenedData = flattenData(report.data);
    const ws = XLSX.utils.json_to_sheet(flattenedData);
    XLSX.utils.book_append_sheet(workbook, ws, report.sheetName);
  });

  XLSX.writeFile(
    workbook,
    `Executive_Business_Report_${format(new Date(), "yyyyMMdd_HHmm")}.xlsx`,
  );
};

/**
 * Generates and downloads a professional Executive PDF report.
 */
export const downloadExecutivePDF = (
  reports: { sheetName: string; data: any[] }[],
  preparedBy: string = "System Administrator",
) => {
  const doc = new jsPDF();

  // 1. Cover Page / Summary
  doc.setFillColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
  doc.rect(15, 10, 8, 8, "F");
  doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("apexsolutions", 25, 17);

  doc.setFontSize(28);
  doc.text("EXECUTIVE BUSINESS REPORT", 15, 40);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${format(new Date(), "PPP HH:mm")}`, 15, 50);
  doc.text(`Prepared by: ${preparedBy}`, 15, 57);

  // Financial Highlights Section
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Financial Highlights", 15, 75);

  const executiveSummary = reports.reduce(
    (summary: any, report) => {
      if (report.sheetName === "Sales") {
        summary.totalRevenue = report.data.reduce(
          (sum, s) => sum + parseFloat(s.total_sale_amount || 0),
          0,
        );
      } else if (report.sheetName === "Payments") {
        summary.totalPaid = report.data.reduce(
          (sum, p) => sum + parseFloat(p.amount_paid || 0),
          0,
        );
      }
      return summary;
    },
    { totalRevenue: 0, totalPaid: 0 },
  );

  autoTable(doc, {
    startY: 80,
    head: [["Metric", "Value"]],
    body: [
      ["Total Revenue", `$${executiveSummary.totalRevenue.toLocaleString()}`],
      ["Total Collected", `$${executiveSummary.totalPaid.toLocaleString()}`],
      ["Outstanding Balance", `$${(executiveSummary.totalRevenue - executiveSummary.totalPaid).toLocaleString()}`],
    ],
    ...TABLE_STYLES,
    theme: 'grid',
  });

  // 2. Add Detailed Pages for each module
  reports.forEach((report) => {
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
    doc.text(`${report.sheetName} Detailed Report`, 15, 20);

    const flattenedData = flattenData(report.data);
    if (flattenedData.length > 0) {
      const headers = Object.keys(flattenedData[0]).map(h =>
        h.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      );
      const body = flattenedData.map(row => Object.values(row));

      autoTable(doc, {
        startY: 30,
        head: [headers],
        body: body as any[][],
        ...TABLE_STYLES,
      });
    }
  });

  doc.save(`Executive_Business_Report_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
};
