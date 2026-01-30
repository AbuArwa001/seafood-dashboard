"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Plus } from "lucide-react";

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Payments</h2>
          <p className="text-muted-foreground">
            Track payment status and history
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Payments Module</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Payment tracking functionality will be implemented here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
