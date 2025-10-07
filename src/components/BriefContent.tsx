import { Target, ListOrdered, ChevronRight, Clock } from "lucide-react";

export interface BriefData {
  totalBookings: number;
  totalCleanedLeads: number;
  initialBookingTarget: number;
  bookingUplift: number;
  upliftPercentage: string;
  conversionRate: string;
  generatedDate: string;
  t: (key: string) => string;
}

export const BriefContent = ({ data }: { data: BriefData }) => {
  const { 
    totalBookings, 
    totalCleanedLeads, 
    bookingUplift, 
    upliftPercentage, 
    conversionRate,
    initialBookingTarget,
    generatedDate,
    t 
  } = data;

  return (
    <div className="p-6 bg-card shadow-xl rounded-xl">
      <h1 className="text-3xl font-extrabold text-primary mb-4">
        {t('briefTitle')}
      </h1>
      <p className="text-muted-foreground mb-6 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        {t('briefGeneratedOn')} {generatedDate}
      </p>

      <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-card-foreground flex items-center">
        <Target className="w-5 h-5 mr-2" />
        {t('kpiHeader')}
      </h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-primary/10 rounded-lg border-b-4 border-primary">
          <p className="text-3xl font-black text-primary">{totalBookings}</p>
          <p className="text-sm text-muted-foreground">{t('kpiBookings')}</p>
        </div>
        <div className="p-4 bg-success/10 rounded-lg border-b-4 border-success">
          <p className="text-3xl font-black text-success">{totalCleanedLeads}</p>
          <p className="text-sm text-muted-foreground">{t('kpiProcessed')}</p>
        </div>
        <div className="p-4 bg-accent/10 rounded-lg border-b-4 border-accent">
          <p className="text-3xl font-black text-accent">{conversionRate}%</p>
          <p className="text-sm text-muted-foreground">{t('kpiConversionRate')}</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold border-b pb-2 mt-8 mb-4 text-card-foreground flex items-center">
        <ListOrdered className="w-5 h-5 mr-2" />
        {t('upliftHeader')}
      </h2>
      <div className="p-4 bg-warning/10 rounded-lg shadow-inner">
        <p className="text-card-foreground font-semibold mb-2">
          {t('baselineTarget')} <span className="text-lg font-mono">{initialBookingTarget} bookings/week</span>
        </p>
        <p className="text-xl font-bold">
          {t('totalUplift')}
          <span className={`${bookingUplift >= 0 ? 'text-success' : 'text-destructive'} text-3xl ml-2`}>
            {bookingUplift > 0 ? '+' : ''}{bookingUplift}
          </span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {t('upliftNote')} {upliftPercentage}% {t('upliftIncrease')}
        </p>
      </div>

      <h2 className="text-2xl font-bold border-b pb-2 mt-8 mb-4 text-card-foreground flex items-center">
        <ChevronRight className="w-5 h-5 mr-2" />
        {t('nextActionsHeader')}
      </h2>
      <ol className="list-decimal pl-6 space-y-2 text-card-foreground">
        <li className="font-medium">{t('action1')}</li>
        <li className="font-medium">{t('action2')}</li>
        <li className="font-medium">{t('action3')}</li>
      </ol>
    </div>
  );
};
