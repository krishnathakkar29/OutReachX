import { EmailHistoryTable } from "@/components/pages/view-history/email-history-table";

// Dummy data
const emailHistoryData = [
  {
    id: "1",
    recipient: "john.doe@example.com",
    companyName: "Acme Inc",
    lastSentAt: new Date("2024-01-15T10:30:00"),
    sendCount: 3,
  },
  {
    id: "2",
    recipient: "jane.smith@company.com",
    companyName: "TechCorp",
    lastSentAt: new Date("2024-01-14T14:45:00"),
    sendCount: 1,
  },
  {
    id: "3",
    recipient: "michael.brown@business.org",
    companyName: "Global Solutions",
    lastSentAt: new Date("2024-01-13T09:15:00"),
    sendCount: 5,
  },
  // Add more dummy entries as needed
];

export default function HistoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Email History</h1>
        <p className="text-muted-foreground">
          View and manage your sent emails history
        </p>
      </div>
      <EmailHistoryTable data={emailHistoryData} />
    </div>
  );
}
