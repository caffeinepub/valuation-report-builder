export interface VehicleReport {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "complete";

  // Header
  valuationNo: string;
  agencyName: string;

  // Inspection Details
  valuatorName: string;
  inspectionDateTime: string;
  placeOfInspection: string;

  // Registration Details
  ownerAddress: string;
  hypo: string;
  ownershipTransfer: string;
  registrationNumber: string;
  dateOfRegistrationPurchase: string;
  chassisNumber: string;
  engineNumber: string;
  odometerHourMeter: string;
  makeModel: string;
  colour: string;
  manufacturingYear: string;
  classOfVehicle: string;
  typeOfBody: string;
  roadTaxPaidUpto: string;
  registrationVerifiedPhysically: string;

  // Vehicle Details
  modelOfAsset: string;
  noOfCylinders: string;
  horsePower: string;
  cubicCapacity: string;
  fuelUsed: string;
  transmission: string;

  // Inspection Remarks
  appearance: string;
  ignition: string;
  gearShifting: string;
  battery: string;
  lights: string;
  chassisFrame: string;
  engine: string;
  body: string;
  tyres: string;
  upholstery: string;

  // Accessories
  musicSystem: string;
  spareWheel: string;
  tools: string;

  // Insurance Details
  insurerName: string;
  idvValidity: string;
  policyNo: string;
  accidentHistory: string;
  majorRepair: string;
  useMaintenance: string;

  // Valuation
  valuationAmount: string;
}

export type ReportField = keyof VehicleReport;
