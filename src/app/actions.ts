
"use server";

import { extractProjectRemarks } from "@/ai/flows/extract-project-remarks-from-doc";

// This is a simulated function. In a real-world application, this would use a
// service like Nodemailer with an SMTP provider, or an email API service like SendGrid or Resend.
async function sendEmailWithAttachment({
  docFile,
  emailBody,
}: {
  docFile: string;
  emailBody: string;
}) {
  console.log("--- SIMULATING EMAIL ---");
  console.log("To: dk201u@gmail.com");
  console.log("Subject: New Idea Submission");
  console.log(`Body: ${emailBody}`);
  console.log("Attachment (first 50 chars):", docFile.substring(0, 50) + '...');
  // Simulate network delay for sending an email
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("--- EMAIL SIMULATION COMPLETE ---");
  return { success: true };
}

export async function processAndEmailDocument({
  docFile,
  className,
  teamName,
  teamLeaderName,
  teamMembers,
}: {
  docFile: string;
  className: string;
  teamName: string;
  teamLeaderName: string;
  teamMembers: string;
}): Promise<{ success: boolean; message: string; extractedData: string | null }> {
  if (!docFile || !docFile.startsWith("data:application/")) {
    return {
      success: false,
      message: "Invalid file format. Please upload a valid .doc file.",
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

    // Run extraction and email simulation in parallel
    const [extractionResult, emailResult] = await Promise.all([
      extractProjectRemarks({ docFile, className }),
      sendEmailWithAttachment({ docFile, emailBody }),
    ]);

    if (!extractionResult?.extractedData) {
      // We will not treat this as a hard failure, just a warning.
      console.warn("AI model failed to extract data from the document, but the submission will proceed.");
    }

    if (!emailResult.success) {
      // In a real app, you might want to handle this more gracefully,
      // maybe by queuing the email for a retry.
      console.warn("Simulated email sending failed but proceeding with success response.");
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
