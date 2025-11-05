import React from "react";
import { motion } from "framer-motion";
import { LogOut, AlertTriangle } from "lucide-react";
import { db } from "../lib/supabase";
import { toast } from "sonner";

interface ImpersonationBannerProps {
  impersonationData: {
    targetUserId: string;
    targetUserEmail: string;
    targetUserName: string;
    timestamp: number;
  };
}

const ImpersonationBanner: React.FC<ImpersonationBannerProps> = ({
  impersonationData,
}) => {
  const handleExitImpersonation = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to return to admin mode?"
      );

      if (!confirmed) return;

      // Show loading toast
      toast.loading("Returning to admin mode...", { id: "exit-impersonation" });

      const { error } = await db.admin.exitImpersonation();

      // The exitImpersonation method now handles the redirect automatically
      // so we don't need to handle success here as the page will reload

      if (error) {
        console.error("Exit impersonation error:", error);
        toast.error(
          "Encountered an issue but attempting to return to admin mode...",
          { id: "exit-impersonation" }
        );
        // The method still tries to return to admin mode even on error
      }
    } catch (error: any) {
      console.error("Failed to exit impersonation:", error);
      toast.error(
        "Encountered an issue but attempting to return to admin mode...",
        { id: "exit-impersonation" }
      );

      // Fallback: manually try to return to admin mode
      localStorage.removeItem("isImpersonating");
      localStorage.setItem("isAdminSession", "true");
      window.location.href = "/admin/dashboard";
    }
  };

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white px-4 py-3 shadow-lg"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <span className="font-semibold">Admin Mode:</span>
            <span className="ml-2">
              You are viewing as{" "}
              <strong>{impersonationData.targetUserName}</strong> (
              {impersonationData.targetUserEmail})
            </span>
          </div>
        </div>

        <button
          onClick={handleExitImpersonation}
          className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Return to Admin</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ImpersonationBanner;
