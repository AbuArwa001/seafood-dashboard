"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Plus } from "lucide-react";

export default function PurchasesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Supplier Purchases</h2>
          <p className="text-muted-foreground">
            Manage purchases from suppliers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Record Purchase
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Purchases Module</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Supplier purchase management functionality will be implemented here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
