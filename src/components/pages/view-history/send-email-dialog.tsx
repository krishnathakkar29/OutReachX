"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface SendEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: string[];
}

export function SendEmailDialog({
  isOpen,
  onClose,
  recipients,
}: SendEmailDialogProps) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<any[]>([]);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleSendClick = (data: any) => {
    // Validate form
    if (!subject) {
      toast.error("Please enter an email subject");
      return;
    }

    if (!body) {
      toast.error("Please enter an email body");
      return;
    }

    console.log(subject);
    console.log(files);
    console.log(body);

    // Open password dialog
    setIsPasswordDialogOpen(true);
  };

  const handleSendEmail = async (password: string) => {
    setIsLoading(true);

    try {
      // In a real app, this would upload files and send the email
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Email sent successfully");

      // Reset form
      setSubject("");
      setBody("");
      setFiles([]);

      onClose();
    } catch (error: any) {
      toast.error(error?.message ?? "Error sending the email");
    } finally {
      setIsLoading(false);
      setIsPasswordDialogOpen(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setSubject("");
      setBody("");
      setFiles([]);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Send Email to Selected Recipients</DialogTitle>
            <DialogDescription>
              You are sending an email to {recipients.length}{" "}
              {recipients.length === 1 ? "recipient" : "recipients"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <div className="p-2 border rounded-md bg-muted/30 max-h-[100px] overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div key={index} className="text-sm">
                    {recipient}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors"
              >
                <input {...getInputProps()} />
                <Paperclip className="h-6 w-6 mx-auto mb-2" />
                <p>Drag & drop files here, or click to select files</p>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-accent/30 rounded"
                    >
                      <div className="flex items-center">
                        <Paperclip className="h-4 w-4 mr-2" />
                        <span className="text-sm truncate max-w-[300px]">
                          {file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea
                id="body"
                placeholder="Write your email content here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleSendClick} disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onClose={() => setIsPasswordDialogOpen(false)}
        onConfirm={handleSendEmail}
        isLoading={isLoading}
      /> */}
    </>
  );
}
