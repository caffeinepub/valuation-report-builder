import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown, Printer } from "lucide-react";
import React from "react";
import type { VehicleReport } from "../types";
import { useSignatureSettings } from "../useSignatureSettings";
import { PrintPreview } from "./PrintPreview";

interface PreviewPageProps {
  report: VehicleReport;
  onBack: () => void;
}

export function PreviewPage({ report, onBack }: PreviewPageProps) {
  const { signatureImage, stampImage } = useSignatureSettings();

  const handleDownloadPdf = () => {
    const prevTitle = document.title;
    document.title = report.valuationNo
      ? `Valuation-Report-${report.valuationNo}`
      : "Valuation-Report";
    window.print();
    document.title = prevTitle;
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Toolbar */}
      <div className="no-print sticky top-0 z-10 bg-primary text-primary-foreground shadow px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            data-ocid="preview.back_button"
            className="hover:opacity-70 transition"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold text-sm">Print Preview</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.print()}
            data-ocid="preview.print_button"
          >
            <Printer size={14} className="mr-1" /> Print
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleDownloadPdf}
            data-ocid="preview.download_pdf_button"
            className="bg-green-600 hover:bg-green-700 text-white border-0"
          >
            <FileDown size={14} className="mr-1" /> Download PDF
          </Button>
        </div>
      </div>

      {/* A4 Page */}
      <div className="flex justify-center py-8 px-4">
        <div
          className="bg-white shadow-2xl"
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "15mm",
            boxSizing: "border-box",
          }}
          id="print-area"
        >
          <PrintPreview
            report={report}
            signatureImage={signatureImage}
            stampImage={stampImage}
          />
        </div>
      </div>
    </div>
  );
}
