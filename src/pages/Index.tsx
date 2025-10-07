import { useState, useEffect, useCallback } from "react";
import { Bot, Users, FileText, Target, ListOrdered, ChevronRight } from "lucide-react";
import { Lead, Booking, BookingDetails, FilteredLead } from "@/types/leads";
import { cleanAndPrioritizeLeads, rawLeadsData } from "@/lib/leadUtils";
import { translations } from "@/data/translations";
import { LeadCard } from "@/components/LeadCard";
import { BookingModal } from "@/components/BookingModal";
import { BookingsList } from "@/components/BookingsList";
import { DataCleaningSummary } from "@/components/DataCleaningSummary";
import { BriefModal } from "@/components/BriefModal";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredOut, setFilteredOut] = useState<FilteredLead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [briefHtml, setBriefHtml] = useState<string | null>(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const t = useCallback((key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  useEffect(() => {
    console.log("--- STARTING DATA IMPORT AND CLEANING (Step 1) ---");
    const { cleanedLeads, filteredOutLeads } = cleanAndPrioritizeLeads(rawLeadsData);
    setLeads(cleanedLeads);
    setFilteredOut(filteredOutLeads);
    console.log(`Cleaned ${cleanedLeads.length} Leads. Filtered/Deduped ${filteredOutLeads.length}.`);
    console.log("--- DATA READY. Sorted by Izzki Score. ---");
  }, []);

  useEffect(() => {
    const isModalOpen = selectedLead !== null || briefHtml !== null;
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedLead, briefHtml]);

  const handleBooking = (lead: Lead, bookingDetails: BookingDetails) => {
    if (!bookingDetails.date || !bookingDetails.time) {
      console.error("Booking details missing!");
      return;
    }

    setIsBookingLoading(true);

    const newBooking: Booking = {
      id: Date.now(),
      leadId: lead.id,
      name: lead.name,
      date: bookingDetails.date,
      time: bookingDetails.time,
      score: lead.izzkiScore || 0,
      status: 'Confirmed'
    };

    setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id));
    setBookings(prevBookings => [newBooking, ...prevBookings]);
    setSelectedLead(null);

    setTimeout(() => {
      console.log("--- SIMULATING BACKEND POST to /sendMessage STUB ---");
      console.log("SUCCESS: Booking Confirmed.");
      console.log("Console Payload (The simulated message data):", {
        leadId: lead.id,
        leadEmail: lead.email,
        message: `Your appointment is confirmed for ${bookingDetails.date} at ${bookingDetails.time}.`,
      });
      console.log("-------------------------------------------------");
      setIsBookingLoading(false);
    }, 1500);
  };

  const generateBrief = useCallback(() => {
    const totalCleanedLeads = leads.length + bookings.length;
    const totalBookings = bookings.length;
    const initialBookingTarget = 5;
    const bookingUplift = totalBookings - initialBookingTarget;
    const upliftPercentage = ((bookingUplift / initialBookingTarget) * 100 || 0).toFixed(0);

    const briefContent = `
      <div class="p-6 bg-white shadow-xl rounded-xl">
        <h1 class="text-3xl font-extrabold text-primary mb-4">${t('briefTitle')}</h1>
        <p class="text-muted-foreground mb-6">${t('briefGeneratedOn')} ${new Date().toLocaleDateString()}</p>

        <h2 class="text-2xl font-bold border-b pb-2 mb-4 text-card-foreground flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
          ${t('kpiHeader')}
        </h2>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-4 bg-primary/10 rounded-lg border-b-4 border-primary">
            <p class="text-3xl font-black text-primary">${totalBookings}</p>
            <p class="text-sm text-muted-foreground">${t('kpiBookings')}</p>
          </div>
          <div class="p-4 bg-success/10 rounded-lg border-b-4 border-success">
            <p class="text-3xl font-black text-success">${totalCleanedLeads}</p>
            <p class="text-sm text-muted-foreground">${t('kpiProcessed')}</p>
          </div>
          <div class="p-4 bg-accent/10 rounded-lg border-b-4 border-accent">
            <p class="text-3xl font-black text-accent">${((totalBookings / totalCleanedLeads) * 100 || 0).toFixed(1)}%</p>
            <p class="text-sm text-muted-foreground">${t('kpiConversionRate')}</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold border-b pb-2 mt-8 mb-4 text-card-foreground flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          ${t('upliftHeader')}
        </h2>
        <div class="p-4 bg-warning/10 rounded-lg shadow-inner">
          <p class="text-card-foreground font-semibold mb-2">${t('baselineTarget')} <span class="text-lg font-mono">${initialBookingTarget} bookings/week</span></p>
          <p class="text-xl font-bold">${t('totalUplift')}
            <span class="${bookingUplift >= 0 ? 'text-success' : 'text-destructive'} text-3xl">
              ${bookingUplift > 0 ? '+' : ''}${bookingUplift}
            </span>
          </p>
          <p class="text-sm text-muted-foreground mt-2">${t('upliftNote')} ${upliftPercentage}% ${t('upliftIncrease')}</p>
        </div>

        <h2 class="text-2xl font-bold border-b pb-2 mt-8 mb-4 text-card-foreground flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
          ${t('nextActionsHeader')}
        </h2>
        <ol class="list-decimal pl-6 space-y-2 text-card-foreground">
          <li class="font-medium">${t('action1')}</li>
          <li class="font-medium">${t('action2')}</li>
          <li class="font-medium">${t('action3')}</li>
        </ol>
      </div>
    `;
    setBriefHtml(briefContent);
  }, [leads, bookings, t]);

  return (
    <div className="min-h-screen gradient-bg p-4 sm:p-8">
      <header className="text-center mb-10 relative bg-card p-6 rounded-xl shadow-card max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-primary flex items-center justify-center gap-3">
          <Bot className="w-10 h-10" />
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground mt-2">{t('subtitle')}</p>

        <div className="absolute top-4 right-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
            className="p-2 border border-input rounded-lg shadow-sm bg-card text-foreground font-semibold focus:ring-primary focus:border-primary transition"
          >
            <option value="en">English (EN)</option>
            <option value="hi">हिन्दी (HI)</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 p-6 bg-card rounded-2xl shadow-card border-t-4 border-primary">
          <h2 className="text-2xl font-bold mb-4 text-primary flex items-center border-b pb-2">
            <Users className="w-5 h-5 mr-2" />
            {t('leadsHeader')} ({leads.length})
          </h2>
          <p className="text-sm text-muted-foreground mb-4 flex items-center">
            <ListOrdered className="w-4 h-4 mr-1" />
            {t('leadsSubtitle')}
          </p>
          
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {leads.length > 0 ? (
              leads.map(lead => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onBook={setSelectedLead}
                  t={t}
                />
              ))
            ) : (
              <div className="text-center p-10 text-muted-foreground bg-muted rounded-xl shadow-inner border border-dashed border-border">
                {t('noLeads')}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <BookingsList bookings={bookings} t={t} />
          
          <div className="p-6 bg-card rounded-2xl shadow-card border-t-4 border-destructive">
            <h3 className="text-xl font-bold mb-3 text-destructive flex items-center border-b pb-2">
              <FileText className="w-5 h-5 mr-2" />
              {t('briefHeader')}
            </h3>
            <Button
              onClick={generateBrief}
              className="w-full"
              variant="destructive"
            >
              {t('generateBrief')}
            </Button>
          </div>

          <DataCleaningSummary filteredOut={filteredOut} t={t} />
        </div>
      </div>

      <BriefModal briefHtml={briefHtml} onClose={() => setBriefHtml(null)} />
      <BookingModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onConfirm={handleBooking}
        isLoading={isBookingLoading}
        t={t}
      />
    </div>
  );
};

export default Index;
