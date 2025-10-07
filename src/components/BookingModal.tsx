import { useState } from "react";
import { X } from "lucide-react";
import { Lead, BookingDetails } from "@/types/leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingModalProps {
  lead: Lead | null;
  onClose: () => void;
  onConfirm: (lead: Lead, details: BookingDetails) => void;
  isLoading: boolean;
  t: (key: string) => string;
}

export const BookingModal = ({ lead, onClose, onConfirm, isLoading, t }: BookingModalProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [dateError, setDateError] = useState('');

  if (!lead) return null;

  // Calculate min and max dates for validation
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 6);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setDateError('');
    
    // Additional validation
    const selectedDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (selectedDate < now) {
      setDateError(t('pastDateError') || 'Cannot book appointments in the past');
      return;
    }
    
    onConfirm(lead, { date, time });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg p-8 relative transform transition-all duration-300">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>

        <h2 className="text-3xl font-bold text-primary border-b pb-3 mb-5">
          {t('modalTitle')}
        </h2>

        <div className="p-4 bg-hot/10 border-l-4 border-hot rounded-lg mb-6">
          <p className="font-bold text-xl text-card-foreground">{lead.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {t('izzkiScore')}: <span className="font-bold">{lead.izzkiScore}</span> | {t('conversionProb')}: <span className="font-bold">{lead.conversionProb}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date" className="text-sm font-semibold">
              {t('appointmentDate')}
            </Label>
            <Input
              id="date"
              type="date"
              required
              min={today}
              max={maxDateString}
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDateError(''); // Clear error when user changes date
              }}
              className="mt-1"
            />
            {dateError && (
              <p className="text-sm text-destructive mt-1">{dateError}</p>
            )}
          </div>

          <div>
            <Label htmlFor="time" className="text-sm font-semibold">
              {t('appointmentTime')}
            </Label>
            <Input
              id="time"
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6"
            size="lg"
          >
            {isLoading ? t('processing') : t('confirmBooking')}
          </Button>

          <p className="text-xs text-center text-muted-foreground pt-2">
            {t('consoleMessageNote')}
          </p>
        </form>
      </div>
    </div>
  );
};
