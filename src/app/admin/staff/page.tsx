import { redirect } from "next/navigation";
import { getServerSession, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateStaffButton } from "@/components/create-staff-button";
import { EditStaffButton } from "@/components/edit-staff-button";
import { DeleteStaffButton } from "@/components/delete-staff-button";

export default async function StaffManagementPage() {
  const session = await getServerSession();

  // Only admins can manage staff
  if (!isAdmin(session)) {
    redirect("/admin");
  }

  const users = await prisma.users.findMany({
    where: {
      role: {
        in: ["STAFF", "ADMIN"],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <div className="flex gap-2">
              <CreateStaffButton />
              <Link href="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Staff & Admin Users</CardTitle>
            <CardDescription>
              Manage staff accounts, roles, and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <p className="text-muted-foreground">No staff users found</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{user.name || "No Name"}</h3>
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {user.role}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Created: {formatDateTime(user.createdAt)}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <EditStaffButton user={user} />
                        {user.id !== session?.user?.id && (
                          <DeleteStaffButton userId={user.id} userName={user.name || user.email} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
