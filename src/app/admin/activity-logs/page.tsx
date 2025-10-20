import { redirect } from "next/navigation";
import { getServerSession, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, ArrowLeft, User, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";

export default async function ActivityLogsPage() {
  const session = await getServerSession();

  // Only admins can view activity logs
  if (!isAdmin(session)) {
    redirect("/admin");
  }

  const logs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const getActionColor = (action: string) => {
    if (action.includes("CREATE")) return "default";
    if (action.includes("UPDATE")) return "secondary";
    if (action.includes("DELETE")) return "destructive";
    if (action.includes("CHECKIN") || action.includes("CHECKOUT")) return "outline";
    if (action.includes("LOGIN")) return "default";
    return "secondary";
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Activity Logs</h1>
            </div>
            <Link href="/admin">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>System Activity</CardTitle>
            <CardDescription>
              Track all admin and staff actions (last 100 entries)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No activity logs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Activity className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getActionColor(log.action)}>
                          {formatAction(log.action)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {log.entity}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {log.user && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{log.user.name}</span>
                            <Badge variant="outline" className="ml-1 text-xs">
                              {log.user.role}
                            </Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(log.createdAt), "MMM dd, yyyy HH:mm:ss")}</span>
                        </div>
                      </div>

                      {log.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                            View details
                          </summary>
                          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
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
