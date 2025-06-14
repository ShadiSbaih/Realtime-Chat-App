import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const response = await axiosInstance.get("/auth/check");
            if (response.data.success && response.data.user) {
                set({ authUser: response.data.user });
                console.log("Authenticated user:", response.data.user);
            } else {
                set({ authUser: null });
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        const loadingToast = toast.loading("Creating your account...");

        try {
            const response = await axiosInstance.post("/auth/signup", data);
            set({ authUser: response.data.user });
            toast.dismiss(loadingToast);
            toast.success("Signup successful! Redirecting...");
        } catch (error) {
            console.error("Error during signup:", error);
            toast.dismiss(loadingToast);
            toast.error("Signup failed. Please try again.");
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        const loadingToast = toast.loading("Logging out...");

        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.dismiss(loadingToast);
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Error during logout:", error);
            toast.dismiss(loadingToast);
            toast.error("Logout failed. Please try again.");
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        const loadingToast = toast.loading("Signing you in...");

        try {
            const response = await axiosInstance.post("/auth/login", data);
            set({ authUser: response.data.user });
            toast.dismiss(loadingToast);
            toast.success("Login successful! Redirecting...");
        } catch (error) {
            console.error("Error during login:", error);
            toast.dismiss(loadingToast);
            toast.error("Login failed. Please check your credentials.");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        const loadingToast = toast.loading("Updating profile...");
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            if (res.data.success && res.data.user) {
                set({ authUser: res.data.user });
                toast.dismiss(loadingToast);
                toast.success("Profile updated successfully");
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.log("error in update profile:", error);
            toast.dismiss(loadingToast);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
}));