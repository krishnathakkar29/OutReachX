"use server";

import { prisma } from "@/lib/prisma";
import {
  followUpSchema,
  type FollowUpSchemaType,
} from "@/lib/schema/send-mail";
import { uploadFile, downloadFile } from "@/lib/supabase/storage-client";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import type { Attachment } from "nodemailer/lib/mailer";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getEmailHistory() {
  try {
    // First get all emails with their outreach counts

    const emails = await prisma.email.findMany({
      select: {
        id: true,
        emailAddress: true,
        company: {
          select: {
            name: true,
          },
        },
        OutreachEmail: {
          orderBy: {
            sentAt: "desc",
          },
          select: {
            sentAt: true,
          },
        },
        _count: {
          select: {
            OutreachEmail: true,
          },
        },
      },
    });

    console.log(emails);
    // Transform the data into the required format
    return emails.map((email) => ({
      id: email.id,
      recipient: email.emailAddress,
      companyName: email.company.name,
      lastSentAt: email.OutreachEmail[0]?.sentAt || new Date(0),
      sendCount: email._count.OutreachEmail,
    }));
  } catch (error) {
    console.error("Error fetching email history:", error);
    throw new Error("Failed to fetch email history");
  }
}

type EmailAttachment = {
  fileName: string;
  fileUrl: string;
  buffer: Buffer | null;
};

export async function sendFollowUpEmail(data: FollowUpSchemaType) {
  try {
    const validatedData = followUpSchema.parse(data);

    // Format body to preserve line breaks
    const formattedBody = validatedData.body.replace(/\n/g, "<br>");

    if (validatedData.password !== process.env.PASSWORD) {
      return { success: false, error: "Invalid password" };
    }

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Get default resume
    const { data: defaultResume, error: resumeError } = await downloadFile();
    if (resumeError) {
      return { success: false, error: "Failed to fetch default resume" };
    }

    // Initialize attachments array with default resume
    let emailAttachments: EmailAttachment[] = [
      {
        fileName: "Krishna_Thakkar_Resume.pdf",
        fileUrl: "",
        buffer: defaultResume as Buffer,
      },
    ];

    // Handle additional file uploads if any
    if (validatedData.files?.length) {
      const userAttachments = await Promise.all(
        validatedData.files.map(async (file) => {
          const { imageUrl, error } = await uploadFile({
            file,
            bucket: "email-resume",
            folder: "attachments",
          });
          if (error) throw new Error(`File upload failed: ${error}`);

          const fileBuffer = Buffer.from(await file.arrayBuffer());
          return {
            fileName: file.name,
            fileUrl: imageUrl,
            buffer: fileBuffer,
          };
        })
      );
      emailAttachments = [...emailAttachments, ...userAttachments];
    }

    const outreachEmails = [];

    // Process each recipient sequentially instead of using transaction
    for (const recipient of validatedData.recipients) {
      const outreachEmail = await prisma.outreachEmail.create({
        data: {
          subject: validatedData.subject,
          body: formattedBody, // Store formatted body
          emailId: recipient.companyId,
          attachments: {
            create: emailAttachments.map(({ fileName, fileUrl }) => ({
              file_name: fileName,
              file_url: fileUrl || "",
            })),
          },
        },
        include: {
          recipient: {
            include: { company: true },
          },
          attachments: true,
        },
      });

      // Send email with formatted body
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: recipient.email,
        subject: validatedData.subject,
        html: formattedBody, // Use formatted body here
        attachments: emailAttachments
          .filter(
            (attachment): attachment is EmailAttachment & { buffer: Buffer } =>
              attachment.buffer !== null
          )
          .map(
            (attachment): Attachment => ({
              filename: attachment.fileName,
              content: attachment.buffer,
            })
          ),
      });

      await delay(500);
      outreachEmails.push(outreachEmail);
    }

    revalidatePath("/email-history");

    return {
      success: true,
      data: outreachEmails,
      message: `Successfully sent emails to ${validatedData.recipients.length} recipients`,
    };
  } catch (error) {
    console.error("Failed to send follow-up email:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to send follow-up email",
    };
  }
}
