"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface DeleteFacilityButtonProps {
  facilityId: string;
  facilityName: string;
}

export function DeleteFacilityButton({ facilityId, facilityName }: DeleteFacilityButtonProps) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm(`Delete ${facilityName}? This will hide it from customers.`)) {
      return;
    }

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/facilities/${facilityId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Facility deleted successfully",
        });
        router.refresh();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete facility",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
      onClick={handleDelete}
      disabled={deleting}
    >
      <Trash2 className="h-3 w-3 mr-1" />
      {deleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
