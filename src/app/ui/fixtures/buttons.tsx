"use client";

import { useState } from "react";
import { deleteFixture } from "@/app/lib/actions/fixtures";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function DeleteFixtureButton({ id, compact = false }: { id: string, compact?: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteAction() {
    try {
      setIsDeleting(true);
      
      // Show pending toast
      const toastId = toast.loading("Deleting fixture...");
      
      // Call the server action
      const result = await deleteFixture(id);
      
      if (result.success) {
        toast.success(result.message || "Fixture deleted successfully", { id: toastId });
        
        // Refresh the router to reflect the changes
        router.refresh();
        
        // If on the detail page, redirect to the fixtures list after successful deletion
        if (window.location.pathname.includes(`/fixtures/${id}`)) {
          router.push('/fixtures');
        }
      } else {
        toast.error(result.message || "Failed to delete fixture", { id: toastId });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete action error:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <form action={handleDeleteAction} className={compact ? "inline-block" : ""}>
      <button
        type="submit"
        disabled={isDeleting}
        className={`inline-flex items-center ${
          compact 
            ? "px-2 py-1 text-xs ml-2" 
            : "px-4 py-2 text-sm"
        } font-medium text-white ${
          isDeleting ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
        } border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
        aria-label="Delete fixture"
      >
        {isDeleting 
          ? "Deleting..." 
          : compact ? "Delete" : "Delete Fixture"
        }
      </button>
    </form>
  );
}