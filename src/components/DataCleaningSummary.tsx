import { Filter } from "lucide-react";
import { FilteredLead } from "@/types/leads";

interface DataCleaningSummaryProps {
  filteredOut: FilteredLead[];
  t: (key: string) => string;
}

export const DataCleaningSummary = ({ filteredOut, t }: DataCleaningSummaryProps) => {
  return (
    <div className="p-6 bg-card rounded-2xl shadow-card border-t-4 border-warning">
      <h3 className="text-xl font-bold mb-3 text-warning flex items-center border-b pb-2">
        <Filter className="w-5 h-5 mr-2" />
        {t('cleaningHeader')}
      </h3>
      <p className="text-4xl font-black text-warning">{filteredOut.length}</p>
      <p className="text-sm text-muted-foreground mt-1">{t('filteredOutCount')}</p>
      <div className="mt-3 text-xs text-muted-foreground space-y-1">
        {filteredOut.slice(0, 3).map((lead, index) => (
          <p key={index} className="truncate">
            <span className="font-bold">[{lead.reason.substring(0, 3)}]</span> {lead.name}
          </p>
        ))}
        {filteredOut.length > 3 && (
          <p className="font-semibold">...and {filteredOut.length - 3} more.</p>
        )}
      </div>
    </div>
  );
};
