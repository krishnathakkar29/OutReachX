import { prisma } from "@/lib/prisma";
import { sendEmailSchema } from "@/lib/schema/send-mail";
import { downloadFile, uploadFile } from "@/lib/supabase/storage-client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const recipients = formData.getAll("recipients") as string[];
    const subject = formData.get("subject") as string;
    const companyName = formData.get("companyName") as string;
    const body = formData.get("body") as string;
    const files = formData.getAll("files") as File[];

    // First download the default resume
    const { data: defaultResume, error: downloadError } = await downloadFile();
    if (downloadError) {
      throw new Error("Failed to download default resume");
    }

    // Prepare attachments array with default resume
    const uploadedAttachments: any = [
      {
        file_name: "Krishna_Thakkar_Resume.pdf", // Your default resume name
        file_url: "", // Not needed for email sending
        buffer: defaultResume,
      },
    ];

    // Handle user uploaded files
    for (const file of files) {
      const { imageUrl, error } = await uploadFile({
        file,
        bucket: "email-resume",
        folder: "attachments",
      });
      if (error) throw new Error("File upload failed");

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      uploadedAttachments.push({
        file_name: file.name,
        file_url: imageUrl,
        buffer: fileBuffer,
      });
    }

    const validatedData = sendEmailSchema.parse({
      recipients: recipients.map((email: string) => ({ email })),
      subject,
      companyName,
      body,
    });

    const company = await prisma.company.upsert({
      where: { name: validatedData.companyName },
      update: {},
      create: {
        name: validatedData.companyName,
      },
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const sentResults = [];
    const outreachEmailIds = [];

    for (const recipient of validatedData.recipients) {
      try {
        let emailRecord = await prisma.email.findFirst({
          where: {
            companyId: company.id,
            emailAddress: recipient.email,
          },
        });

        if (!emailRecord) {
          emailRecord = await prisma.email.create({
            data: {
              companyId: company.id,
              emailAddress: recipient.email,
            },
          });
        }

        const outreachEmail = await prisma.outreachEmail.create({
          data: {
            subject: validatedData.subject,
            body: validatedData.body,
            emailId: emailRecord.id,
            attachments: {
              create: uploadedAttachments.map(
                ({
                  file_name,
                  file_url,
                }: {
                  file_name: string;
                  file_url: string;
                }) => ({
                  file_name,
                  file_url: file_url || "", // Handle default resume case
                })
              ),
            },
          },
        });

        outreachEmailIds.push(outreachEmail.id);

        // Send email with all attachments
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: recipient.email,
          subject: validatedData.subject,
          html: validatedData.body,
          attachments: uploadedAttachments.map((attachment: any) => ({
            filename: attachment.file_name,
            content: attachment.buffer,
          })),
        });

        sentResults.push({
          recipient: recipient.email,
          success: true,
          outreachEmailId: outreachEmail.id,
        });
        await delay(500);
      } catch (error) {
        console.error(`Failed to send to ${recipient.email}:`, error);
        sentResults.push({
          recipient: recipient.email,
          success: false,
          error: error instanceof Error ? error.message : "Sending failed",
        });
      }
    }

    const successCount = sentResults.filter((r) => r.success).length;
    const allSuccess = successCount === validatedData.recipients.length;

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess
        ? "All emails sent successfully"
        : `${successCount}/${validatedData.recipients.length} emails delivered`,
      outreachEmailIds,
      details: sentResults,
    });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send emails",
      },
      { status: 500 }
    );
  }
}
