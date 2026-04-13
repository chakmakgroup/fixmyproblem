import { GenericForm } from './GenericForm';

export function UtilityForm() {
  return (
    <GenericForm
      type="utility"
      icon="⚡"
      title="Utility Complaint"
      fields={{
        step1: [
          { label: 'Full Name', field: 'full_name', required: true },
          { label: 'Email', field: 'email', type: 'email', required: true },
          { label: 'Phone', field: 'phone', type: 'tel' },
          { label: 'Address', field: 'address', required: true },
          { label: 'Postcode', field: 'postcode', required: true }
        ],
        step2: [
          { label: 'Provider Name', field: 'provider_name', required: true },
          { label: 'Provider Address', field: 'provider_address' },
          { label: 'Account Number', field: 'account_number', required: true },
          { label: 'Utility Type', field: 'utility_type', required: true },
          { label: 'Complaint Type', field: 'complaint_type', required: true }
        ],
        step3: [
          { label: 'Issue Description', field: 'issue_description', textarea: true, required: true },
          { label: 'Timeline of Events', field: 'timeline', textarea: true },
          { label: 'Resolution Requested', field: 'resolution_requested', textarea: true }
        ]
      }}
    />
  );
}
