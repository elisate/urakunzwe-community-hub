import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Impact from "./pages/Impact";
import Team from "./pages/Team";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Donate from "./pages/Donate";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./dashboard/DashboardLayout";
import Dashboard from "./dashboard/pages/Dashboard";
import DashProgram from "./dashboard/pages/Program";
import DashImpact from "./dashboard/pages/Impact";
import DashTeam from "./dashboard/pages/Team";
import DashNews from "./dashboard/pages/News";
import DashContact from "./dashboard/pages/Contact";
import DashDonations from "./dashboard/pages/Donations";
import DashSuccessStories from "./dashboard/pages/SuccessStories";
import DashKeyAchievements from "./dashboard/pages/key-achievements";
import DashSettings from "./dashboard/pages/Settings";
import ProgramForm from "./dashboard/pages/forms/ProgramForm";
import TeamForm from "./dashboard/pages/forms/TeamForm";
import DonationForm from "./dashboard/pages/forms/DonationForm";
import NewsForm from "./dashboard/pages/forms/NewsForm";
import KeyAchievementForm from "./dashboard/pages/forms/KeyAchievementForm";
import ImpactForm from "./dashboard/pages/forms/ImpactForm";
import { AuthProvider, RequireAuth } from "./context/AuthContext";
import Login from "./pages/Login";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/team" element={<Team />} />
            <Route path="/news" element={<News />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route path="/admin" element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="program" element={<DashProgram />} />
              <Route path="impact" element={<DashImpact />} />
              <Route path="team" element={<DashTeam />} />
              <Route path="news" element={<DashNews />} />
              <Route path="contact" element={<DashContact />} />
              <Route path="donations" element={<DashDonations />} />
              <Route path="success-stories" element={<DashSuccessStories />} />
              <Route path="key-achievements" element={<DashKeyAchievements />} />
              <Route path="settings" element={<DashSettings />} />

              {/* Form Routes */}
              <Route path="program/new" element={<ProgramForm />} />
              <Route path="team/new" element={<TeamForm />} />
              <Route path="donations/new" element={<DonationForm />} />
              <Route path="news/new" element={<NewsForm />} />
              <Route path="key-achievements/new" element={<KeyAchievementForm />} />
              <Route path="key-achievements/edit/:id" element={<KeyAchievementForm />} />
              <Route path="impact/new" element={<ImpactForm />} />
              <Route path="impact/edit/:id" element={<ImpactForm />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
