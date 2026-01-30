"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight font-heading">Settings</h2>
        <p className="text-muted-foreground">
          Manage application settings and preferences
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Currency Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage currencies and exchange rates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure system preferences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage notification preferences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Security and access control settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
