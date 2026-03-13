import { Toaster } from "@/components/ui/sonner";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { PreviewPage } from "./components/PreviewPage";
import { ReportEditor } from "./components/ReportEditor";
import type { VehicleReport } from "./types";
import { useReports } from "./useReports";

type View =
  | { page: "dashboard" }
  | { page: "editor"; id: string }
  | { page: "preview"; id: string };

export default function App() {
  const { reports, createReport, updateReport, deleteReport, getReport } =
    useReports();
  const [view, setView] = useState<View>({ page: "dashboard" });

  const handleNew = useCallback(() => {
    const id = createReport();
    setView({ page: "editor", id });
  }, [createReport]);

  const handleEdit = useCallback((id: string) => {
    setView({ page: "editor", id });
  }, []);

  const handlePreview = useCallback((id: string) => {
    setView({ page: "preview", id });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteReport(id);
      toast.success("Report deleted");
      setView({ page: "dashboard" });
    },
    [deleteReport],
  );

  const handleSave = useCallback(
    (report: VehicleReport) => {
      updateReport(report);
    },
    [updateReport],
  );

  if (view.page === "editor") {
    const report = getReport(view.id);
    if (!report) {
      setView({ page: "dashboard" });
      return null;
    }
    return (
      <>
        <ReportEditor
          report={report}
          onSave={handleSave}
          onPreview={() => handlePreview(view.id)}
          onBack={() => setView({ page: "dashboard" })}
        />
        <Toaster />
      </>
    );
  }

  if (view.page === "preview") {
    const report = getReport(view.id);
    if (!report) {
      setView({ page: "dashboard" });
      return null;
    }
    return (
      <>
        <PreviewPage
          report={report}
          onBack={() => setView({ page: "editor", id: view.id })}
        />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Dashboard
        reports={reports}
        onNew={handleNew}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onDelete={handleDelete}
      />
      <Toaster />
    </>
  );
}
