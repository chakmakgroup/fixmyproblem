import { GenericForm } from './GenericForm';

export function ConsumerForm() {
  return (
    <GenericForm
      type="consumer"
      icon="🛡️"
      title="Consumer Rights"
      fields={{
        step1: [
          { label: 'Full Name', field: 'full_name', required: true },
          { label: 'Email', field: 'email', type: 'email', required: true },
          { label: 'Phone', field: 'phone', type: 'tel' },
          { label: 'Address', field: 'address', required: true },
          { label: 'Postcode', field: 'postcode', required: true }
        ],
        step2: [
          { label: 'Business Name', field: 'business_name', required: true },
          { label: 'Business Address', field: 'business_address' },
          { label: 'Purchase/Service Date', field: 'purchase_date', type: 'date', required: true },
          { label: 'Amount Paid (£)', field: 'amount', type: 'number', required: true },
          { label: 'Reference Number', field: 'reference' }
        ],
        step3: [
          { label: 'Issue Type', field: 'issue_type', required: true },
          { label: 'Description', field: 'description', textarea: true, required: true },
          { label: 'Issue Description', field: 'issue_description', textarea: true, required: true },
          { label: 'Additional Details', field: 'additional_details', textarea: true },
          { label: 'Remedy Requested', field: 'remedy_requested', textarea: true }
        ]
      }}
    />
  );
}
