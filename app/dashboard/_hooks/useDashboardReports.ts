import { useMemo } from "react";
import { toast } from "sonner";
import {
  downloadIndividualReport,
  downloadProfessionalPDF,
  downloadExecutivePDF,
} from "@/lib/utils/report-utils";

export function useDashboardReports({ user, allCurrencies, shipments, sales, payments, products }: any) {
  const currenciesLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    allCurrencies?.forEach((c: any) => {
      lookup[c.id] = c.code;
    });
    return lookup;
  }, [allCurrencies]);

  const shipmentsLookup = useMemo(() => {
    const lookup: Record<string, string> = {};
    shipments?.forEach((s: any) => {
      lookup[s.id] = `#${s.id.substring(0, 8)}`;
    });
    return lookup;
  }, [shipments]);

  const handleExecutiveReport = () => {
    toast.promise(
      async () => {
        downloadExecutivePDF(
          [
            { sheetName: "Sales", data: sales || [] },
            { sheetName: "Shipments", data: shipments || [] },
            { sheetName: "Payments", data: payments || [] },
            { sheetName: "Products", data: products || [] },
          ],
          (user as any)?.full_name || (user as any)?.email,
          { currencies: currenciesLookup, shipments: shipmentsLookup }
        );
      },
      {
        loading: "Compiling professional executive report...",
        success: "Executive Business Report (PDF) generated successfully!",
        error: "Failed to generate report.",
      }
    );
  };

  const handleModuleReport = (type: string, data: any[], format: "pdf" | "excel" = "pdf") => {
    toast.message(`Generating ${type} ${format.toUpperCase()} report...`);
    if (format === "pdf") {
      downloadProfessionalPDF(
        data,
        `${type} Report`,
        `${type}_Report`,
        (user as any)?.full_name || (user as any)?.email,
        { currencies: currenciesLookup, shipments: shipmentsLookup }
      );
    } else {
      downloadIndividualReport(data, type, `${type}_Report`);
    }
  };

  return { handleExecutiveReport, handleModuleReport };
}
