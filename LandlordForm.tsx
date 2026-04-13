import { GenericForm } from './GenericForm';

export function LandlordForm() {
  return (
    <GenericForm
      type="landlord"
      icon="🏠"
      title="Landlord Complaint"
      fields={{
        step1: [
          { label: 'Full Name', field: 'full_name', required: true },
          { label: 'Email', field: 'email', type: 'email', required: true },
          { label: 'Phone', field: 'phone', type: 'tel' },
          { label: 'Property Address', field: 'property_address', required: true }
        ],
        step2: [
          { label: 'Landlord Name', field: 'landlord_name', required: true },
          { label: 'Landlord Address', field: 'landlord_address' },
          { label: 'Tenancy Start Date', field: 'tenancy_start', type: 'date', required: true },
          { label: 'Issue Type', field: 'issue_type', required: true }
        ],
        step3: [
          { label: 'Issue Description', field: 'issue_description', textarea: true, required: true },
          { label: 'Previous Reports', field: 'previous_reports', textarea: true },
          { label: 'Impact on You', field: 'impact', textarea: true }
        ]
      }}
    />
  );
}
