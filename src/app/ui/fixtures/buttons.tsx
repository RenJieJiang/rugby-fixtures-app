"use client";

import { useState } from "react";
import { deleteFixture } from "@/app/lib/actions/fixtures";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Tooltip from "./tooltip";

// ViewDetailsButton component
export function ViewDetailsButton({ id, teamNames, compact = false }: { id: string, teamNames: string, compact?: boolean }) {
  return (
    <div className={compact ? "inline-block" : ""}>
      <Tooltip text="View details">
        <Link
          href={`/fixtures/${id}`}
          aria-label={`View details for ${teamNames}`}
          className="inline-flex items-center justify-center rounded-md sm:border sm:border-gray-200 p-2 w-9 h-9 hover:cursor-pointer hover:bg-gray-100"
        >
          <span className="sr-only">View Details</span>
          <EyeIcon className="text-blue-500 w-5 h-5" />
        </Link>
      </Tooltip>
    </div>
  );
}

interface DeleteFixtureButtonProps {
  id: string;
  compact?: boolean;
  onSuccess?: () => void; // Optional callback
}

const toastStyles = {
  padding: "16px",
  borderRadius: "8px",
  background: "#fff",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

function ToastButton({
  onClick,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const baseClasses =
    "px-3 py-1.5 text-xs font-medium rounded-md hover:cursor-pointer";
  const variantClasses = {
    primary: "text-white bg-red-600 hover:bg-red-700",
    secondary: "text-gray-700 bg-gray-100 hover:bg-gray-200",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function DeleteFixtureButton({
  id,
  compact = false,
  onSuccess,
}: DeleteFixtureButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle the initial delete button click
  function handleDeleteClick() {
    // Show a confirmation toast with action buttons
    toast(
      (t) => (
        <div className="flex flex-col space-y-2">
          <div className="text-sm font-medium">
            Are you sure you want to delete this fixture?
          </div>
          <div className="flex justify-center space-x-2 pt-1 gap-4">
            <ToastButton
              variant="primary"
              onClick={() => {
                toast.dismiss(t.id);
                handleConfirmedDelete();
              }}
            >
              Yes, Delete
            </ToastButton>
            <ToastButton
              variant="secondary"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </ToastButton>
          </div>
        </div>
      ),
      {
        duration: 5000, // 5s
        position: "top-center",
        style: toastStyles,
      }
    );
  }

  // Handle the actual deletion after confirmation
  async function handleConfirmedDelete() {
    try {
      setIsDeleting(true);

      // Show pending toast
      const toastId = toast.loading("Deleting fixture...");

      // Call the server action
      const result = await deleteFixture(id);

      if (result.success) {
        toast.success(result.message || "Fixture deleted successfully", {
          id: toastId,
        });

        // Refresh the router to reflect the changes
        router.refresh();
        onSuccess?.();

        // If on the detail page, redirect to the fixtures list after successful deletion
        if (window.location.pathname.includes(`/fixtures/${id}`)) {
          router.push("/fixtures");
        }
      } else {
        toast.error(result.message || "Failed to delete fixture", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete action error:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={compact ? "inline-block" : ""}>
      <Tooltip text="Delete">
        <button
          type="button"
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="rounded-md sm:border sm:border-gray-200 p-2 hover:cursor-pointer hover:bg-gray-100"
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="text-red-500 w-5" />
        </button>
      </Tooltip>
    </div>
  );
}
