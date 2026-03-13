import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Edit,
  Eye,
  FileText,
  Plus,
  Settings,
  Stamp,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type React from "react";
import { useRef } from "react";
import type { VehicleReport } from "../types";
import { useSignatureSettings } from "../useSignatureSettings";

interface DashboardProps {
  reports: VehicleReport[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  onDelete: (id: string) => void;
}

function statusBadge(status: VehicleReport["status"]) {
  if (status === "submitted") {
    return (
      <Badge className="text-xs bg-green-600 hover:bg-green-700 text-white">
        Submitted
      </Badge>
    );
  }
  if (status === "complete") {
    return <Badge className="text-xs">Complete</Badge>;
  }
  return (
    <Badge variant="secondary" className="text-xs">
      Draft
    </Badge>
  );
}

function ImageUploadBox({
  label,
  image,
  onUpload,
  onClear,
  uploadOcid,
  deleteOcid,
  accept = "image/*",
  shape = "rect",
}: {
  label: string;
  image: string | null;
  onUpload: (base64: string) => void;
  onClear: () => void;
  uploadOcid: string;
  deleteOcid: string;
  accept?: string;
  shape?: "rect" | "circle";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onUpload(ev.target.result as string);
    };
    reader.readAsDataURL(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      <div
        className="relative border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition"
        style={{ minHeight: "110px" }}
      >
        {image ? (
          <div className="flex flex-col items-center gap-2 p-3">
            <img
              src={image}
              alt={label}
              style={{
                maxWidth: "120px",
                maxHeight: "80px",
                objectFit: "contain",
                borderRadius: shape === "circle" ? "50%" : "6px",
                border: "1px solid #ddd",
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                data-ocid={uploadOcid}
                className="text-xs h-7"
              >
                <Upload size={12} className="mr-1" /> Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onClear}
                data-ocid={deleteOcid}
                className="text-xs h-7"
              >
                <X size={12} className="mr-1" /> Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            data-ocid={uploadOcid}
            className="flex flex-col items-center gap-2 p-6 text-muted-foreground hover:text-foreground transition w-full"
          >
            <Upload size={24} />
            <span className="text-xs">Click to upload</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          className="hidden"
        />
      </div>
    </div>
  );
}

function SignatureSettingsDialog() {
  const {
    signatureImage,
    stampImage,
    setSignatureImage,
    setStampImage,
    clearSignatureImage,
    clearStampImage,
  } = useSignatureSettings();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-ocid="settings.open_modal_button"
        >
          <Settings size={15} className="mr-1" /> Signature & Stamp
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" data-ocid="settings.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Stamp size={18} className="text-primary" />
            Signature &amp; Stamp Settings
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-muted-foreground -mt-2">
          These images will appear in the signature block of every printed/PDF
          report.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <ImageUploadBox
            label="Signature Image"
            image={signatureImage}
            onUpload={setSignatureImage}
            onClear={clearSignatureImage}
            uploadOcid="settings.signature_upload_button"
            deleteOcid="settings.signature_delete_button"
            shape="rect"
          />
          <ImageUploadBox
            label="Stamp / Seal"
            image={stampImage}
            onUpload={setStampImage}
            onClear={clearStampImage}
            uploadOcid="settings.stamp_upload_button"
            deleteOcid="settings.stamp_delete_button"
            shape="circle"
          />
        </div>
        <div className="flex items-center gap-2 mt-2 p-3 bg-muted/50 rounded-lg">
          <div className="text-xs text-muted-foreground">
            💡 Tip: Use a transparent PNG for best results. Signature ~150×60px,
            Stamp ~80×80px.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Dashboard({
  reports,
  onNew,
  onEdit,
  onPreview,
  onDelete,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md no-print">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-serif">
              Vehicle Valuation Reports
            </h1>
            <p className="text-xs opacity-70 mt-0.5">
              Dinesh Kumar Jangir — Surveyor &amp; Loss Assessor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SignatureSettingsDialog />
            <Button
              variant="secondary"
              size="sm"
              onClick={onNew}
              data-ocid="dashboard.new_report.primary_button"
            >
              <Plus size={16} className="mr-1" /> New Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {reports.length === 0 ? (
          <div
            data-ocid="dashboard.reports.empty_state"
            className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card"
          >
            <FileText
              size={48}
              className="mx-auto text-muted-foreground mb-4"
            />
            <h2 className="text-lg font-semibold text-foreground mb-1">
              No Reports Yet
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first vehicle valuation report
            </p>
            <Button onClick={onNew} data-ocid="dashboard.empty.primary_button">
              <Plus size={16} className="mr-1" /> Create First Report
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {reports.length} report{reports.length !== 1 ? "s" : ""}
            </p>
            {reports.map((report, index) => (
              <Card
                key={report.id}
                className="hover:shadow-card-hover transition-shadow"
                data-ocid={`dashboard.reports.item.${index + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">
                            {report.valuationNo
                              ? `#${report.valuationNo}`
                              : "Untitled"}
                          </span>
                          {statusBadge(report.status)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {report.agencyName || "No Agency"}
                          {report.registrationNumber &&
                            ` • ${report.registrationNumber}`}
                          {report.makeModel && ` • ${report.makeModel}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(report.id)}
                        data-ocid={`dashboard.reports.edit_button.${index + 1}`}
                      >
                        <Edit size={14} className="mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPreview(report.id)}
                        data-ocid={`dashboard.reports.preview_button.${index + 1}`}
                      >
                        <Eye size={14} className="mr-1" /> Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(report.id)}
                        data-ocid={`dashboard.reports.delete_button.${index + 1}`}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="no-print text-center py-6 text-xs text-muted-foreground border-t border-border mt-8">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
          className="underline hover:text-foreground"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
