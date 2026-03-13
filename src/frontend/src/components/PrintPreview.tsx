import React from "react";
import type { VehicleReport } from "../types";
import { Letterhead } from "./Letterhead";

interface PrintPreviewProps {
  report: VehicleReport;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border border-gray-400">
      <td className="border border-gray-400 px-2 py-1 text-xs font-semibold text-gray-800 w-2/5 bg-gray-50">
        {label}
      </td>
      <td className="border border-gray-400 px-2 py-1 text-xs text-gray-900">
        {value || "—"}
      </td>
    </tr>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <tr>
      <td
        colSpan={2}
        className="bg-gray-200 border border-gray-400 px-2 py-1 text-xs font-bold text-gray-900 uppercase tracking-wide"
      >
        {title}
      </td>
    </tr>
  );
}

export function PrintPreview({ report }: PrintPreviewProps) {
  return (
    <div
      className="bg-white text-gray-900 font-sans"
      style={{ fontFamily: "Arial, sans-serif", fontSize: "12px" }}
    >
      <Letterhead />

      {/* Title */}
      <div className="text-center mb-3">
        <span className="text-base font-bold underline tracking-widest uppercase">
          VALUATION REPORT
        </span>
      </div>

      {/* Header Fields */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <tr className="border border-gray-400">
            <td className="border border-gray-400 px-2 py-1 text-xs font-semibold bg-gray-50 w-2/5">
              VALUATION NO.
            </td>
            <td className="border border-gray-400 px-2 py-1 text-xs w-1/10">
              {report.valuationNo || "—"}
            </td>
            <td className="border border-gray-400 px-2 py-1 text-xs font-semibold bg-gray-50 w-2/5">
              NAME OF AGENCY
            </td>
            <td className="border border-gray-400 px-2 py-1 text-xs">
              {report.agencyName || "—"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Inspection Details */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <SectionHeader title="Inspection Details" />
          <Row label="Valuer Name" value={report.valuatorName} />
          <Row
            label="Date &amp; Time of Inspection"
            value={report.inspectionDateTime}
          />
          <Row label="Place of Inspection" value={report.placeOfInspection} />
        </tbody>
      </table>

      {/* Registration Details */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <SectionHeader title="Registration Details" />
          <Row
            label="Registered Owner &amp; Address"
            value={report.ownerAddress}
          />
          <Row label="Hypo." value={report.hypo} />
          <Row label="Ownership Transfer" value={report.ownershipTransfer} />
          <Row label="Registration Number" value={report.registrationNumber} />
          <Row
            label="Date of Registration &amp; Purchase"
            value={report.dateOfRegistrationPurchase}
          />
          <Row label="Chassis Number" value={report.chassisNumber} />
          <Row label="Engine Number" value={report.engineNumber} />
          <Row label="Odometer / Hour Meter" value={report.odometerHourMeter} />
          <Row label="Make &amp; Model" value={report.makeModel} />
          <Row label="Colour" value={report.colour} />
          <Row label="Manufacturing Year" value={report.manufacturingYear} />
          <Row label="Class of Vehicle" value={report.classOfVehicle} />
          <Row label="Type of Body" value={report.typeOfBody} />
          <Row label="Road Tax paid up to" value={report.roadTaxPaidUpto} />
          <Row
            label="Registration Verified Physically"
            value={report.registrationVerifiedPhysically}
          />
        </tbody>
      </table>

      {/* Vehicle Details */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <SectionHeader title="Vehicle Details" />
          <Row label="Model of the Asset" value={report.modelOfAsset} />
          <Row label="No. of Cylinders" value={report.noOfCylinders} />
          <Row label="Horse Power" value={report.horsePower} />
          <Row label="Cubic Capacity" value={report.cubicCapacity} />
          <Row label="Fuel Used" value={report.fuelUsed} />
          <Row label="Transmission" value={report.transmission} />
        </tbody>
      </table>

      {/* Inspection Remarks */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <SectionHeader title="Inspection Remarks" />
          <Row label="Appearance" value={report.appearance} />
          <Row label="Ignition" value={report.ignition} />
          <Row label="Gear Shifting" value={report.gearShifting} />
          <Row label="Battery" value={report.battery} />
          <Row
            label="H.Light, Ind Light, P.Light, Warning, Switches"
            value={report.lights}
          />
          <Row label="Chassis / Frame" value={report.chassisFrame} />
          <Row label="Engine" value={report.engine} />
          <Row label="Body (Internal / External)" value={report.body} />
          <Row label="Tyres" value={report.tyres} />
          <Row label="Upholstery" value={report.upholstery} />
        </tbody>
      </table>

      {/* Accessories */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <SectionHeader title="Details of Accessories Fitted" />
          <Row label="Music System" value={report.musicSystem} />
          <Row label="Spare Wheel" value={report.spareWheel} />
          <Row label="Tools (Jack, Jack Lever etc.)" value={report.tools} />
        </tbody>
      </table>

      {/* Insurance Details */}
      <table className="w-full border-collapse mb-2">
        <tbody>
          <SectionHeader title="Insurance Details" />
          <Row label="Insurer Name" value={report.insurerName} />
          <Row
            label="IDV &amp; Validity of Insurance"
            value={report.idvValidity}
          />
          <Row label="Policy / Cover Note No." value={report.policyNo} />
          <Row
            label="Vehicle Met with Accident if any"
            value={report.accidentHistory}
          />
          <Row
            label="Major Repair undertaken if any"
            value={report.majorRepair}
          />
          <Row
            label="Use &amp; maintenance of Vehicle"
            value={report.useMaintenance}
          />
        </tbody>
      </table>

      {/* Valuation */}
      <table className="w-full border-collapse mb-4">
        <tbody>
          <tr className="border border-gray-400">
            <td className="border border-gray-400 px-2 py-2 text-sm font-bold bg-gray-100 w-2/5">
              Valuation as on Date of Inspection
            </td>
            <td className="border border-gray-400 px-2 py-2 text-base font-bold text-green-800">
              {report.valuationAmount
                ? `₹ ${Number(report.valuationAmount).toLocaleString("en-IN")}`
                : "—"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Signature Block */}
      <div className="flex justify-end mt-6">
        <div className="text-right text-xs border border-gray-400 px-4 py-3">
          <div className="font-bold text-sm">DINESH KUMAR JANGIR</div>
          <div>Surveyor &amp; Loss Assessor</div>
          <div>
            Surveyor &amp; Loss Assessor of Motors, Misc. &amp; Engineering
          </div>
        </div>
      </div>
    </div>
  );
}
