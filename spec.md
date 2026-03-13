# Valuation Report Builder

## Current State
New project with no existing implementation.

## Requested Changes (Diff)

### Add
- Dashboard page listing all reports with status (draft/complete), type, client name, date, and actions (open, delete)
- Report editor with multi-section tabbed form:
  1. Report Header: report number, date, client name, client address, appraiser name, appraiser license, firm name, effective date
  2. Executive Summary: purpose of appraisal, scope of work, value type, brief summary text
  3. Subject Details: property/business name, address, legal description, ownership, year built/established, size/area, zoning/industry, current use
  4. Methodology: approaches used (checkboxes: income, cost, market/sales comparison), rationale for each, data sources
  5. Market Analysis: market area description, supply/demand factors, market trends, economic conditions, market conditions conclusion
  6. Comparable Sales/Transactions: table of comparables (address/name, sale date, sale price, size, price per unit, adjustments, adjusted value)
  7. Valuation Approaches:
     - Income Approach: potential gross income, vacancy, effective gross income, operating expenses, NOI, cap rate, indicated value
     - Cost Approach: land value, improvement cost new, depreciation, depreciated improvement value, indicated value
     - Market/Sales Approach: comparable analysis, adjustments summary, reconciled value
  8. Final Value Conclusion: reconciliation narrative, final value opinion, value date, value type
  9. Assumptions & Limiting Conditions: list of standard and custom conditions
  10. Appraiser Certification: certification statement, appraiser signature block, date signed, license number, designation
- Report preview mode: formatted, print-ready view of completed report
- Print/Export button triggering browser print dialog (print-optimized CSS)
- Reports stored in backend with CRUD operations
- Sample reports pre-loaded

### Modify
N/A (new project)

### Remove
N/A

## Implementation Plan
1. Backend: Motoko actor with Report type covering all sections as nested records, CRUD functions (createReport, getReport, listReports, updateReport, deleteReport), auto-incrementing report IDs
2. Frontend Dashboard: report cards with metadata, create new button, delete confirmation
3. Frontend Report Editor: multi-section sidebar navigation, form inputs per section, auto-save on field change
4. Frontend Report Preview: styled print layout rendering all sections, print CSS media query
5. Navigation between dashboard, editor, and preview views
