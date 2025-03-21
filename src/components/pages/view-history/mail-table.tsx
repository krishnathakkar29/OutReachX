"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Paperclip, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Email {
  id: string;
  subject: string;
  recipients: string[];
  body: string;
  companyName: string;
  timestamp: string;
  status: string;
  attachments: Attachment[];
}

interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
}

interface EmailTableProps {
  emails: Email[];
  loading: boolean;
}

export function MailTable({ emails, loading }: EmailTableProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const viewEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (emails.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No emails found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipients</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attachments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email.id}>
                <TableCell className="font-medium">
                  {email.recipients.length > 1
                    ? `${email.recipients[0]} +${
                        email.recipients.length - 1
                      } more`
                    : email.recipients[0]}
                </TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{email.companyName}</TableCell>
                <TableCell>{formatDate(email.timestamp)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      email.status === "sent" ? "default" : "destructive"
                    }
                  >
                    {email.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {email.attachments.length > 0 && (
                    <div className="flex items-center">
                      <Paperclip className="h-4 w-4 mr-1" />
                      <span>{email.attachments.length}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => viewEmail(email)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedEmail && (
        <Dialog
          open={!!selectedEmail}
          onOpenChange={() => setSelectedEmail(null)}
        >
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedEmail.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Recipients:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmail.recipients.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Company:</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEmail.companyName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Date:</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEmail.timestamp)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status:</p>
                  <Badge
                    variant={
                      selectedEmail.status === "sent"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {selectedEmail.status}
                  </Badge>
                </div>
              </div>

              {selectedEmail.attachments.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmail.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-2 bg-accent/30 rounded hover:bg-accent/50 transition-colors"
                      >
                        <Paperclip className="h-4 w-4 mr-2" />
                        <span className="text-sm">{attachment.fileName}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Email Body:</p>
                <div className="p-4 bg-accent/30 rounded-md prose prose-invert max-w-none">
                  {selectedEmail.body.startsWith("#") ||
                  selectedEmail.body.includes("**") ? (
                    <ReactMarkdown>{selectedEmail.body}</ReactMarkdown>
                  ) : (
                    <div style={{ whiteSpace: "pre-wrap" }}>
                      {selectedEmail.body}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
