
"use server";

import { extractProjectRemarks } from "@/ai/flows/extract-project-remarks-from-doc";

// This is a simulated function. In a real-world application, this would use a
// service like Nodemailer with an SMTP provider, or an email API service like SendGrid or Resend.
async function sendEmailWithAttachment({
  docFile,
  studentInfo,
}: {
  docFile: string;
  studentInfo: string;
}) {
  console.log("--- SIMULATING EMAIL ---");
  console.log("To: dk201u@gmail.com");
  console.log("Subject: New Idea Submission");
  console.log(`Body: A new idea has been submitted by ${studentInfo}. The attached file is included.`);
  console.log("Attachment (first 50 chars):", docFile.substring(0, 50) + '...');
  // Simulate network delay for sending an email
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("--- EMAIL SIMULATION COMPLETE ---");
  return { success: true };
}

export async function processAndEmailDocument({
  docFile,
  className,
  studentInfo,
}: {
  docFile: string;
  className: string;
  studentInfo: string;
}): Promise<{ success: boolean; message: string; extractedData: string | null }> {
  if (!docFile || !docFile.startsWith("data:application/")) {
    return {
      success: false,
      message: "Invalid file format. Please upload a valid .doc file.",
      extractedData: null,
    };
  }

  try {
    // Run extraction and email simulation in parallel
    const [extractionResult, emailResult] = await Promise.all([
      extractProjectRemarks({ docFile, className }),
      sendEmailWithAttachment({ docFile, studentInfo }),
    ]);

    if (!extractionResult?.extractedData) {
      throw new Error("AI model failed to extract data from the document.");
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
