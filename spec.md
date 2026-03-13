# Vehicle Valuation Report Builder

## Current State
App has a property/business valuation report format with 10 sections. Needs to be completely replaced with a vehicle valuation format.

## Requested Changes (Diff)

### Add
- Vehicle-specific valuation report form matching the PDF format
- Letterhead header: DINESH KUMAR JANGIR, Surveyor & Loss Assessor of Motors, Misc. & Engineering
- Licence no. SLA/121529, Valid upto 26th Jan. 2029, Address: 3-B-19/1, Tilak Nagar, BHILWARA - 311 001, Mobile: 094132 24766, email: dk24766@gmail.com
- Sections: Inspection Details, Registration Details, Vehicles Details, Inspection Remarks, Details of Accessories, Insurance & Valuation
- All fields from PDF format
- Print-ready preview matching the PDF layout exactly

### Modify
- Replace existing report sections with vehicle valuation sections
- Dashboard to show vehicle reports with Valuation No. and Agency Name

### Remove
- Property/business specific fields and sections
- Income approach, cost approach, market approach sections
- Executive summary, methodology sections

## Implementation Plan
1. Replace App.tsx completely with vehicle valuation app
2. Dashboard: list reports with Valuation No., Agency, date
3. Report Editor: form with all sections from PDF
4. Print Preview: letterhead + all sections in two-column layout matching PDF
5. Inspection Remarks fields with dropdown options (Normal/Average/Working/etc)
6. Accessories section with checkboxes/dropdowns
7. Insurance fields and final Valuation field
8. Signature block at bottom: DINESH KUMAR JANGIR, Surveyor & Loss Assessor
