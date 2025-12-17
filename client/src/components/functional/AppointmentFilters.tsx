import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import type { AppointmentStatus } from "@shared/schema";

interface AppointmentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: AppointmentStatus | "all";
  onStatusChange: (status: AppointmentStatus | "all") => void;
  doctorFilter: string;
  onDoctorChange: (doctor: string) => void;
  doctors: string[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export function AppointmentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  doctorFilter,
  onDoctorChange,
  doctors,
  onClearFilters,
  hasActiveFilters,
}: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by patient or doctor..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          data-testid="input-search"
        />
      </div>

      <Select value={statusFilter} onValueChange={onStatusChange as (value: string) => void}>
        <SelectTrigger className="w-full sm:w-[160px]" data-testid="select-status-filter">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="confirmed">Confirmed</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={doctorFilter} onValueChange={onDoctorChange}>
        <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-doctor-filter">
          <SelectValue placeholder="All Doctors" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Doctors</SelectItem>
          {doctors.map((doctor) => (
            <SelectItem key={doctor} value={doctor}>
              Dr. {doctor}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-2"
          data-testid="button-clear-filters"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
