
"use server";

import { extractProjectRemarks } from "@/ai/flows/extract-project-remarks-from-doc";
import nodemailer from "nodemailer";

async function sendEmailWithAttachment({
  docFile,
  emailBody,
  fileName,
}: {
  docFile: string;
  emailBody: string;
  fileName: string;
}) {
  const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_SECURE,
    EMAIL_USER,
    EMAIL_PASSWORD,
    EMAIL_TO,
  } = process.env;

  if (
    !EMAIL_HOST ||
    !EMAIL_PORT ||
    !EMAIL_USER ||
    !EMAIL_PASSWORD ||
    !EMAIL_TO
  ) {
    console.error(
      "Email environment variables are not set. Please check your .env file."
    );
    return {
      success: false,
      message: "Email service is not configured on the server.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT, 10),
    secure: EMAIL_SECURE === "true",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  const mimeType = docFile.substring(
    docFile.indexOf(":") + 1,
    docFile.indexOf(";")
  );
  const fileContent = docFile.split("base64,")[1];

  try {
    await transporter.sendMail({
      from: `"Holy Writ Ideas" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: "New Idea Submission",
      text: emailBody,
      html: `<p>${emailBody.replace(/\n/g, "<br>")}</p>`,
      attachments: [
        {
          filename: fileName,
          content: fileContent,
          encoding: "base64",
          contentType: mimeType,
        },
      ],
    });
    console.log("Email sent successfully");
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email." };
  }
}

export async function processAndEmailDocument({
  docFile,
  className,
  teamName,
  teamLeaderName,
  teamMembers,
  fileName,
}: {
  docFile: string;
  className: string;
  teamName: string;
  teamLeaderName: string;
  teamMembers: string;
  fileName: string;
}): Promise<{ success: boolean; message: string; extractedData: string | null }> {
  if (!docFile || !docFile.startsWith("data:")) {
    return {
      success: false,
      message: "Invalid file format. Please upload a valid document.",
      extractedData: null,
    };
  }

  try {
    const emailBody = `
A new idea has been submitted.
Class: ${className}
Team Name: ${teamName}
Team Leader: ${teamLeaderName}
Team Members:
${teamMembers}

The attached file is included.
    `;

    // Run extraction and email sending in parallel
    const [extractionResult, emailResult] = await Promise.all([
      extractProjectRemarks({ docFile, className }),
      sendEmailWithAttachment({ docFile, emailBody, fileName }),
    ]);

    if (!extractionResult?.extractedData) {
      // We will not treat this as a hard failure, just a warning.
      console.warn("AI model failed to extract data from the document, but the submission will proceed.");
    }

    if (!emailResult.success) {
      return {
        success: false,
        message: emailResult.message || "An unknown error occurred while sending the email.",
        extractedData: extractionResult.extractedData,
      };
    }

    return {
      success: true,
      message: "Submission successful! The document has been processed and sent.",
      extractedData: extractionResult.extractedData,
    };
  } catch (error) {
    console.error("Error in processAndEmailDocument action:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      success: false,
      message: `Failed to process document: ${errorMessage}`,
      extractedData: null,
    };
  }
}
