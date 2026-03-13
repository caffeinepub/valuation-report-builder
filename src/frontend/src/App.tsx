import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";
import { type ReportContent, defaultContent } from "./types";

type View = "dashboard" | "editor" | "preview";

interface ReportRecord {
  id: bigint;
  status: string;
  content: string;
  clientName: string;
  createdAt: bigint;
  reportDate: string;
  reportType: string;
  reportNumber: string;
}

const SECTIONS = [
  { id: "header", label: "Report Header" },
  { id: "executiveSummary", label: "Executive Summary" },
  { id: "subjectDetails", label: "Subject Details" },
  { id: "methodology", label: "Methodology" },
  { id: "marketAnalysis", label: "Market Analysis" },
  { id: "comparables", label: "Comparables" },
  { id: "incomeApproach", label: "Income Approach" },
  { id: "costApproach", label: "Cost Approach" },
  { id: "marketApproach", label: "Market Approach" },
  { id: "finalConclusion", label: "Final Conclusion" },
  { id: "assumptions", label: "Assumptions" },
  { id: "certification", label: "Certification" },
];

function parseContent(raw: string): ReportContent {
  try {
    return { ...defaultContent(), ...JSON.parse(raw) };
  } catch {
    return defaultContent();
  }
}

// ===================== DASHBOARD =====================
function Dashboard({
  onOpen,
  onPreview,
}: {
  onOpen: (r: ReportRecord) => void;
  onPreview: (r: ReportRecord) => void;
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [showNew, setShowNew] = useState(false);
  const [newType, setNewType] = useState("property");
  const [newClient, setNewClient] = useState("");
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const { data: reports = [], isLoading } = useQuery<ReportRecord[]>({
    queryKey: ["reports"],
    queryFn: () => actor!.listReports(),
    enabled: !!actor,
  });

  const createMutation = useMutation({
    mutationFn: ({ type, client }: { type: string; client: string }) =>
      actor!.createReport(type, client),
    onSuccess: async (id) => {
      await queryClient.invalidateQueries({ queryKey: ["reports"] });
      setShowNew(false);
      setNewClient("");
      const all = await actor!.listReports();
      const created = all.find((r: ReportRecord) => r.id === id);
      if (created) onOpen(created);
    },
    onError: () => toast.error("Failed to create report"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => actor!.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report deleted");
      setDeleteId(null);
    },
  });

  const sorted = [...reports].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="min-h-screen bg-background" data-ocid="dashboard.page">
      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sidebar-primary rounded flex items-center justify-center">
              <FileText className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-semibold text-sidebar-foreground">
                Valuation Report Builder
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Professional Appraisal Management
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowNew(true)}
            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
            data-ocid="dashboard.new_report_button"
          >
            <Plus className="w-4 h-4 mr-2" /> New Report
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={`skel-${i}`}
                className="h-48 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div
            className="text-center py-24 text-muted-foreground"
            data-ocid="dashboard.empty_state"
          >
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-1">No reports yet</p>
            <p className="text-sm">
              Create your first valuation report to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((report, idx) => (
              <Card
                key={String(report.id)}
                className="shadow-card hover:shadow-md transition-shadow border-border"
                data-ocid={`dashboard.report.item.${idx + 1}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-semibold truncate">
                        {report.clientName || "Unnamed Client"}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        #{report.reportNumber}
                      </p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          report.reportType === "property"
                            ? "border-blue-300 text-blue-700 bg-blue-50"
                            : "border-purple-300 text-purple-700 bg-purple-50"
                        }`}
                      >
                        {report.reportType === "property" ? (
                          <Building2 className="w-2.5 h-2.5 mr-1" />
                        ) : (
                          <Briefcase className="w-2.5 h-2.5 mr-1" />
                        )}
                        {report.reportType === "property"
                          ? "Property"
                          : "Business"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-4">
                    {report.status === "complete" ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                        <CheckCircle className="w-3 h-3 mr-1" /> Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                        <Clock className="w-3 h-3 mr-1" /> Draft
                      </Badge>
                    )}
                    {report.reportDate && (
                      <span className="text-xs text-muted-foreground">
                        {report.reportDate}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => onOpen(report)}
                      data-ocid={`dashboard.report.open_button.${idx + 1}`}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs"
                      onClick={() => onPreview(report)}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(report.id)}
                      data-ocid={`dashboard.report.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* New Report Dialog */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent data-ocid="new_report.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              Create New Report
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Report Type</Label>
              <Select value={newType} onValueChange={setNewType}>
                <SelectTrigger data-ocid="new_report.type.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property Valuation</SelectItem>
                  <SelectItem value="business">Business Valuation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Client Name</Label>
              <Input
                placeholder="Enter client name"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newClient.trim())
                    createMutation.mutate({
                      type: newType,
                      client: newClient.trim(),
                    });
                }}
                data-ocid="new_report.client.input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNew(false)}
              data-ocid="new_report.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                createMutation.mutate({
                  type: newType,
                  client: newClient.trim(),
                })
              }
              disabled={!newClient.trim() || createMutation.isPending}
              data-ocid="new_report.submit_button"
            >
              {createMutation.isPending ? "Creating..." : "Create Report"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="delete.dialog">
          <DialogHeader>
            <DialogTitle>Delete Report?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The report will be permanently
            removed.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteId !== null && deleteMutation.mutate(deleteId)
              }
              disabled={deleteMutation.isPending}
              data-ocid="delete.confirm_button"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}

// ===================== EDITOR =====================
function Editor({
  report,
  onBack,
  onPreview,
}: {
  report: ReportRecord;
  onBack: () => void;
  onPreview: () => void;
}) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("header");
  const [content, setContent] = useState<ReportContent>(() =>
    parseContent(report.content),
  );
  const [clientName, setClientName] = useState(report.clientName);
  const [reportDate, setReportDate] = useState(report.reportDate);
  const [status, setStatus] = useState(report.status);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveMutation = useMutation({
    mutationFn: ({
      cn,
      rd,
      st,
      ct,
    }: {
      cn: string;
      rd: string;
      st: string;
      ct: string;
    }) => actor!.updateReport(report.id, cn, rd, st, ct),
    onSuccess: () => {
      setSaveState("saved");
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      setTimeout(() => setSaveState("idle"), 2000);
    },
    onError: () => {
      setSaveState("idle");
      toast.error("Failed to save");
    },
  });

  const triggerSave = useCallback(
    (cn: string, rd: string, st: string, ct: ReportContent) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveState("saving");
      saveTimer.current = setTimeout(() => {
        saveMutation.mutate({ cn, rd, st, ct: JSON.stringify(ct) });
      }, 1500);
    },
    [saveMutation],
  );

  const updateContent = useCallback(
    (updater: (prev: ReportContent) => ReportContent) => {
      setContent((prev) => {
        const next = updater(prev);
        triggerSave(clientName, reportDate, status, next);
        return next;
      });
    },
    [clientName, reportDate, status, triggerSave],
  );

  const toggleStatus = () => {
    const next = status === "draft" ? "complete" : "draft";
    setStatus(next);
    triggerSave(clientName, reportDate, next, content);
  };

  return (
    <div
      className="h-screen flex flex-col bg-background"
      data-ocid="editor.page"
    >
      {/* Top bar */}
      <header className="bg-sidebar border-b border-sidebar-border flex items-center gap-3 px-4 py-3 shrink-0 no-print">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          data-ocid="editor.back_button"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
        </Button>
        <Separator orientation="vertical" className="h-5 bg-sidebar-border" />
        <div className="flex-1 min-w-0">
          <span className="text-sidebar-foreground font-medium text-sm truncate">
            {clientName || "Unnamed Report"}
          </span>
          <span className="text-sidebar-foreground/50 text-xs ml-2">
            #{report.reportNumber}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-sidebar-foreground/50">
            {saveState === "saving"
              ? "Saving..."
              : saveState === "saved"
                ? "Saved"
                : ""}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleStatus}
            className={`text-xs border-sidebar-border ${
              status === "complete"
                ? "bg-green-900/30 text-green-300 border-green-700"
                : "bg-amber-900/30 text-amber-300 border-amber-700"
            }`}
            data-ocid="editor.status_toggle"
          >
            {status === "complete" ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" /> Complete
              </>
            ) : (
              <>
                <RotateCcw className="w-3 h-3 mr-1" /> Draft
              </>
            )}
          </Button>
          <Button
            size="sm"
            onClick={onPreview}
            className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 text-xs"
            data-ocid="editor.preview_button"
          >
            <Eye className="w-3 h-3 mr-1" /> Preview
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-sidebar border-r border-sidebar-border shrink-0 no-print">
          <ScrollArea className="h-full">
            <nav className="p-2">
              {SECTIONS.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full text-left px-3 py-2 rounded text-xs font-medium transition-colors flex items-center justify-between group ${
                    activeSection === s.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                  data-ocid="editor.section.tab"
                >
                  {s.label}
                  {activeSection === s.id && (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </button>
              ))}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main form area */}
        <main className="flex-1 overflow-auto bg-background">
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto p-8">
              <SectionForm
                section={activeSection}
                content={content}
                clientName={clientName}
                reportDate={reportDate}
                updateContent={updateContent}
                setClientName={(v) => {
                  setClientName(v);
                  triggerSave(v, reportDate, status, content);
                }}
                setReportDate={(v) => {
                  setReportDate(v);
                  triggerSave(clientName, v, status, content);
                }}
              />
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
}

// ===================== SECTION FORMS =====================
function SectionForm({
  section,
  content,
  clientName,
  reportDate,
  updateContent,
  setClientName,
  setReportDate,
}: {
  section: string;
  content: ReportContent;
  clientName: string;
  reportDate: string;
  updateContent: (updater: (prev: ReportContent) => ReportContent) => void;
  setClientName: (v: string) => void;
  setReportDate: (v: string) => void;
}) {
  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder?: string,
  ) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9"
        data-ocid="editor.header.section"
      />
    </div>
  );

  const textarea = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    rows = 3,
    placeholder?: string,
  ) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        data-ocid="editor.summary.section"
      />
    </div>
  );

  if (section === "header") {
    return (
      <section>
        <SectionTitle>Report Header</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Client Name
            </Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client full name"
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Report Date
            </Label>
            <Input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="h-9"
            />
          </div>
          {field("Client Address", content.header.clientAddress, (v) =>
            updateContent((p) => ({
              ...p,
              header: { ...p.header, clientAddress: v },
            })),
          )}
          {field("Appraiser Name", content.header.appraiserName, (v) =>
            updateContent((p) => ({
              ...p,
              header: { ...p.header, appraiserName: v },
            })),
          )}
          {field("Appraiser License #", content.header.appraiserLicense, (v) =>
            updateContent((p) => ({
              ...p,
              header: { ...p.header, appraiserLicense: v },
            })),
          )}
          {field("Firm / Company Name", content.header.firmName, (v) =>
            updateContent((p) => ({
              ...p,
              header: { ...p.header, firmName: v },
            })),
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Effective Date of Value
            </Label>
            <Input
              type="date"
              value={content.header.effectiveDate}
              onChange={(e) =>
                updateContent((p) => ({
                  ...p,
                  header: { ...p.header, effectiveDate: e.target.value },
                }))
              }
              className="h-9"
            />
          </div>
        </div>
      </section>
    );
  }

  if (section === "executiveSummary") {
    return (
      <section>
        <SectionTitle>Executive Summary</SectionTitle>
        <div className="space-y-4">
          {field(
            "Purpose of Appraisal",
            content.executiveSummary.purpose,
            (v) =>
              updateContent((p) => ({
                ...p,
                executiveSummary: { ...p.executiveSummary, purpose: v },
              })),
            "e.g., Estimate market value for sale purposes",
          )}
          {field(
            "Value Type",
            content.executiveSummary.valueType,
            (v) =>
              updateContent((p) => ({
                ...p,
                executiveSummary: { ...p.executiveSummary, valueType: v },
              })),
            "e.g., Market Value, Investment Value",
          )}
          {textarea(
            "Scope of Work",
            content.executiveSummary.scopeOfWork,
            (v) =>
              updateContent((p) => ({
                ...p,
                executiveSummary: { ...p.executiveSummary, scopeOfWork: v },
              })),
            3,
            "Describe the scope of the appraisal assignment...",
          )}
          {textarea(
            "Executive Summary",
            content.executiveSummary.summaryText,
            (v) =>
              updateContent((p) => ({
                ...p,
                executiveSummary: { ...p.executiveSummary, summaryText: v },
              })),
            5,
            "Brief overview of findings and conclusions...",
          )}
        </div>
      </section>
    );
  }

  if (section === "subjectDetails") {
    return (
      <section>
        <SectionTitle>Subject Property / Business Details</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {field("Name / Property ID", content.subjectDetails.name, (v) =>
            updateContent((p) => ({
              ...p,
              subjectDetails: { ...p.subjectDetails, name: v },
            })),
          )}
          {field("Address", content.subjectDetails.address, (v) =>
            updateContent((p) => ({
              ...p,
              subjectDetails: { ...p.subjectDetails, address: v },
            })),
          )}
          {field(
            "Legal Description",
            content.subjectDetails.legalDescription,
            (v) =>
              updateContent((p) => ({
                ...p,
                subjectDetails: { ...p.subjectDetails, legalDescription: v },
              })),
          )}
          {field(
            "Ownership / Ownership Interest",
            content.subjectDetails.ownership,
            (v) =>
              updateContent((p) => ({
                ...p,
                subjectDetails: { ...p.subjectDetails, ownership: v },
              })),
          )}
          {field(
            "Year Built / Established",
            content.subjectDetails.yearBuilt,
            (v) =>
              updateContent((p) => ({
                ...p,
                subjectDetails: { ...p.subjectDetails, yearBuilt: v },
              })),
          )}
          {field(
            "Size / Area (sq ft, units, revenue)",
            content.subjectDetails.size,
            (v) =>
              updateContent((p) => ({
                ...p,
                subjectDetails: { ...p.subjectDetails, size: v },
              })),
          )}
          {field(
            "Zoning / Industry",
            content.subjectDetails.zoningIndustry,
            (v) =>
              updateContent((p) => ({
                ...p,
                subjectDetails: { ...p.subjectDetails, zoningIndustry: v },
              })),
          )}
          {field("Current Use", content.subjectDetails.currentUse, (v) =>
            updateContent((p) => ({
              ...p,
              subjectDetails: { ...p.subjectDetails, currentUse: v },
            })),
          )}
        </div>
      </section>
    );
  }

  if (section === "methodology") {
    const { methodology } = content;
    return (
      <section>
        <SectionTitle>Methodology</SectionTitle>
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Approaches Used
            </Label>
            {(
              [
                ["incomeApproach", "Income Approach"],
                ["costApproach", "Cost Approach"],
                ["marketApproach", "Market / Sales Comparison Approach"],
              ] as [keyof typeof methodology, string][]
            ).map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={key}
                  checked={methodology[key] as boolean}
                  onCheckedChange={(v) =>
                    updateContent((p) => ({
                      ...p,
                      methodology: { ...p.methodology, [key]: !!v },
                    }))
                  }
                />
                <label htmlFor={key} className="text-sm cursor-pointer">
                  {label}
                </label>
              </div>
            ))}
          </div>
          {methodology.incomeApproach &&
            textarea(
              "Income Approach Rationale",
              methodology.incomeRationale,
              (v) =>
                updateContent((p) => ({
                  ...p,
                  methodology: { ...p.methodology, incomeRationale: v },
                })),
            )}
          {methodology.costApproach &&
            textarea(
              "Cost Approach Rationale",
              methodology.costRationale,
              (v) =>
                updateContent((p) => ({
                  ...p,
                  methodology: { ...p.methodology, costRationale: v },
                })),
            )}
          {methodology.marketApproach &&
            textarea(
              "Market Approach Rationale",
              methodology.marketRationale,
              (v) =>
                updateContent((p) => ({
                  ...p,
                  methodology: { ...p.methodology, marketRationale: v },
                })),
            )}
          {textarea(
            "Data Sources",
            methodology.dataSources,
            (v) =>
              updateContent((p) => ({
                ...p,
                methodology: { ...p.methodology, dataSources: v },
              })),
            3,
            "List primary data sources used...",
          )}
        </div>
      </section>
    );
  }

  if (section === "marketAnalysis") {
    const { marketAnalysis } = content;
    return (
      <section>
        <SectionTitle>Market Analysis</SectionTitle>
        <div className="space-y-4">
          {textarea(
            "Market Area Description",
            marketAnalysis.marketAreaDescription,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketAnalysis: {
                  ...p.marketAnalysis,
                  marketAreaDescription: v,
                },
              })),
            3,
          )}
          {textarea(
            "Supply & Demand Factors",
            marketAnalysis.supplyDemandFactors,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketAnalysis: { ...p.marketAnalysis, supplyDemandFactors: v },
              })),
            3,
          )}
          {textarea(
            "Market Trends",
            marketAnalysis.marketTrends,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketAnalysis: { ...p.marketAnalysis, marketTrends: v },
              })),
            3,
          )}
          {textarea(
            "Economic Conditions",
            marketAnalysis.economicConditions,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketAnalysis: { ...p.marketAnalysis, economicConditions: v },
              })),
            3,
          )}
          {textarea(
            "Market Conditions Conclusion",
            marketAnalysis.marketConclusion,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketAnalysis: { ...p.marketAnalysis, marketConclusion: v },
              })),
            3,
          )}
        </div>
      </section>
    );
  }

  if (section === "comparables") {
    return (
      <section>
        <SectionTitle>Comparable Sales / Transactions</SectionTitle>
        <div className="space-y-3">
          {content.comparables.map((comp, idx) => (
            <Card
              key={`comp-${idx}`}
              className="border"
              data-ocid={`editor.comparables.row.${idx + 1}`}
            >
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Name / Address
                    </Label>
                    <Input
                      value={comp.nameAddress}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = {
                            ...comps[idx],
                            nameAddress: e.target.value,
                          };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Sale Date
                    </Label>
                    <Input
                      value={comp.saleDate}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = {
                            ...comps[idx],
                            saleDate: e.target.value,
                          };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Sale Price
                    </Label>
                    <Input
                      value={comp.salePrice}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = {
                            ...comps[idx],
                            salePrice: e.target.value,
                          };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                      placeholder="$0"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Size
                    </Label>
                    <Input
                      value={comp.size}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = { ...comps[idx], size: e.target.value };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Price Per Unit
                    </Label>
                    <Input
                      value={comp.pricePerUnit}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = {
                            ...comps[idx],
                            pricePerUnit: e.target.value,
                          };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Adjustments
                    </Label>
                    <Input
                      value={comp.adjustments}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = {
                            ...comps[idx],
                            adjustments: e.target.value,
                          };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Adjusted Value
                    </Label>
                    <Input
                      value={comp.adjustedValue}
                      onChange={(e) =>
                        updateContent((p) => {
                          const comps = [...p.comparables];
                          comps[idx] = {
                            ...comps[idx],
                            adjustedValue: e.target.value,
                          };
                          return { ...p, comparables: comps };
                        })
                      }
                      className="h-8 text-sm"
                      placeholder="$0"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs text-destructive hover:text-destructive h-7"
                  onClick={() =>
                    updateContent((p) => ({
                      ...p,
                      comparables: p.comparables.filter((_, i) => i !== idx),
                    }))
                  }
                  data-ocid={`editor.comparables.delete_button.${idx + 1}`}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateContent((p) => ({
                ...p,
                comparables: [
                  ...p.comparables,
                  {
                    nameAddress: "",
                    saleDate: "",
                    salePrice: "",
                    size: "",
                    pricePerUnit: "",
                    adjustments: "",
                    adjustedValue: "",
                  },
                ],
              }))
            }
            data-ocid="editor.comparables.add_button"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Comparable
          </Button>
        </div>
      </section>
    );
  }

  if (section === "incomeApproach") {
    const d = content.incomeApproachData;
    const upd = (key: keyof typeof d) => (v: string) =>
      updateContent((p) => ({
        ...p,
        incomeApproachData: { ...p.incomeApproachData, [key]: v },
      }));
    return (
      <section>
        <SectionTitle>Income Approach</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {field(
            "Potential Gross Income",
            d.potentialGrossIncome,
            upd("potentialGrossIncome"),
            "$",
          )}
          {field("Vacancy Rate (%)", d.vacancyRate, upd("vacancyRate"), "%")}
          {field(
            "Effective Gross Income",
            d.effectiveGrossIncome,
            upd("effectiveGrossIncome"),
            "$",
          )}
          {field(
            "Operating Expenses",
            d.operatingExpenses,
            upd("operatingExpenses"),
            "$",
          )}
          {field("Net Operating Income (NOI)", d.noi, upd("noi"), "$")}
          {field("Capitalization Rate (%)", d.capRate, upd("capRate"), "%")}
          <div className="col-span-2">
            {field(
              "Indicated Value",
              d.indicatedValue,
              upd("indicatedValue"),
              "$",
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section === "costApproach") {
    const d = content.costApproachData;
    const upd = (key: keyof typeof d) => (v: string) =>
      updateContent((p) => ({
        ...p,
        costApproachData: { ...p.costApproachData, [key]: v },
      }));
    return (
      <section>
        <SectionTitle>Cost Approach</SectionTitle>
        <div className="grid grid-cols-2 gap-4">
          {field("Land Value", d.landValue, upd("landValue"), "$")}
          {field(
            "Improvement Cost (New)",
            d.improvementCostNew,
            upd("improvementCostNew"),
            "$",
          )}
          {field("Depreciation", d.depreciation, upd("depreciation"), "$")}
          {field(
            "Depreciated Improvement Value",
            d.depreciatedValue,
            upd("depreciatedValue"),
            "$",
          )}
          <div className="col-span-2">
            {field(
              "Indicated Value",
              d.indicatedValue,
              upd("indicatedValue"),
              "$",
            )}
          </div>
        </div>
      </section>
    );
  }

  if (section === "marketApproach") {
    const d = content.marketApproachData;
    return (
      <section>
        <SectionTitle>Market / Sales Comparison Approach</SectionTitle>
        <div className="space-y-4">
          {textarea(
            "Comparable Analysis",
            d.comparableAnalysis,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketApproachData: {
                  ...p.marketApproachData,
                  comparableAnalysis: v,
                },
              })),
            4,
          )}
          {textarea(
            "Adjustments Summary",
            d.adjustmentsSummary,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketApproachData: {
                  ...p.marketApproachData,
                  adjustmentsSummary: v,
                },
              })),
            3,
          )}
          {field(
            "Reconciled Value",
            d.reconciledValue,
            (v) =>
              updateContent((p) => ({
                ...p,
                marketApproachData: {
                  ...p.marketApproachData,
                  reconciledValue: v,
                },
              })),
            "$",
          )}
        </div>
      </section>
    );
  }

  if (section === "finalConclusion") {
    const d = content.finalConclusion;
    return (
      <section>
        <SectionTitle>Final Value Conclusion</SectionTitle>
        <div className="space-y-4">
          {textarea(
            "Reconciliation Narrative",
            d.reconciliationNarrative,
            (v) =>
              updateContent((p) => ({
                ...p,
                finalConclusion: {
                  ...p.finalConclusion,
                  reconciliationNarrative: v,
                },
              })),
            5,
            "Describe how the different approaches were weighted...",
          )}
          {field(
            "Final Value Opinion",
            d.finalValueOpinion,
            (v) =>
              updateContent((p) => ({
                ...p,
                finalConclusion: { ...p.finalConclusion, finalValueOpinion: v },
              })),
            "e.g., $1,250,000",
          )}
          {field(
            "Value Type",
            d.valueType,
            (v) =>
              updateContent((p) => ({
                ...p,
                finalConclusion: { ...p.finalConclusion, valueType: v },
              })),
            "e.g., As-Is Market Value",
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Value Date
            </Label>
            <Input
              type="date"
              value={d.valueDate}
              onChange={(e) =>
                updateContent((p) => ({
                  ...p,
                  finalConclusion: {
                    ...p.finalConclusion,
                    valueDate: e.target.value,
                  },
                }))
              }
              className="h-9"
            />
          </div>
        </div>
      </section>
    );
  }

  if (section === "assumptions") {
    return (
      <section>
        <SectionTitle>Assumptions &amp; Limiting Conditions</SectionTitle>
        <div className="space-y-2">
          {content.assumptionsConditions.map((condition, idx) => (
            <div
              key={`comp-${idx}`}
              className="flex gap-2 items-start"
              data-ocid={`editor.assumptions.item.${idx + 1}`}
            >
              <span className="text-muted-foreground text-sm mt-2 shrink-0">
                {idx + 1}.
              </span>
              <Textarea
                value={condition}
                onChange={(e) =>
                  updateContent((p) => {
                    const arr = [...p.assumptionsConditions];
                    arr[idx] = e.target.value;
                    return { ...p, assumptionsConditions: arr };
                  })
                }
                rows={2}
                className="text-sm flex-1"
              />
              <Button
                size="icon"
                variant="ghost"
                className="mt-1 h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() =>
                  updateContent((p) => ({
                    ...p,
                    assumptionsConditions: p.assumptionsConditions.filter(
                      (_, i) => i !== idx,
                    ),
                  }))
                }
                data-ocid={`editor.assumptions.delete_button.${idx + 1}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              updateContent((p) => ({
                ...p,
                assumptionsConditions: [...p.assumptionsConditions, ""],
              }))
            }
            data-ocid="editor.assumptions.add_button"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Condition
          </Button>
        </div>
      </section>
    );
  }

  if (section === "certification") {
    const d = content.certification;
    const upd = (key: keyof typeof d) => (v: string) =>
      updateContent((p) => ({
        ...p,
        certification: { ...p.certification, [key]: v },
      }));
    return (
      <section>
        <SectionTitle>Appraiser Certification</SectionTitle>
        <div className="space-y-4">
          {textarea(
            "Certification Statement",
            d.certificationStatement,
            upd("certificationStatement"),
            5,
          )}
          <div className="grid grid-cols-2 gap-4">
            {field(
              "Appraiser Signature (Typed)",
              d.appraiserSignature,
              upd("appraiserSignature"),
            )}
            {field(
              "Designation / Title",
              d.designation,
              upd("designation"),
              "e.g., MAI, SRA, ASA",
            )}
            {field("License Number", d.licenseNumber, upd("licenseNumber"))}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Date Signed
              </Label>
              <Input
                type="date"
                value={d.dateSigned}
                onChange={(e) => upd("dateSigned")(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return null;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-semibold text-foreground">
        {children}
      </h2>
      <div className="mt-2 h-px bg-border" />
    </div>
  );
}

// ===================== PREVIEW =====================
function Preview({
  report,
  onBack,
}: {
  report: ReportRecord;
  onBack: () => void;
}) {
  const content = parseContent(report.content);
  const c = content;

  return (
    <div className="min-h-screen bg-muted" data-ocid="preview.page">
      {/* Print toolbar */}
      <div className="bg-sidebar border-b border-sidebar-border px-6 py-3 flex items-center gap-3 no-print sticky top-0 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          data-ocid="preview.back_button"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <span className="text-sidebar-foreground/50 text-xs flex-1">
          Print Preview
        </span>
        <Button
          size="sm"
          onClick={() => window.print()}
          className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          data-ocid="preview.print_button"
        >
          <Printer className="w-4 h-4 mr-2" /> Print / Export PDF
        </Button>
      </div>

      {/* Document */}
      <div className="max-w-4xl mx-auto my-8 px-4 print-page">
        <div
          className="bg-white shadow-lg print:shadow-none"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {/* Cover Header */}
          <div className="bg-[#1e2a4a] text-white px-12 py-10">
            <div className="text-xs font-sans uppercase tracking-widest text-blue-300 mb-1">
              Appraisal Report
            </div>
            <h1
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {report.reportType === "property"
                ? "Property Valuation Report"
                : "Business Valuation Report"}
            </h1>
            {c.header.firmName && (
              <p className="text-blue-200 text-sm mt-2">{c.header.firmName}</p>
            )}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-300 text-xs">Client</span>
                <p className="font-medium">{report.clientName || "—"}</p>
                {c.header.clientAddress && (
                  <p className="text-blue-200 text-xs mt-0.5">
                    {c.header.clientAddress}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-blue-300 text-xs">Report Number</span>
                <p className="font-medium">{report.reportNumber}</p>
                <p className="text-blue-200 text-xs mt-0.5">
                  {report.reportDate}
                </p>
              </div>
            </div>
          </div>

          <div className="px-12 py-8 space-y-10">
            {/* Appraiser info */}
            {(c.header.appraiserName || c.header.effectiveDate) && (
              <div className="border border-gray-200 rounded p-4 bg-gray-50 grid grid-cols-3 gap-4 text-sm">
                {c.header.appraiserName && (
                  <InfoCell label="Appraiser" value={c.header.appraiserName} />
                )}
                {c.header.appraiserLicense && (
                  <InfoCell
                    label="License #"
                    value={c.header.appraiserLicense}
                  />
                )}
                {c.header.effectiveDate && (
                  <InfoCell
                    label="Effective Date"
                    value={c.header.effectiveDate}
                  />
                )}
              </div>
            )}

            {/* Executive Summary */}
            {c.executiveSummary.summaryText && (
              <PrintSection title="Executive Summary">
                {c.executiveSummary.purpose && (
                  <PrintRow
                    label="Purpose"
                    value={c.executiveSummary.purpose}
                  />
                )}
                {c.executiveSummary.valueType && (
                  <PrintRow
                    label="Value Type"
                    value={c.executiveSummary.valueType}
                  />
                )}
                {c.executiveSummary.scopeOfWork && (
                  <PrintRow
                    label="Scope of Work"
                    value={c.executiveSummary.scopeOfWork}
                  />
                )}
                <p className="text-sm leading-relaxed mt-3">
                  {c.executiveSummary.summaryText}
                </p>
              </PrintSection>
            )}

            {/* Subject Details */}
            <PrintSection title="Subject Details">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                {c.subjectDetails.name && (
                  <PrintRow label="Name/ID" value={c.subjectDetails.name} />
                )}
                {c.subjectDetails.address && (
                  <PrintRow label="Address" value={c.subjectDetails.address} />
                )}
                {c.subjectDetails.legalDescription && (
                  <PrintRow
                    label="Legal Description"
                    value={c.subjectDetails.legalDescription}
                  />
                )}
                {c.subjectDetails.ownership && (
                  <PrintRow
                    label="Ownership"
                    value={c.subjectDetails.ownership}
                  />
                )}
                {c.subjectDetails.yearBuilt && (
                  <PrintRow
                    label="Year Built"
                    value={c.subjectDetails.yearBuilt}
                  />
                )}
                {c.subjectDetails.size && (
                  <PrintRow label="Size" value={c.subjectDetails.size} />
                )}
                {c.subjectDetails.zoningIndustry && (
                  <PrintRow
                    label="Zoning/Industry"
                    value={c.subjectDetails.zoningIndustry}
                  />
                )}
                {c.subjectDetails.currentUse && (
                  <PrintRow
                    label="Current Use"
                    value={c.subjectDetails.currentUse}
                  />
                )}
              </div>
            </PrintSection>

            {/* Market Analysis */}
            {c.marketAnalysis.marketAreaDescription && (
              <PrintSection title="Market Analysis">
                {c.marketAnalysis.marketAreaDescription && (
                  <PrintNarrative
                    label="Market Area"
                    value={c.marketAnalysis.marketAreaDescription}
                  />
                )}
                {c.marketAnalysis.supplyDemandFactors && (
                  <PrintNarrative
                    label="Supply & Demand"
                    value={c.marketAnalysis.supplyDemandFactors}
                  />
                )}
                {c.marketAnalysis.marketTrends && (
                  <PrintNarrative
                    label="Market Trends"
                    value={c.marketAnalysis.marketTrends}
                  />
                )}
                {c.marketAnalysis.economicConditions && (
                  <PrintNarrative
                    label="Economic Conditions"
                    value={c.marketAnalysis.economicConditions}
                  />
                )}
                {c.marketAnalysis.marketConclusion && (
                  <PrintNarrative
                    label="Conclusion"
                    value={c.marketAnalysis.marketConclusion}
                  />
                )}
              </PrintSection>
            )}

            {/* Comparables */}
            {c.comparables.length > 0 && (
              <PrintSection title="Comparable Transactions">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#1e2a4a] text-white">
                      {[
                        "Property/Name",
                        "Sale Date",
                        "Sale Price",
                        "Size",
                        "$/Unit",
                        "Adjustments",
                        "Adj. Value",
                      ].map((h) => (
                        <th key={h} className="p-2 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.comparables.map((comp, i) => (
                      <tr
                        key={`row-${i}`}
                        className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-2 border-b border-gray-100">
                          {comp.nameAddress}
                        </td>
                        <td className="p-2 border-b border-gray-100">
                          {comp.saleDate}
                        </td>
                        <td className="p-2 border-b border-gray-100">
                          {comp.salePrice}
                        </td>
                        <td className="p-2 border-b border-gray-100">
                          {comp.size}
                        </td>
                        <td className="p-2 border-b border-gray-100">
                          {comp.pricePerUnit}
                        </td>
                        <td className="p-2 border-b border-gray-100">
                          {comp.adjustments}
                        </td>
                        <td className="p-2 border-b border-gray-100 font-medium">
                          {comp.adjustedValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </PrintSection>
            )}

            {/* Valuation Approaches */}
            {c.methodology.incomeApproach && (
              <PrintSection title="Income Approach">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {c.incomeApproachData.potentialGrossIncome && (
                    <PrintRow
                      label="Potential Gross Income"
                      value={c.incomeApproachData.potentialGrossIncome}
                    />
                  )}
                  {c.incomeApproachData.vacancyRate && (
                    <PrintRow
                      label="Vacancy Rate"
                      value={c.incomeApproachData.vacancyRate}
                    />
                  )}
                  {c.incomeApproachData.effectiveGrossIncome && (
                    <PrintRow
                      label="Effective Gross Income"
                      value={c.incomeApproachData.effectiveGrossIncome}
                    />
                  )}
                  {c.incomeApproachData.operatingExpenses && (
                    <PrintRow
                      label="Operating Expenses"
                      value={c.incomeApproachData.operatingExpenses}
                    />
                  )}
                  {c.incomeApproachData.noi && (
                    <PrintRow
                      label="Net Operating Income"
                      value={c.incomeApproachData.noi}
                    />
                  )}
                  {c.incomeApproachData.capRate && (
                    <PrintRow
                      label="Cap Rate"
                      value={c.incomeApproachData.capRate}
                    />
                  )}
                </div>
                {c.incomeApproachData.indicatedValue && (
                  <div className="mt-3 p-3 bg-[#1e2a4a]/5 border border-[#1e2a4a]/20 rounded">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Indicated Value (Income)
                    </span>
                    <p className="text-lg font-bold text-[#1e2a4a]">
                      {c.incomeApproachData.indicatedValue}
                    </p>
                  </div>
                )}
              </PrintSection>
            )}

            {c.methodology.costApproach && (
              <PrintSection title="Cost Approach">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {c.costApproachData.landValue && (
                    <PrintRow
                      label="Land Value"
                      value={c.costApproachData.landValue}
                    />
                  )}
                  {c.costApproachData.improvementCostNew && (
                    <PrintRow
                      label="Improvement Cost (New)"
                      value={c.costApproachData.improvementCostNew}
                    />
                  )}
                  {c.costApproachData.depreciation && (
                    <PrintRow
                      label="Depreciation"
                      value={c.costApproachData.depreciation}
                    />
                  )}
                  {c.costApproachData.depreciatedValue && (
                    <PrintRow
                      label="Depreciated Value"
                      value={c.costApproachData.depreciatedValue}
                    />
                  )}
                </div>
                {c.costApproachData.indicatedValue && (
                  <div className="mt-3 p-3 bg-[#1e2a4a]/5 border border-[#1e2a4a]/20 rounded">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Indicated Value (Cost)
                    </span>
                    <p className="text-lg font-bold text-[#1e2a4a]">
                      {c.costApproachData.indicatedValue}
                    </p>
                  </div>
                )}
              </PrintSection>
            )}

            {c.methodology.marketApproach &&
              c.marketApproachData.reconciledValue && (
                <PrintSection title="Market / Sales Comparison Approach">
                  {c.marketApproachData.comparableAnalysis && (
                    <PrintNarrative
                      label="Analysis"
                      value={c.marketApproachData.comparableAnalysis}
                    />
                  )}
                  {c.marketApproachData.adjustmentsSummary && (
                    <PrintNarrative
                      label="Adjustments"
                      value={c.marketApproachData.adjustmentsSummary}
                    />
                  )}
                  <div className="mt-3 p-3 bg-[#1e2a4a]/5 border border-[#1e2a4a]/20 rounded">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                      Indicated Value (Market)
                    </span>
                    <p className="text-lg font-bold text-[#1e2a4a]">
                      {c.marketApproachData.reconciledValue}
                    </p>
                  </div>
                </PrintSection>
              )}

            {/* Final Conclusion */}
            {c.finalConclusion.finalValueOpinion && (
              <PrintSection title="Final Value Conclusion">
                {c.finalConclusion.reconciliationNarrative && (
                  <p className="text-sm leading-relaxed mb-4">
                    {c.finalConclusion.reconciliationNarrative}
                  </p>
                )}
                <div className="p-6 bg-[#1e2a4a] text-white rounded text-center">
                  <p className="text-xs uppercase tracking-widest text-blue-300 mb-1">
                    {c.finalConclusion.valueType || "Final Value Opinion"}
                  </p>
                  <p className="text-4xl font-bold">
                    {c.finalConclusion.finalValueOpinion}
                  </p>
                  {c.finalConclusion.valueDate && (
                    <p className="text-blue-300 text-sm mt-2">
                      as of {c.finalConclusion.valueDate}
                    </p>
                  )}
                </div>
              </PrintSection>
            )}

            {/* Assumptions */}
            {c.assumptionsConditions.length > 0 && (
              <PrintSection title="Assumptions &amp; Limiting Conditions">
                <ol className="list-decimal pl-5 space-y-2">
                  {c.assumptionsConditions.map((cond, i) => (
                    <li key={`cond-${i}`} className="text-sm leading-relaxed">
                      {cond}
                    </li>
                  ))}
                </ol>
              </PrintSection>
            )}

            {/* Certification */}
            <PrintSection title="Appraiser Certification">
              {c.certification.certificationStatement && (
                <p className="text-sm leading-relaxed mb-6">
                  {c.certification.certificationStatement}
                </p>
              )}
              <div className="grid grid-cols-2 gap-8 mt-6">
                <div>
                  <div className="border-b border-gray-400 pb-1 mb-1">
                    <span className="text-sm font-medium">
                      {c.certification.appraiserSignature ||
                        "_________________________"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Appraiser Signature</p>
                  {c.certification.designation && (
                    <p className="text-xs text-gray-600 mt-0.5">
                      {c.certification.designation}
                    </p>
                  )}
                  {c.certification.licenseNumber && (
                    <p className="text-xs text-gray-600">
                      License #: {c.certification.licenseNumber}
                    </p>
                  )}
                </div>
                <div>
                  <div className="border-b border-gray-400 pb-1 mb-1">
                    <span className="text-sm">
                      {c.certification.dateSigned ||
                        "_________________________"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Date</p>
                </div>
              </div>
            </PrintSection>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 border-t border-gray-200 px-12 py-4 text-xs text-gray-500 flex justify-between">
            <span>{c.header.firmName}</span>
            <span>Report #{report.reportNumber} | Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintSection({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="page-break-inside-avoid">
      <h2
        className="text-base font-bold uppercase tracking-wide border-b-2 border-[#1e2a4a] pb-1 mb-4"
        style={{ fontFamily: "Georgia, serif", color: "#1e2a4a" }}
      >
        {title}
      </h2>
      {children}
    </div>
  );
}

function PrintRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm py-0.5">
      <span className="text-gray-500 shrink-0 w-40">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function PrintNarrative({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>
      <p className="text-sm leading-relaxed">{value}</p>
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}

// ===================== APP ROOT =====================
export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [activeReport, setActiveReport] = useState<ReportRecord | null>(null);

  const handleOpen = (report: ReportRecord) => {
    setActiveReport(report);
    setView("editor");
  };

  const handlePreviewFromDash = (report: ReportRecord) => {
    setActiveReport(report);
    setView("preview");
  };

  if (view === "editor" && activeReport) {
    return (
      <Editor
        report={activeReport}
        onBack={() => setView("dashboard")}
        onPreview={() => setView("preview")}
      />
    );
  }

  if (view === "preview" && activeReport) {
    return (
      <Preview
        report={activeReport}
        onBack={() => (activeReport ? setView("editor") : setView("dashboard"))}
      />
    );
  }

  return <Dashboard onOpen={handleOpen} onPreview={handlePreviewFromDash} />;
}
