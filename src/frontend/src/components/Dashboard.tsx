import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Eye, FileText, Plus, Trash2 } from "lucide-react";
import React from "react";
import type { VehicleReport } from "../types";

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
          <Button
            variant="secondary"
            size="sm"
            onClick={onNew}
            data-ocid="dashboard.new_report.primary_button"
          >
            <Plus size={16} className="mr-1" /> New Report
          </Button>
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
