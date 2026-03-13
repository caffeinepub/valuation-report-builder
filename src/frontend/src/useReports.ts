import { useCallback, useState } from "react";
import { createDefaultReport } from "./defaultReport";
import type { VehicleReport } from "./types";

const STORAGE_KEY = "vehicle_valuation_reports";

function loadReports(): VehicleReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as VehicleReport[];
  } catch {
    // ignore
  }
  return [];
}

function saveReports(reports: VehicleReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function useReports() {
  const [reports, setReports] = useState<VehicleReport[]>(loadReports);

  const createReport = useCallback(() => {
    const id = Date.now().toString();
    const report = createDefaultReport(id);
    setReports((prev) => {
      const next = [report, ...prev];
      saveReports(next);
      return next;
    });
    return id;
  }, []);

  const updateReport = useCallback((updated: VehicleReport) => {
    setReports((prev) => {
      const next = prev.map((r) =>
        r.id === updated.id
          ? { ...updated, updatedAt: new Date().toISOString() }
          : r,
      );
      saveReports(next);
      return next;
    });
  }, []);

  const deleteReport = useCallback((id: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      saveReports(next);
      return next;
    });
  }, []);

  const getReport = useCallback(
    (id: string) => reports.find((r) => r.id === id),
    [reports],
  );

  return { reports, createReport, updateReport, deleteReport, getReport };
}
