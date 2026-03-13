export interface ReportContent {
  header: {
    appraiserName: string;
    appraiserLicense: string;
    firmName: string;
    effectiveDate: string;
    clientAddress: string;
  };
  executiveSummary: {
    purpose: string;
    scopeOfWork: string;
    valueType: string;
    summaryText: string;
  };
  subjectDetails: {
    name: string;
    address: string;
    legalDescription: string;
    ownership: string;
    yearBuilt: string;
    size: string;
    zoningIndustry: string;
    currentUse: string;
  };
  methodology: {
    incomeApproach: boolean;
    costApproach: boolean;
    marketApproach: boolean;
    incomeRationale: string;
    costRationale: string;
    marketRationale: string;
    dataSources: string;
  };
  marketAnalysis: {
    marketAreaDescription: string;
    supplyDemandFactors: string;
    marketTrends: string;
    economicConditions: string;
    marketConclusion: string;
  };
  comparables: Array<{
    nameAddress: string;
    saleDate: string;
    salePrice: string;
    size: string;
    pricePerUnit: string;
    adjustments: string;
    adjustedValue: string;
  }>;
  incomeApproachData: {
    potentialGrossIncome: string;
    vacancyRate: string;
    effectiveGrossIncome: string;
    operatingExpenses: string;
    noi: string;
    capRate: string;
    indicatedValue: string;
  };
  costApproachData: {
    landValue: string;
    improvementCostNew: string;
    depreciation: string;
    depreciatedValue: string;
    indicatedValue: string;
  };
  marketApproachData: {
    comparableAnalysis: string;
    adjustmentsSummary: string;
    reconciledValue: string;
  };
  finalConclusion: {
    reconciliationNarrative: string;
    finalValueOpinion: string;
    valueDate: string;
    valueType: string;
  };
  assumptionsConditions: string[];
  certification: {
    certificationStatement: string;
    appraiserSignature: string;
    dateSigned: string;
    licenseNumber: string;
    designation: string;
  };
}

export const defaultContent = (): ReportContent => ({
  header: {
    appraiserName: "",
    appraiserLicense: "",
    firmName: "",
    effectiveDate: "",
    clientAddress: "",
  },
  executiveSummary: {
    purpose: "",
    scopeOfWork: "",
    valueType: "Market Value",
    summaryText: "",
  },
  subjectDetails: {
    name: "",
    address: "",
    legalDescription: "",
    ownership: "",
    yearBuilt: "",
    size: "",
    zoningIndustry: "",
    currentUse: "",
  },
  methodology: {
    incomeApproach: false,
    costApproach: false,
    marketApproach: true,
    incomeRationale: "",
    costRationale: "",
    marketRationale: "",
    dataSources: "",
  },
  marketAnalysis: {
    marketAreaDescription: "",
    supplyDemandFactors: "",
    marketTrends: "",
    economicConditions: "",
    marketConclusion: "",
  },
  comparables: [],
  incomeApproachData: {
    potentialGrossIncome: "",
    vacancyRate: "",
    effectiveGrossIncome: "",
    operatingExpenses: "",
    noi: "",
    capRate: "",
    indicatedValue: "",
  },
  costApproachData: {
    landValue: "",
    improvementCostNew: "",
    depreciation: "",
    depreciatedValue: "",
    indicatedValue: "",
  },
  marketApproachData: {
    comparableAnalysis: "",
    adjustmentsSummary: "",
    reconciledValue: "",
  },
  finalConclusion: {
    reconciliationNarrative: "",
    finalValueOpinion: "",
    valueDate: "",
    valueType: "Market Value",
  },
  assumptionsConditions: [
    "The appraisal is based on information believed to be reliable and correct.",
    "The appraiser assumes no responsibility for matters of legal nature.",
    "The information identified in this report as being furnished by others is believed to be reliable, but no warranty is given for its accuracy.",
  ],
  certification: {
    certificationStatement:
      "I certify that, to the best of my knowledge and belief: the statements of fact contained in this report are true and correct; the reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions and are my personal, impartial, and unbiased professional analyses, opinions, and conclusions.",
    appraiserSignature: "",
    dateSigned: "",
    licenseNumber: "",
    designation: "",
  },
});
