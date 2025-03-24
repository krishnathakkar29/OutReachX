"use server";

import { prisma } from "@/lib/prisma";
import {
  followUpSchema,
  type FollowUpSchemaType,
} from "@/lib/schema/send-mail";
import { uploadFile } from "@/lib/supabase/storage-client";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

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

export async function sendFollowUpEmail(data: FollowUpSchemaType) {
  try {
    const validatedData = followUpSchema.parse(data);

    if (validatedData.password !== process.env.PASSWORD) {
      return { success: false, error: "Invalid password" };
    }

    // Setup nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Handle file uploads
    const attachmentPromises =
      validatedData.files?.map(async (file) => {
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
      }) ?? [];

    const attachments = await Promise.all(attachmentPromises);

    // Use transaction for data consistency and send emails
    const result = await prisma.$transaction(async (tx) => {
      const outreachEmails = await Promise.all(
        validatedData.recipients.map(async (recipient) => {
          // Create outreach email record
          const outreachEmail = await tx.outreachEmail.create({
            data: {
              subject: validatedData.subject,
              body: validatedData.body,
              emailId: recipient.companyId,
              attachments: {
                create: attachments.map(({ fileName, fileUrl }) => ({
                  file_name: fileName,
                  file_url: fileUrl,
                })),
              },
            },
            include: {
              recipient: {
                include: {
                  company: true,
                },
              },
              attachments: true,
            },
          });

          // Send email using nodemailer
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: recipient.email,
            subject: validatedData.subject,
            html: validatedData.body,
            attachments: attachments.map((attachment) => ({
              filename: attachment.fileName,
              content: attachment.buffer,
            })),
          });

          // Add delay between emails
          await delay(500);

          return outreachEmail;
        })
      );

      return outreachEmails;
    });

    revalidatePath("/email-history");

    return {
      success: true,
      data: result,
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
