// Form field type definitions for all categories

export interface BaseFormData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  what_happened: string;
  additional_details: string;
}

export interface ParkingFormData extends BaseFormData {
  pcn_number: string;
  vehicle_registration: string;
  incident_date: string;
  issue_date: string;
  location: string;
  issuing_authority: string;
  deadline_date: string;
  main_grounds: string;
}

export interface RefundFormData extends BaseFormData {
  company_name: string;
  order_number: string;
  purchase_date: string;
  product_name: string;
  amount_paid: string;
  payment_method: string;
  refund_requested_date: string;
  main_problem: string;
}

export interface LandlordFormData extends BaseFormData {
  rental_address: string;
  landlord_name: string;
  tenancy_start_date: string;
  issue_start_date: string;
  main_issue_type: string;
  previously_reported: string;
  previous_report_date: string;
}

export interface UtilityFormData extends BaseFormData {
  utility_provider: string;
  account_number: string;
  bill_reference: string;
  issue_date: string;
  complaint_type: string;
  amount_disputed: string;
  previous_complaint: string;
}

export interface EmployerFormData extends BaseFormData {
  employer_name: string;
  job_title: string;
  manager_name: string;
  employment_start_date: string;
  incident_date: string;
  issue_type: string;
}

export interface ConsumerFormData extends BaseFormData {
  trader_name: string;
  order_reference: string;
  purchase_date: string;
  item_service: string;
  amount_paid: string;
  problem_type: string;
}

export type FormData =
  | ParkingFormData
  | RefundFormData
  | LandlordFormData
  | UtilityFormData
  | EmployerFormData
  | ConsumerFormData;

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  aiExtractable?: boolean;
}

export const baseFields: FormField[] = [
  { name: 'full_name', label: 'Full Name', type: 'text', placeholder: 'John Smith', required: true, aiExtractable: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john.smith@email.com', required: true, aiExtractable: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '07700 900000', required: true, aiExtractable: true },
  { name: 'address', label: 'Address', type: 'text', placeholder: '123 High Street, London', required: true, aiExtractable: true },
  { name: 'postcode', label: 'Postcode', type: 'text', placeholder: 'SW1A 1AA', required: true, aiExtractable: true },
];

export const categoryFields: Record<string, FormField[]> = {
  parking: [
    { name: 'pcn_number', label: 'PCN Number', type: 'text', placeholder: 'PCN123456789', required: true, aiExtractable: true },
    { name: 'vehicle_registration', label: 'Vehicle Registration', type: 'text', placeholder: 'AB12 CDE', required: true, aiExtractable: true },
    { name: 'incident_date', label: 'Incident Date', type: 'date', required: true, aiExtractable: true },
    { name: 'issue_date', label: 'Issue Date', type: 'date', required: false, aiExtractable: true },
    { name: 'location', label: 'Location', type: 'text', placeholder: 'High Street Car Park, London', required: true, aiExtractable: true },
    { name: 'issuing_authority', label: 'Issuing Authority', type: 'text', placeholder: 'Council name or parking company', required: true, aiExtractable: true },
    { name: 'deadline_date', label: 'Deadline to Pay/Respond', type: 'date', required: false, aiExtractable: true },
    { name: 'main_grounds', label: 'Main Grounds of Appeal', type: 'textarea', placeholder: 'Briefly state your main reason for appeal', required: true },
  ],
  refund: [
    { name: 'company_name', label: 'Company/Retailer Name', type: 'text', placeholder: 'Company Ltd', required: true, aiExtractable: true },
    { name: 'order_number', label: 'Order/Reference Number', type: 'text', placeholder: 'ORD-123456', required: true, aiExtractable: true },
    { name: 'purchase_date', label: 'Purchase Date', type: 'date', required: true, aiExtractable: true },
    { name: 'product_name', label: 'Product/Service Name', type: 'text', placeholder: 'Product description', required: true, aiExtractable: true },
    { name: 'amount_paid', label: 'Amount Paid', type: 'text', placeholder: '£99.99', required: true, aiExtractable: true },
    { name: 'payment_method', label: 'Payment Method', type: 'text', placeholder: 'Credit card, PayPal, etc.', required: false, aiExtractable: true },
    { name: 'refund_requested_date', label: 'Date Refund Requested', type: 'date', required: false, aiExtractable: true },
    { name: 'main_problem', label: 'Main Problem', type: 'textarea', placeholder: 'Describe the main issue', required: true },
  ],
  landlord: [
    { name: 'rental_address', label: 'Rental Property Address', type: 'text', placeholder: 'Flat 1, 123 Street, City', required: true, aiExtractable: true },
    { name: 'landlord_name', label: 'Landlord/Letting Agent Name', type: 'text', placeholder: 'Name or company', required: true, aiExtractable: true },
    { name: 'tenancy_start_date', label: 'Tenancy Start Date', type: 'date', required: false, aiExtractable: true },
    { name: 'issue_start_date', label: 'Date Issue Started', type: 'date', required: true, aiExtractable: true },
    { name: 'main_issue_type', label: 'Main Issue Type', type: 'select', required: true,
      options: ['Repairs', 'Damp/Mould', 'Heating/Hot Water', 'Safety', 'Pest', 'Leak', 'Deposit', 'Harassment', 'Other'] },
    { name: 'previously_reported', label: 'Previously Reported?', type: 'select', required: true, options: ['Yes', 'No'] },
    { name: 'previous_report_date', label: 'Date Previously Reported', type: 'date', required: false, aiExtractable: true },
  ],
  utility: [
    { name: 'utility_provider', label: 'Utility Provider', type: 'text', placeholder: 'British Gas, Thames Water, etc.', required: true, aiExtractable: true },
    { name: 'account_number', label: 'Account Number', type: 'text', placeholder: 'ACC123456', required: true, aiExtractable: true },
    { name: 'bill_reference', label: 'Bill/Reference Number', type: 'text', placeholder: 'BILL-123456', required: false, aiExtractable: true },
    { name: 'issue_date', label: 'Issue Date', type: 'date', required: true, aiExtractable: true },
    { name: 'complaint_type', label: 'Complaint Type', type: 'select', required: true,
      options: ['Incorrect Bill', 'Overcharged', 'Meter Problem', 'Poor Service', 'Service Interruption', 'Account Error', 'Other'] },
    { name: 'amount_disputed', label: 'Amount Disputed (if relevant)', type: 'text', placeholder: '£50.00', required: false, aiExtractable: true },
    { name: 'previous_complaint', label: 'Previous Complaint Made?', type: 'select', required: true, options: ['Yes', 'No'] },
  ],
  employer: [
    { name: 'employer_name', label: 'Employer/Company Name', type: 'text', placeholder: 'Company Ltd', required: true, aiExtractable: true },
    { name: 'job_title', label: 'Job Title', type: 'text', placeholder: 'Your position', required: true, aiExtractable: true },
    { name: 'manager_name', label: 'Manager/HR Name', type: 'text', placeholder: 'Name if known', required: false, aiExtractable: true },
    { name: 'employment_start_date', label: 'Employment Start Date', type: 'date', required: false, aiExtractable: true },
    { name: 'incident_date', label: 'Incident Date', type: 'date', required: true, aiExtractable: true },
    { name: 'issue_type', label: 'Issue Type', type: 'select', required: true,
      options: ['Unpaid Wages', 'Holiday Pay', 'Unfair Treatment', 'Discrimination', 'Harassment', 'Contract Issue', 'Dismissal', 'Disciplinary', 'Safety', 'Other'] },
  ],
  consumer: [
    { name: 'trader_name', label: 'Trader/Business Name', type: 'text', placeholder: 'Shop or business name', required: true, aiExtractable: true },
    { name: 'order_reference', label: 'Order/Reference Number', type: 'text', placeholder: 'ORD-123456', required: true, aiExtractable: true },
    { name: 'purchase_date', label: 'Purchase Date', type: 'date', required: true, aiExtractable: true },
    { name: 'item_service', label: 'Item/Service', type: 'text', placeholder: 'Product or service description', required: true, aiExtractable: true },
    { name: 'amount_paid', label: 'Amount Paid', type: 'text', placeholder: '£99.99', required: true, aiExtractable: true },
    { name: 'problem_type', label: 'Problem Type', type: 'select', required: true,
      options: ['Faulty Goods', 'Not as Described', 'Poor Service', 'Late Delivery', 'No Refund', 'Trader Refusing', 'Hidden Charges', 'Other'] },
  ],
};

export const commonFields: FormField[] = [
  { name: 'what_happened', label: 'What Happened', type: 'textarea', placeholder: 'Describe what happened in your own words', required: true },
  { name: 'additional_details', label: 'Additional Details', type: 'textarea', placeholder: 'Any supporting facts or additional information', required: false },
];
