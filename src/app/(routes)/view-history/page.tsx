import { EmailHistory } from "@/components/pages/view-history";
import React from "react";

function page() {
  return (
    <main className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Sent Emails</h1>
      <EmailHistory />
    </main>
  );
}

export default page;
