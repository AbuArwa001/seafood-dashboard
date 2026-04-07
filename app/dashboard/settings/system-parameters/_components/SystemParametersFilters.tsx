import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ParameterCategory } from "@/types/models";
import { CATEGORY_CONFIG } from "./SystemParametersConfig";

interface SystemParametersFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedCategory: ParameterCategory | "all";
  setSelectedCategory: (val: ParameterCategory | "all") => void;
}

export function SystemParametersFilters({ search, setSearch, selectedCategory, setSelectedCategory }: SystemParametersFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search parameters by name or identifier..."
          className="h-12 pl-11 rounded-2xl border-none shadow-sm bg-white font-medium"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-2 p-1 bg-white rounded-2xl shadow-sm overflow-x-auto no-scrollbar">
        <Button
          variant={selectedCategory === "all" ? "default" : "ghost"}
          onClick={() => setSelectedCategory("all")}
          className={`rounded-lg px-4 h-10 font-bold text-xs uppercase tracking-widest ${selectedCategory === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
        >
          All
        </Button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? "default" : "ghost"}
            onClick={() => setSelectedCategory(key as ParameterCategory)}
            className={`rounded-lg px-4 h-10 font-bold text-xs uppercase tracking-widest ${selectedCategory === key ? "bg-indigo-600 hover:bg-indigo-700" : ""}`}
          >
            <config.icon className="h-3 w-3 mr-2" />
            {config.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
