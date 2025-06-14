import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"

function App() {
  // Get the current theme from the useThemeStore
  const { theme } = useThemeStore();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  // Check authentication status on initial load
  // This will call the checkAuth function from the useAuthStore
  // and update the authUser state accordingly
  // The isCheckingAuth state will be true while the checkAuth function is running
  // and false once the check is complete
  // If authUser is null, it means the user is not authenticated
  // If authUser is not null, it means the user is authenticated
  // If isCheckingAuth is true, it means the checkAuth function is still running
  // If isCheckingAuth is false, it means the checkAuth function has completed
  // If authUser is null and isCheckingAuth is false, it means the user is not authenticated    

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }


  return (
    <div data-theme={theme} >
      <Navbar />
      {/* Main content area */}
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App 
