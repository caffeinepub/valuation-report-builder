import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ChevronDown, ChevronUp, Eye, Save } from "lucide-react";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import type { VehicleReport } from "../types";

interface ReportEditorProps {
  report: VehicleReport;
  onSave: (report: VehicleReport) => void;
  onPreview: () => void;
  onBack: () => void;
}

function Section({
  title,
  children,
  defaultOpen = true,
}: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wide"
      >
        <span>{title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-card">
          {children}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">
        {label}
      </Label>
      {children}
    </div>
  );
}

function SelectField({
  value,
  onChange,
  options,
}: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function ReportEditor({
  report,
  onSave,
  onPreview,
  onBack,
}: ReportEditorProps) {
  const [form, setForm] = useState<VehicleReport>(report);

  const set = useCallback(
    (field: keyof VehicleReport) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const setSel = useCallback(
    (field: keyof VehicleReport) => (v: string) => {
      setForm((prev) => ({ ...prev, [field]: v }));
    },
    [],
  );

  // Auto-save debounce
  useEffect(() => {
    const t = setTimeout(() => onSave(form), 1500);
    return () => clearTimeout(t);
  }, [form, onSave]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="no-print sticky top-0 z-10 bg-primary text-primary-foreground shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              data-ocid="editor.back_button"
              className="hover:opacity-70 transition"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="font-bold text-sm font-serif">
                Valuation Report Editor
              </div>
              <div className="text-xs opacity-70">
                {form.valuationNo ? `#${form.valuationNo}` : "New Report"}{" "}
                &bull; {form.agencyName || "No Agency"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={form.status === "complete" ? "default" : "secondary"}
              className="cursor-pointer text-xs"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  status: prev.status === "complete" ? "draft" : "complete",
                }))
              }
              data-ocid="editor.status_toggle"
            >
              {form.status === "complete" ? "Complete" : "Draft"}
            </Badge>
            <Button
              size="sm"
              variant="secondary"
              onClick={onPreview}
              data-ocid="editor.preview_button"
            >
              <Eye size={14} className="mr-1" /> Preview
            </Button>
            <Button
              size="sm"
              onClick={() => onSave(form)}
              data-ocid="editor.save_button"
            >
              <Save size={14} className="mr-1" /> Save
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Header Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-card border border-border rounded-lg">
          <Field label="Valuation No.">
            <Input
              value={form.valuationNo}
              onChange={set("valuationNo")}
              placeholder="e.g. 2024/001"
              className="h-9 text-sm"
              data-ocid="header.valuation_no.input"
            />
          </Field>
          <Field label="Name of Agency">
            <Input
              value={form.agencyName}
              onChange={set("agencyName")}
              placeholder="Agency / Bank name"
              className="h-9 text-sm"
              data-ocid="header.agency_name.input"
            />
          </Field>
        </div>

        <Section title="Inspection Details">
          <Field label="Valuer Name">
            <Input
              value={form.valuatorName}
              onChange={set("valuatorName")}
              className="h-9 text-sm"
              data-ocid="inspection.valuer_name.input"
            />
          </Field>
          <Field label="Date &amp; Time of Inspection">
            <Input
              value={form.inspectionDateTime}
              onChange={set("inspectionDateTime")}
              placeholder="dd/mm/yyyy HH:MM"
              className="h-9 text-sm"
              data-ocid="inspection.datetime.input"
            />
          </Field>
          <Field label="Place of Inspection" full>
            <Input
              value={form.placeOfInspection}
              onChange={set("placeOfInspection")}
              className="h-9 text-sm"
              data-ocid="inspection.place.input"
            />
          </Field>
        </Section>

        <Section title="Registration Details">
          <Field label="Registered Owner &amp; Address" full>
            <Textarea
              value={form.ownerAddress}
              onChange={set("ownerAddress")}
              rows={3}
              className="text-sm"
              data-ocid="reg.owner_address.textarea"
            />
          </Field>
          <Field label="Hypo.">
            <Input
              value={form.hypo}
              onChange={set("hypo")}
              className="h-9 text-sm"
              data-ocid="reg.hypo.input"
            />
          </Field>
          <Field label="Ownership Transfer">
            <Input
              value={form.ownershipTransfer}
              onChange={set("ownershipTransfer")}
              className="h-9 text-sm"
              data-ocid="reg.ownership_transfer.input"
            />
          </Field>
          <Field label="Registration Number">
            <Input
              value={form.registrationNumber}
              onChange={set("registrationNumber")}
              placeholder="RJ-XX-XX-XXXX"
              className="h-9 text-sm"
              data-ocid="reg.reg_number.input"
            />
          </Field>
          <Field label="Date of Registration &amp; Purchase">
            <Input
              value={form.dateOfRegistrationPurchase}
              onChange={set("dateOfRegistrationPurchase")}
              className="h-9 text-sm"
              data-ocid="reg.reg_date.input"
            />
          </Field>
          <Field label="Chassis Number">
            <Input
              value={form.chassisNumber}
              onChange={set("chassisNumber")}
              className="h-9 text-sm"
              data-ocid="reg.chassis.input"
            />
          </Field>
          <Field label="Engine Number">
            <Input
              value={form.engineNumber}
              onChange={set("engineNumber")}
              className="h-9 text-sm"
              data-ocid="reg.engine_no.input"
            />
          </Field>
          <Field label="Odometer / Hour Meter">
            <Input
              value={form.odometerHourMeter}
              onChange={set("odometerHourMeter")}
              placeholder="e.g. 45000 km"
              className="h-9 text-sm"
              data-ocid="reg.odometer.input"
            />
          </Field>
          <Field label="Make &amp; Model">
            <Input
              value={form.makeModel}
              onChange={set("makeModel")}
              className="h-9 text-sm"
              data-ocid="reg.make_model.input"
            />
          </Field>
          <Field label="Colour">
            <Input
              value={form.colour}
              onChange={set("colour")}
              className="h-9 text-sm"
              data-ocid="reg.colour.input"
            />
          </Field>
          <Field label="Manufacturing Year">
            <Input
              value={form.manufacturingYear}
              onChange={set("manufacturingYear")}
              placeholder="e.g. 2019"
              className="h-9 text-sm"
              data-ocid="reg.mfg_year.input"
            />
          </Field>
          <Field label="Class of Vehicle">
            <Input
              value={form.classOfVehicle}
              onChange={set("classOfVehicle")}
              className="h-9 text-sm"
              data-ocid="reg.class.input"
            />
          </Field>
          <Field label="Type of Body">
            <Input
              value={form.typeOfBody}
              onChange={set("typeOfBody")}
              className="h-9 text-sm"
              data-ocid="reg.body_type.input"
            />
          </Field>
          <Field label="Road Tax paid up to">
            <Input
              value={form.roadTaxPaidUpto}
              onChange={set("roadTaxPaidUpto")}
              className="h-9 text-sm"
              data-ocid="reg.road_tax.input"
            />
          </Field>
          <Field label="Registration Verified Physically">
            <SelectField
              value={form.registrationVerifiedPhysically}
              onChange={setSel("registrationVerifiedPhysically")}
              options={["Yes", "No"]}
            />
          </Field>
        </Section>

        <Section title="Vehicle Details">
          <Field label="Model of the Asset">
            <Input
              value={form.modelOfAsset}
              onChange={set("modelOfAsset")}
              className="h-9 text-sm"
              data-ocid="vehicle.model.input"
            />
          </Field>
          <Field label="No. of Cylinders">
            <Input
              value={form.noOfCylinders}
              onChange={set("noOfCylinders")}
              className="h-9 text-sm"
              data-ocid="vehicle.cylinders.input"
            />
          </Field>
          <Field label="Horse Power">
            <Input
              value={form.horsePower}
              onChange={set("horsePower")}
              className="h-9 text-sm"
              data-ocid="vehicle.hp.input"
            />
          </Field>
          <Field label="Cubic Capacity">
            <Input
              value={form.cubicCapacity}
              onChange={set("cubicCapacity")}
              className="h-9 text-sm"
              data-ocid="vehicle.cc.input"
            />
          </Field>
          <Field label="Fuel Used">
            <Input
              value={form.fuelUsed}
              onChange={set("fuelUsed")}
              className="h-9 text-sm"
              data-ocid="vehicle.fuel.input"
            />
          </Field>
          <Field label="Transmission">
            <Input
              value={form.transmission}
              onChange={set("transmission")}
              className="h-9 text-sm"
              data-ocid="vehicle.transmission.input"
            />
          </Field>
        </Section>

        <Section title="Inspection Remarks">
          <Field label="Appearance">
            <SelectField
              value={form.appearance}
              onChange={setSel("appearance")}
              options={["Normal", "Good", "Average", "Poor"]}
            />
          </Field>
          <Field label="Ignition">
            <SelectField
              value={form.ignition}
              onChange={setSel("ignition")}
              options={["Smooth Working", "Working", "Average", "Not Working"]}
            />
          </Field>
          <Field label="Gear Shifting">
            <SelectField
              value={form.gearShifting}
              onChange={setSel("gearShifting")}
              options={["Normal", "Average", "Poor"]}
            />
          </Field>
          <Field label="Battery">
            <SelectField
              value={form.battery}
              onChange={setSel("battery")}
              options={["Normal", "Average", "Weak", "Dead"]}
            />
          </Field>
          <Field label="H.Light, Ind Light, P.Light, Warning, Switches">
            <SelectField
              value={form.lights}
              onChange={setSel("lights")}
              options={["Working", "Partially Working", "Not Working"]}
            />
          </Field>
          <Field label="Chassis / Frame">
            <SelectField
              value={form.chassisFrame}
              onChange={setSel("chassisFrame")}
              options={["Normal", "Average", "Damaged"]}
            />
          </Field>
          <Field label="Engine">
            <SelectField
              value={form.engine}
              onChange={setSel("engine")}
              options={["Normal", "Average", "Poor"]}
            />
          </Field>
          <Field label="Body (Internal / External)">
            <SelectField
              value={form.body}
              onChange={setSel("body")}
              options={["Good", "Average", "Poor", "Damaged"]}
            />
          </Field>
          <Field label="Tyres">
            <SelectField
              value={form.tyres}
              onChange={setSel("tyres")}
              options={["Good", "Average", "Worn Out", "Bald"]}
            />
          </Field>
          <Field label="Upholstery">
            <SelectField
              value={form.upholstery}
              onChange={setSel("upholstery")}
              options={["Good", "Average", "Poor", "Not Mounted"]}
            />
          </Field>
        </Section>

        <Section title="Details of Accessories Fitted">
          <Field label="Music System">
            <SelectField
              value={form.musicSystem}
              onChange={setSel("musicSystem")}
              options={["Mounted", "Not Mounted"]}
            />
          </Field>
          <Field label="Spare Wheel">
            <SelectField
              value={form.spareWheel}
              onChange={setSel("spareWheel")}
              options={["Ok", "Not Available", "Damaged"]}
            />
          </Field>
          <Field label="Tools (Jack, Jack Lever etc.)">
            <SelectField
              value={form.tools}
              onChange={setSel("tools")}
              options={["Ok", "Incomplete", "Not Available"]}
            />
          </Field>
        </Section>

        <Section title="Insurance Details">
          <Field label="Insurer Name">
            <Input
              value={form.insurerName}
              onChange={set("insurerName")}
              className="h-9 text-sm"
              data-ocid="insurance.insurer.input"
            />
          </Field>
          <Field label="IDV &amp; Validity of Insurance">
            <Input
              value={form.idvValidity}
              onChange={set("idvValidity")}
              className="h-9 text-sm"
              data-ocid="insurance.idv.input"
            />
          </Field>
          <Field label="Policy / Cover Note No.">
            <Input
              value={form.policyNo}
              onChange={set("policyNo")}
              className="h-9 text-sm"
              data-ocid="insurance.policy_no.input"
            />
          </Field>
          <Field label="Vehicle Met with Accident if any">
            <Input
              value={form.accidentHistory}
              onChange={set("accidentHistory")}
              className="h-9 text-sm"
              data-ocid="insurance.accident.input"
            />
          </Field>
          <Field label="Major Repair undertaken if any">
            <Input
              value={form.majorRepair}
              onChange={set("majorRepair")}
              className="h-9 text-sm"
              data-ocid="insurance.repair.input"
            />
          </Field>
          <Field label="Use &amp; Maintenance of Vehicle">
            <SelectField
              value={form.useMaintenance}
              onChange={setSel("useMaintenance")}
              options={["Good", "Average", "Poor"]}
            />
          </Field>
        </Section>

        {/* Valuation Amount */}
        <div className="p-4 bg-card border-2 border-primary rounded-lg mb-6">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
            Valuation as on Date of Inspection
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">₹</span>
            <Input
              value={form.valuationAmount}
              onChange={set("valuationAmount")}
              placeholder="0"
              type="number"
              className="text-2xl font-bold h-12 border-0 border-b-2 border-primary rounded-none focus-visible:ring-0 px-0"
              data-ocid="valuation.amount.input"
            />
          </div>
          {form.valuationAmount && (
            <div className="text-sm text-muted-foreground mt-1">
              ₹ {Number(form.valuationAmount).toLocaleString("en-IN")}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mb-8">
          <Button
            variant="outline"
            onClick={onBack}
            data-ocid="editor.back_bottom_button"
          >
            Back to Dashboard
          </Button>
          <Button onClick={onPreview} data-ocid="editor.preview_bottom_button">
            <Eye size={14} className="mr-1" /> Preview &amp; Print
          </Button>
        </div>
      </main>
    </div>
  );
}
