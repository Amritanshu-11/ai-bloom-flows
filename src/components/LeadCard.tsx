import { CalendarCheck, Zap } from "lucide-react";
import { Lead } from "@/types/leads";
import { Button } from "@/components/ui/button";

interface LeadCardProps {
  lead: Lead;
  onBook: (lead: Lead) => void;
  t: (key: string) => string;
}

export const LeadCard = ({ lead, onBook, t }: LeadCardProps) => {
  const isHotLead = (lead.izzkiScore || 0) > 85;

  return (
    <div
      className={`p-4 border-l-4 rounded-xl shadow-card transition-all duration-300 hover:shadow-card-hover hover:scale-[1.01] ${
        isHotLead
          ? 'border-hot bg-hot/10'
          : 'border-primary bg-card hover:bg-primary/5'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-lg text-card-foreground truncate">
              {lead.name}
            </p>
            {isHotLead && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-hot-foreground bg-hot rounded-full animate-pulse whitespace-nowrap">
                <Zap className="w-3 h-3" />
                {t('hotLead')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{lead.email}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {t('source')}: <span className="font-semibold">{lead.source}</span>
          </p>
        </div>
        
        <div className="text-right flex-shrink-0">
          <div
            className={`font-black text-3xl ${
              isHotLead ? 'text-hot' : 'text-primary'
            }`}
          >
            {lead.izzkiScore}
          </div>
          <p className="text-xs text-muted-foreground">{t('izzkiScore')}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button
          onClick={() => onBook(lead)}
          size="sm"
          className="gap-2"
        >
          <CalendarCheck className="w-4 h-4" />
          {t('bookNow')}
        </Button>
      </div>
    </div>
  );
};
