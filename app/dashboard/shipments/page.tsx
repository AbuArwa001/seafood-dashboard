"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Ship } from "lucide-react";
import apiClient from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Shipment, PaginatedResponse } from "@/types/models";
import { formatDate, getStatusColor } from "@/lib/utils";

export default function ShipmentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, error } = useQuery<PaginatedResponse<Shipment>>({
    queryKey: ["shipments", searchQuery],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SHIPMENTS, {
        params: { search: searchQuery },
      });
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Shipments</h2>
          <p className="text-muted-foreground">
            Manage and track all your seafood shipments
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Shipment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
            <Button variant="outline">Export</Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      <div className="grid gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">Loading shipments...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-destructive">
                Failed to load shipments. Please try again.
              </p>
            </CardContent>
          </Card>
        ) : data?.results && data.results.length > 0 ? (
          data.results.map((shipment) => (
            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Ship className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Shipment #{shipment.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        From {shipment.country_origin}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    {shipment.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium">{shipment.currency.code}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p className="font-medium">{shipment.items?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{formatDate(shipment.created_at, "PP")}</p>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Ship className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No shipments found</h3>
                <p className="text-sm text-muted-foreground">
                  Get started by creating your first shipment.
                </p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Shipment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
