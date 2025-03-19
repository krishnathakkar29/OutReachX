"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Send, Paperclip, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import MDEditor from "@uiw/react-md-editor";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  recipients: z
    .array(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .min(1, "At least one recipient is required"),
  subject: z.string().min(1, "Subject is required"),
  companyName: z.string().min(1, "Company name is required"),
  body: z.string().min(1, "Email content is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SendEmailPage() {
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipients: [{ email: "" }],
      subject: "",
      companyName: "",
      body: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "recipients",
    control: form.control,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/msword": [".doc", ".docx"],
    },
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: FormValues) {
    try {
      setIsLoading(true);
      // Add your email sending logic here
      console.log("Form data:", data);
      console.log("Files:", files);

      toast.success("Email sent successfully!");
    } catch (error) {
      toast.error("Failed to send email");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full py-6 px-8 md:px-16 mx-auto  animate-in fade-in-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-8">
              {/* Recipients Section */}
              <div className="bg-card rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Recipients</h2>
                    <p className="text-sm text-muted-foreground">
                      Add email recipients
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ email: "" })}
                  >
                    Add Recipient
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`recipients.${index}.email`}
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="email@example.com"
                                type="email"
                              />
                            </FormControl>
                            {fields.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Email Details */}
              <div className="bg-card rounded-lg px-6 space-y-2">
                <div>
                  <h2 className="text-lg font-semibold">Email Details</h2>
                </div>

                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter email subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter company name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Attachments */}
            <div className="space-y-4 lg:col-span-2">
              <div className="bg-card rounded-lg p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Attachments</h2>
                  <p className="text-sm text-muted-foreground">
                    Add files to your email
                  </p>
                </div>
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <input {...getInputProps()} />
                  <div className="space-y-4">
                    <Paperclip className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Drop files here</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to select files
                      </p>
                    </div>
                  </div>
                </div>
                {files.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Files</p>
                    <div className="max-h-[200px] overflow-y-auto space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-accent/30 rounded-md"
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            <Paperclip className="h-4 w-4 shrink-0" />
                            <span className="text-sm truncate">
                              {file.name}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Email Content</h2>
                <p className="text-sm text-muted-foreground">
                  Write your email message
                </p>
              </div>
              <Tabs
                defaultValue="normal"
                onValueChange={(value) => setIsMarkdown(value === "markdown")}
              >
                <TabsList>
                  <TabsTrigger value="normal">Normal Editor</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown Editor</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <div className="bg-card rounded-lg border min-h-[600px] overflow-hidden">
                    {isMarkdown ? (
                      <div data-color-mode="dark">
                        <MDEditor
                          value={field.value}
                          onChange={(val) => field.onChange(val || "")}
                          preview="live"
                          height={600}
                          hideToolbar={false}
                          visibleDragbar={false}
                          enableScroll={true}
                          style={{
                            backgroundColor: "transparent",
                            borderRadius: "inherit",
                          }}
                        />
                      </div>
                    ) : (
                      <Textarea
                        {...field}
                        placeholder="Write your email content here..."
                        className="min-h-[600px] rounded-lg border-0 resize-none focus-visible:ring-0 p-4"
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="px-8 py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
