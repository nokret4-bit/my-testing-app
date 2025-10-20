"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface EditFacilityPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditFacilityPage({ params }: EditFacilityPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    kind: "ROOM",
    description: "",
    capacity: 1,
    price: 0,
    photos: [] as string[],
    amenities: [] as string[],
    isActive: true,
  });

  useEffect(() => {
    fetchFacility();
  }, [id]);

  const fetchFacility = async () => {
    try {
      const res = await fetch(`/api/admin/facilities/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          kind: data.kind || "ROOM",
          description: data.description || "",
          capacity: data.capacity || 1,
          price: Number(data.price) || 0,
          photos: data.photos || [],
          amenities: data.amenities || [],
          isActive: data.isActive ?? true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load facility",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/facilities/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast({
          title: "Success",
          description: "Facility updated successfully",
        });
        router.push("/admin/facilities");
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update facility",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Edit Facility</h1>
            <Link href="/admin/facilities">
              <Button variant="outline">Back to Facilities</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Facility Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="kind">Type</Label>
                <Select value={formData.kind} onValueChange={(value) => setFormData({ ...formData, kind: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOM">Room</SelectItem>
                    <SelectItem value="COTTAGE">Cottage</SelectItem>
                    <SelectItem value="HALL">Hall</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (₱)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amenities">Amenities (comma-separated)</Label>
                <Input
                  id="amenities"
                  value={formData.amenities.join(", ")}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value.split(",").map(s => s.trim()) })}
                  placeholder="WiFi, AC, TV, Mini Fridge"
                />
              </div>

              <div>
                <Label htmlFor="photos">Photos</Label>
                <div className="space-y-2">
                  <Input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        Array.from(files).forEach((file) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const base64 = reader.result as string;
                            setFormData(prev => ({
                              ...prev,
                              photos: [...prev.photos, base64]
                            }));
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload images or paste URLs below
                  </p>
                  <Textarea
                    id="photos"
                    value={formData.photos.join("\n")}
                    onChange={(e) => setFormData({ ...formData, photos: e.target.value.split("\n").map(s => s.trim()).filter(Boolean) })}
                    placeholder="Or paste image URLs (one per line)"
                    rows={3}
                  />
                  {formData.photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {formData.photos.map((photo, idx) => (
                        <div key={idx} className="relative group">
                          <img 
                            src={photo} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                photos: prev.photos.filter((_, i) => i !== idx)
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
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">Active (visible to customers)</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Link href="/admin/facilities" className="flex-1">
                  <Button type="button" variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
