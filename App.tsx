import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { StartPage } from './pages/StartPage';
import { SmartForm } from './pages/SmartForm';
import { ResultPage } from './pages/ResultPage';
import { Success } from './pages/Success';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { PricingPage } from './pages/PricingPage';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { DashboardCases } from './pages/dashboard/DashboardCases';
import { DashboardLetters } from './pages/dashboard/DashboardLetters';
import { DashboardDocuments } from './pages/dashboard/DashboardDocuments';
import { DashboardBilling } from './pages/dashboard/DashboardBilling';
import { DashboardSettings } from './pages/dashboard/DashboardSettings';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSubscriptions } from './pages/admin/AdminSubscriptions';
import { AdminCases } from './pages/admin/AdminCases';
import { AdminLetters } from './pages/admin/AdminLetters';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="/form/:type" element={<SmartForm />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/success" element={<Success />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardOverview /></ProtectedRoute>} />
        <Route path="/dashboard/cases" element={<ProtectedRoute><DashboardCases /></ProtectedRoute>} />
        <Route path="/dashboard/letters" element={<ProtectedRoute><DashboardLetters /></ProtectedRoute>} />
        <Route path="/dashboard/documents" element={<ProtectedRoute><DashboardDocuments /></ProtectedRoute>} />
        <Route path="/dashboard/billing" element={<ProtectedRoute><DashboardBilling /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><DashboardSettings /></ProtectedRoute>} />

        <Route path="/admin" element={<AdminRoute><AdminOverview /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
        <Route path="/admin/cases" element={<AdminRoute><AdminCases /></AdminRoute>} />
        <Route path="/admin/letters" element={<AdminRoute><AdminLetters /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
