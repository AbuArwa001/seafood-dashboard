import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface DataLogsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  actionFilter: string;
  setActionFilter: (action: string) => void;
  setPage: (page: number) => void;
  itemVariants: any;
}

export function DataLogsFilters({
  searchQuery, setSearchQuery, actionFilter, setActionFilter, setPage, itemVariants
}: DataLogsFiltersProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-premium bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search logs by object or details..."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm font-medium"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={actionFilter} onValueChange={(val) => { setActionFilter(val); setPage(1); }}>
              <SelectTrigger className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 font-semibold px-4">
                <SelectValue placeholder="Filter by Action" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl font-medium">
                <SelectItem value="ALL">All Actions</SelectItem>
                <SelectItem value="CREATE">Create</SelectItem>
                <SelectItem value="UPDATE">Update</SelectItem>
                <SelectItem value="DELETE">Delete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
