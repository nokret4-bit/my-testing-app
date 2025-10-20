"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type FacilityType = { id: string; name: string };

export default function NewFacilityPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
  const [form, setForm] = useState({
    name: "",
    kind: "ROOM",
    description: "",
    capacity: 1,
    price: 0,
    photos: [] as string[],
    amenities: [] as string[],
    isActive: true,
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Fetch facility types (derived from existing types table)
    fetch("/api/admin/facilities")
      .then(() => fetch("/api/facilities"))
      .catch(() => null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create facility");
      }

      toast({ title: "Facility created" });
      router.push("/admin/facilities");
      router.refresh();
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const base64Images: string[] = [];
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        base64Images.push(base64);
      }
      setForm((f) => ({ ...f, photos: [...f.photos, ...base64Images] }));
      toast({ title: "Uploaded", description: `${base64Images.length} file(s) uploaded` });
    } catch (err) {
      toast({ title: "Upload error", description: (err as Error).message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>New Facility</CardTitle>
            <CardDescription>Add a room, cottage, or hall.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kind">Type</Label>
                <select
                  id="kind"
                  value={form.kind}
                  onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="ROOM">Room</option>
                  <option value="COTTAGE">Cottage</option>
                  <option value="HALL">Hall</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm((f) => ({ ...f, capacity: Number(e.target.value) }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₱)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Photos</Label>
                <Input
                  id="photoFiles"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {form.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {form.photos.map((photo, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={photo} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm(f => ({
                              ...f,
                              photos: f.photos.filter((_, i) => i !== idx)
                            }));
                          }}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  placeholder="WiFi, AC, TV, Mini Fridge"
                  value={form.amenities.join(", ")}
                  onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                />
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? "Creating..." : "Create Facility"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
