import { GenericForm } from './GenericForm';

export function EmployerForm() {
  return (
    <GenericForm
      type="employer"
      icon="💼"
      title="Employer Issue"
      fields={{
        step1: [
          { label: 'Full Name', field: 'full_name', required: true },
          { label: 'Email', field: 'email', type: 'email', required: true },
          { label: 'Phone', field: 'phone', type: 'tel' },
          { label: 'Address', field: 'address', required: true },
          { label: 'Postcode', field: 'postcode', required: true }
        ],
        step2: [
          { label: 'Company Name', field: 'company_name', required: true },
          { label: 'Company Address', field: 'company_address' },
          { label: 'Recipient Name', field: 'recipient_name', required: true },
          { label: 'Employee ID', field: 'employee_id' },
          { label: 'Grievance Type', field: 'grievance_type', required: true }
        ],
        step3: [
          { label: 'Grievance Description', field: 'grievance_description', textarea: true, required: true },
          { label: 'Background', field: 'background', textarea: true },
          { label: 'Impact', field: 'impact', textarea: true },
          { label: 'Informal Attempts to Resolve', field: 'informal_attempts', textarea: true }
        ]
      }}
    />
  );
}
