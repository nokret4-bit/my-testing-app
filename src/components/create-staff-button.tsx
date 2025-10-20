"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserPlus, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PERMISSIONS = [
  { key: "view_bookings", label: "View Bookings" },
  { key: "manage_bookings", label: "Manage Bookings" },
  { key: "view_facilities", label: "View Facilities" },
  { key: "manage_facilities", label: "Manage Facilities" },
  { key: "view_reports", label: "View Reports" },
  { key: "manage_pricing", label: "Manage Pricing" },
];

export function CreateStaffButton() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF",
    permissions: {} as Record<string, boolean>,
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Staff Created",
          description: `${formData.name} has been added successfully.`,
        });
        setShowForm(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "STAFF",
          permissions: {},
        });
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create staff account.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <Button onClick={() => setShowForm(true)}>
        <UserPlus className="h-4 w-4 mr-2" />
        Create Staff Account
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create Staff Account</CardTitle>
              <CardDescription>Add a new staff member or admin</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                disabled={loading}
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {formData.role === "STAFF" && (
              <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="space-y-2">
                  {PERMISSIONS.map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between">
                      <Label htmlFor={perm.key} className="cursor-pointer">
                        {perm.label}
                      </Label>
                      <Switch
                        id={perm.key}
                        checked={formData.permissions[perm.key] || false}
                        onCheckedChange={(checked) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, [perm.key]: checked },
                          })
                        }
                        disabled={loading}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
