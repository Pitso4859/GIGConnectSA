import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import AppLayout from './components/layout/AppLayout';

// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// App pages
import DashboardPage  from './pages/dashboard/DashboardPage';
import JobsPage       from './pages/jobs/JobsPage';
import JobDetailPage  from './pages/jobs/JobDetailPage';
import PostJobPage    from './pages/jobs/PostJobPage';
import MyJobsPage     from './pages/jobs/MyJobsPage';
import WalletPage     from './pages/wallet/WalletPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import AiChatPage     from './pages/ai/AiChatPage';
import ProfilePage    from './pages/profile/ProfilePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace/>;
}

function ClientRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  return user?.role === 'CLIENT' || user?.role === 'ADMIN' ? <>{children}</> : <Navigate to="/dashboard" replace/>;
}

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>

          {/* Protected */}
          <Route path="/" element={<PrivateRoute><AppLayout/></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace/>}/>
            <Route path="dashboard"   element={<DashboardPage/>}/>
            <Route path="jobs"        element={<JobsPage/>}/>
            <Route path="jobs/my"     element={<MyJobsPage/>}/>
            <Route path="jobs/:id"    element={<JobDetailPage/>}/>
            <Route path="post-job"    element={<ClientRoute><PostJobPage/></ClientRoute>}/>
            <Route path="wallet"      element={<WalletPage/>}/>
            <Route path="leaderboard" element={<LeaderboardPage/>}/>
            <Route path="ai"          element={<AiChatPage/>}/>
            <Route path="profile"     element={<ProfilePage/>}/>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
        </Routes>
      </BrowserRouter>
  );
}