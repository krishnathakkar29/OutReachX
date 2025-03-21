import { prisma } from "@/lib/prisma";
import { sendEmailSchema } from "@/lib/schema/send-mail";
import { uploadFile } from "@/lib/supabase/storage-client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const recipients = formData.getAll("recipients") as string[];
    const subject = formData.get("subject") as string;
    const companyName = formData.get("companyName") as string;
    const body = formData.get("body") as string;
    const files = formData.getAll("files") as File[];

    const validatedData = sendEmailSchema.parse({
      recipients: recipients.map((email: string) => ({ email })),
      subject,
      companyName,
      body,
    });

    const uploadedAttachments = [];
    console.log(files);
    for (const file of files) {
      console.log("pehle");
      const { imageUrl, error } = await uploadFile({
        file,
        bucket: "email-resume", // Your Supabase bucket name
        folder: "attachments", // Optional folder
      });
      if (error) throw new Error("File upload failed");

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      uploadedAttachments.push({
        file_name: file.name,
        file_url: imageUrl,
        buffer: fileBuffer,
      });
    }

    console.log("emaik ke pehoe");

    const email = await prisma.email.create({
      data: {
        companyName: validatedData.companyName,
        subject: validatedData.subject,
        body: validatedData.body,
        recipients: validatedData.recipients.map((r) => r.email),
        attachments: {
          create: uploadedAttachments.map(({ file_name, file_url }) => ({
            file_name,
            file_url,
          })),
        },
      },
    });

    console.log("email ke baad", email);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    for (const recipient of validatedData.recipients) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: recipient.email,
        subject: validatedData.subject,
        html: validatedData.body,
        attachments: uploadedAttachments.map((attachment) => ({
          filename: attachment.file_name,
          content: attachment.buffer,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Emails sent successfully",
      emailId: email.id,
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
