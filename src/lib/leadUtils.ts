import { Lead, FilteredLead } from "@/types/leads";

export const calculateIzzkiScore = (lead: Lead): number => {
  return Math.round((lead.activity * 0.4) + (lead.demographicScore * 0.6));
};

export const cleanAndPrioritizeLeads = (rawLeads: Lead[]) => {
  const normalizeSource = (source: string) => source.replace('Facebook Campaign A', 'FB Campaign A');

  const uniqueLeads = new Map<string, Lead>();
  const filteredOutLeads: FilteredLead[] = [];

  rawLeads.forEach(lead => {
    const normalizedLead = { ...lead, source: normalizeSource(lead.source) };

    if (!lead.consent) {
      filteredOutLeads.push({ ...normalizedLead, reason: 'No Consent' });
      return;
    }

    const key = normalizedLead.email;

    if (!uniqueLeads.has(key)) {
      uniqueLeads.set(key, normalizedLead);
    } else {
      filteredOutLeads.push({ ...normalizedLead, reason: 'Duplicate Entry' });
    }
  });

  let cleanedLeads = Array.from(uniqueLeads.values());

  cleanedLeads = cleanedLeads.map(lead => ({
    ...lead,
    izzkiScore: calculateIzzkiScore(lead),
    conversionProb: (calculateIzzkiScore(lead) / 100).toFixed(2)
  })).sort((a, b) => (b.izzkiScore || 0) - (a.izzkiScore || 0));

  return { cleanedLeads, filteredOutLeads };
};

export const rawLeadsData: Lead[] = [
  { id: 1, name: 'Amritanshu Mishra', email: 'amritanshumishra@example.com', source: 'FB Campaign A', consent: true, appointmentDate: null, status: 'New', activity: 50, demographicScore: 90 },
  { id: 2, name: 'Ayush Choudhary', email: 'ayushchoudhary@example.com', source: 'Facebook Campaign A', consent: true, appointmentDate: null, status: 'New', activity: 80, demographicScore: 75 },
  { id: 3, name: 'Jon Snow', email: 'tagareyn@example.com', source: 'FB Ad B', consent: false, appointmentDate: null, status: 'Filtered', activity: 30, demographicScore: 60 },
  { id: 4, name: 'Anisha Sharma', email: 'anishasharma@example.com', source: 'FB Campaign A', consent: true, appointmentDate: null, status: 'Duplicate', activity: 50, demographicScore: 90 },
  { id: 5, name: 'Rustin Cohle', email: 'rustisme@example.com', source: 'Google Ad', consent: true, appointmentDate: null, status: 'New', activity: 95, demographicScore: 92 },
  { id: 6, name: 'Tyler Durden', email: 'wedonttalkaboutit@example.com', source: 'FB Campaign A', consent: true, appointmentDate: null, status: 'New', activity: 70, demographicScore: 85 },
];
