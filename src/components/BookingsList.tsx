import { CalendarCheck } from "lucide-react";
import { Booking } from "@/types/leads";

interface BookingsListProps {
  bookings: Booking[];
  t: (key: string) => string;
}

export const BookingsList = ({ bookings, t }: BookingsListProps) => {
  return (
    <div className="p-6 bg-card rounded-2xl shadow-card border-t-4 border-success">
      <h3 className="text-xl font-bold mb-3 text-success flex items-center border-b pb-2">
        <CalendarCheck className="w-5 h-5 mr-2" />
        {t('bookingsHeader')} ({bookings.length})
      </h3>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {bookings.length > 0 ? (
          bookings.map((b) => (
            <div key={b.id} className="p-3 bg-success/10 rounded-lg text-sm shadow-sm">
              <p className="font-semibold text-card-foreground">{b.name}</p>
              <p className="text-xs text-muted-foreground">
                {b.date} at {b.time}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t('noBookings')}
          </p>
        )}
      </div>
    </div>
  );
};
