import { HardDrive, Plus } from 'lucide-react';
import { DashboardLayout } from '../../components/DashboardLayout';

export function DashboardDocuments() {
  return (
    <DashboardLayout title="Documents">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Documents</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Evidence files and uploaded documents for your cases.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 border border-white/10 text-sm font-semibold text-white hover:bg-white/12 transition-all flex-shrink-0">
            <Plus className="w-4 h-4" />
            Upload document
          </button>
        </div>

        <div className="text-center py-16 bg-[#0D1728] border border-white/8 rounded-2xl">
          <HardDrive className="w-12 h-12 text-[#334155] mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No documents yet</h3>
          <p className="text-sm text-[#64748B] mb-5 max-w-xs mx-auto">
            Upload evidence, receipts, photos, or correspondence related to your cases. Files are stored securely and can be attached to letters.
          </p>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F7DF3] to-[#14B8A6] text-sm font-semibold text-white hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" />
            Upload your first document
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
