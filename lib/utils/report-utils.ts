import * as XLSX from "xlsx";
import { format, parseISO, isValid } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { REPORT_STYLES, TABLE_STYLES } from "./report-templates";

/**
 * Common field name mappings to shorter, professional header labels
 * to prevent column squashing in dense reports.
 */
const HEADER_MAP: Record<string, string> = {
  estimated_transit_days: "Est. Transit",
  actual_arrival_date: "Arrival Date",
  country_origin: "Origin",
  total_sale_amount: "Total Val",
  kg_purchased: "KG",
  kg_sold: "KG Sold",
  created_at: "Created",
  unit_price: "Price",
  selling_price: "Price",
  converted_amount: "Converted",
  entered_by: "User",
};

const getReadableHeader = (key: string): string => {
  if (HEADER_MAP[key]) return HEADER_MAP[key];
  return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

/**
 * Helper to flatten nested objects for report generation.
 * extracted logic to be shared between individual and executive reports.
 */
const flattenData = (data: any[], lookups?: any): any[] => {
  return data.map((item) => {
    const flatItem: any = {};
    Object.keys(item).forEach((key) => {
      let value = item[key];

      // 0. Use lookup map if available (for resolving UUIDs to codes)
      if (lookups && typeof value === "string") {
        if (key.toLowerCase().includes("currency") && lookups.currencies?.[value]) {
          value = lookups.currencies[value];
        } else if (key.toLowerCase().includes("shipment") && lookups.shipments?.[value]) {
          value = lookups.shipments[value];
        }
      }

      if (value instanceof Date) {
        flatItem[key] = format(value, "MMM dd, yyyy HH:mm");
      } else if (Array.isArray(value)) {
        // Summarize arrays (e.g., items in a shipment)
        if (value.length === 0) {
          flatItem[key] = "None";
        } else if (typeof value[0] === "object") {
          // Format based on known item structures
          flatItem[key] = value.map(i => {
            const name = i.product_details?.name || i.product?.name || i.name || "Item";
            const qty = i.quantity || "";
            const unit = i.unit?.code || i.unit || "";
            return qty ? `${name} (${qty}${unit})` : name;
          }).join(", ");
        } else {
          flatItem[key] = value.join(", ");
        }
      } else if (typeof value === "object" && value !== null) {
        // Check for common display properties in order of preference
        if ("code" in value && value.code) {
          flatItem[key] = value.code;
        } else if ("full_name" in value) {
          flatItem[key] = value.full_name;
        } else if ("name" in value) {
          flatItem[key] = value.name;
        } else if ("username" in value) {
          flatItem[key] = value.username;
        } else if ("email" in value) {
          flatItem[key] = value.email;
        } else if ("id" in value && typeof value.id === "string") {
          const id = value.id.trim();
          flatItem[key] = id.length > 8 ? `#${id.substring(0, 8)}` : id;
        } else {
          flatItem[key] = JSON.stringify(value);
        }
      } else if (typeof value === "string") {
        const valStr = value.trim();
        if (valStr.includes("-") && (valStr.includes("T") || valStr.length === 10)) {
          const date = parseISO(valStr);
          if (isValid(date)) {
            flatItem[key] = format(date, "MMM dd, yyyy HH:mm");
            return;
          }
        }

        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(valStr)) {
          flatItem[key] = `#${valStr.substring(0, 8)}`;
        } else {
          flatItem[key] = valStr;
        }
      } else {
        flatItem[key] = value;
      }
    });

    // Handle Redundancy: if both "currency" and "currency_code" exist, prefer "currency" if it's resolved
    if (flatItem.currency && flatItem.currency_code) {
      delete flatItem.currency_code;
    }

    return flatItem;
  });
};

/**
 * Generates and downloads a professional Excel report.
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

  // Auto-size columns
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
  lookups?: { currencies?: Record<string, string>; shipments?: Record<string, string> },
) => {
  const doc = new jsPDF();
  const flattenedData = flattenData(data, lookups);

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
    // Exclude IDs and large text fields from the table to keep it clean
    const excludeFields = ["id", "notes", "comments", "description", "remarks", "entered_by"];
    const tableData = flattenedData.map(row => {
      const filteredRow: any = {};
      Object.keys(row).forEach(key => {
        if (!excludeFields.includes(key.toLowerCase()) && !key.toLowerCase().endsWith("_id")) {
          filteredRow[key] = row[key];
        }
      });
      return filteredRow;
    });

    const headers = Object.keys(tableData[0]).map(getReadableHeader);
    const body = tableData.map(row => Object.values(row));

    autoTable(doc, {
      startY: 70,
      head: [headers],
      body: body as any[][],
      ...TABLE_STYLES,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        overflow: 'linebreak',
      },
      headStyles: {
        ...TABLE_STYLES.headStyles,
        fontSize: 8,
        fontStyle: 'bold',
      },
      columnStyles: {
        ...Object.keys(tableData[0]).reduce((acc: any, key, index) => {
          if (key.toLowerCase() === 'items') {
            acc[index] = { cellWidth: 'auto', minCellWidth: 40 };
          }
          return acc;
        }, {}),
      },
    });
  }

  // 5.5 Notes/Comments Section
  let currentY = (doc as any).lastAutoTable?.finalY || 70;
  const notes = data.map(item => item.notes || item.comments || item.description || item.remarks).filter(Boolean);

  if (notes.length > 0) {
    currentY += 15;
    if (currentY > 260) { doc.addPage(); currentY = 20; }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
    doc.text("COMMENTS / NOTES", 15, currentY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(REPORT_STYLES.colors.text[0], REPORT_STYLES.colors.text[1], REPORT_STYLES.colors.text[2]);

    // Show unique notes
    const uniqueNotes = Array.from(new Set(notes));
    uniqueNotes.forEach((note, index) => {
      const lines = doc.splitTextToSize(`• ${note}`, 180);
      doc.text(lines, 15, currentY + 7 + (index * 5));
      currentY += (lines.length * 5);
    });
  }

  // 6. Approval Section (Bottom)
  currentY += 25;
  if (currentY > 240) {
    doc.addPage();
    currentY = 30;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
  doc.text("APPROVAL & VERIFICATION", 15, currentY);

  const colWidth = 60;
  const startX = 15;
  const lineY = currentY + 15;

  doc.setDrawColor(REPORT_STYLES.colors.border[0], REPORT_STYLES.colors.border[1], REPORT_STYLES.colors.border[2]);

  // 1. Prepared By
  doc.line(startX, lineY, startX + colWidth - 5, lineY);
  doc.setFontSize(9);
  doc.text("PREPARED BY", startX, lineY + 5);
  doc.setFont("helvetica", "normal");
  doc.text(preparedBy, startX, lineY + 10);
  doc.text(format(new Date(), "PP"), startX, lineY + 15);

  // 2. Reviewed By
  doc.line(startX + colWidth, lineY, startX + (colWidth * 2) - 5, lineY);
  doc.setFont("helvetica", "bold");
  doc.text("REVIEWED BY", startX + colWidth, lineY + 5);
  doc.setFont("helvetica", "normal");
  doc.text("Project Manager / Lead", startX + colWidth, lineY + 10);
  doc.text("Date: ____/____/2026", startX + colWidth, lineY + 15);

  // 3. Approved By
  doc.line(startX + (colWidth * 2), lineY, startX + (colWidth * 3), lineY);
  doc.setFont("helvetica", "bold");
  doc.text("APPROVED BY", startX + (colWidth * 2), lineY + 5);
  doc.setFont("helvetica", "normal");
  doc.text("Director / CEO", startX + (colWidth * 2), lineY + 10);
  doc.text("Date: ____/____/2026", startX + (colWidth * 2), lineY + 15);

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
  lookups?: { currencies?: Record<string, string>; shipments?: Record<string, string> },
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

  // 1.5 Approval Section on Cover Page
  let currentY = (doc as any).lastAutoTable?.finalY + 25;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
  doc.text("EXECUTIVE APPROVAL", 15, currentY);

  const colWidth = 60;
  const startX = 15;
  const lineY = currentY + 15;

  doc.setDrawColor(REPORT_STYLES.colors.border[0], REPORT_STYLES.colors.border[1], REPORT_STYLES.colors.border[2]);

  // 1. Prepared By
  doc.line(startX, lineY, startX + colWidth - 5, lineY);
  doc.setFontSize(9);
  doc.text("PREPARED BY", startX, lineY + 5);
  doc.setFont("helvetica", "normal");
  doc.text(preparedBy, startX, lineY + 10);
  doc.text(format(new Date(), "PP"), startX, lineY + 15);

  // 2. Reviewed By
  doc.line(startX + colWidth, lineY, startX + (colWidth * 2) - 5, lineY);
  doc.setFont("helvetica", "bold");
  doc.text("REVIEWED BY", startX + colWidth, lineY + 5);
  doc.setFont("helvetica", "normal");
  doc.text("Board of Directors", startX + colWidth, lineY + 10);
  doc.text("Date: ____/____/2026", startX + colWidth, lineY + 15);

  // 3. Approved By
  doc.line(startX + (colWidth * 2), lineY, startX + (colWidth * 3), lineY);
  doc.setFont("helvetica", "bold");
  doc.text("APPROVED BY", startX + (colWidth * 2), lineY + 5);
  doc.setFont("helvetica", "normal");
  doc.text("CEO / Managing Director", startX + (colWidth * 2), lineY + 10);
  doc.text("Date: ____/____/2026", startX + (colWidth * 2), lineY + 15);

  // 2. Add Detailed Pages for each module
  reports.forEach((report) => {
    doc.addPage();
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(REPORT_STYLES.colors.primary[0], REPORT_STYLES.colors.primary[1], REPORT_STYLES.colors.primary[2]);
    doc.text(`${report.sheetName} Detailed Report`, 15, 20);

    const flattenedData = flattenData(report.data, lookups);
    if (flattenedData.length > 0) {
      // Exclude IDs and large text fields
      const excludeFields = ["id", "notes", "comments", "description", "remarks", "entered_by"];
      const tableData = flattenedData.map(row => {
        const filteredRow: any = {};
        Object.keys(row).forEach(key => {
          if (!excludeFields.includes(key.toLowerCase()) && !key.toLowerCase().endsWith("_id")) {
            filteredRow[key] = row[key];
          }
        });
        return filteredRow;
      });

      const headers = Object.keys(tableData[0]).map(getReadableHeader);
      const body = tableData.map(row => Object.values(row));

      autoTable(doc, {
        startY: 30,
        head: [headers],
        body: body as any[][],
        ...TABLE_STYLES,
        styles: {
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak',
        },
        headStyles: {
          ...TABLE_STYLES.headStyles,
          fontSize: 8,
        },
        columnStyles: {
          ...Object.keys(tableData[0]).reduce((acc: any, key, index) => {
            if (key.toLowerCase() === 'items') {
              acc[index] = { cellWidth: 'auto', minCellWidth: 40 };
            }
            return acc;
          }, {}),
        },
      });
    }
  });

  doc.save(`Executive_Business_Report_${format(new Date(), "yyyyMMdd_HHmm")}.pdf`);
};
