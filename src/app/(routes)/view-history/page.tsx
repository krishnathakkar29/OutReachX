import { EmailHistoryTable } from "@/components/pages/view-history/email-history-table";
import { getEmailHistory } from "@/actions/mailHistoryAction";

export default async function HistoryPage() {
  const emailHistoryData = await getEmailHistory();

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
