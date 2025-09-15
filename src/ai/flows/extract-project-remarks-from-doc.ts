'use server';

/**
 * @fileOverview This flow extracts project remarks from a .doc file.
 *
 * - extractProjectRemarks - A function that handles the extraction of project remarks from a document.
 * - ExtractProjectRemarksInput - The input type for the extractProjectRemarks function.
 * - ExtractProjectRemarksOutput - The return type for the extractProjectRemarks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractProjectRemarksInputSchema = z.object({
  docFile: z
    .string()
    .describe(
      'The .doc file to process, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  className: z.string().describe('The class name for which to extract project remarks.'),
});
export type ExtractProjectRemarksInput = z.infer<typeof ExtractProjectRemarksInputSchema>;

const ExtractProjectRemarksOutputSchema = z.object({
  extractedData: z
    .string()
    .describe('The extracted project remarks from the document.'),
});
export type ExtractProjectRemarksOutput = z.infer<typeof ExtractProjectRemarksOutputSchema>;

export async function extractProjectRemarks(
  input: ExtractProjectRemarksInput
): Promise<ExtractProjectRemarksOutput> {
  return extractProjectRemarksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractProjectRemarksPrompt',
  input: {schema: ExtractProjectRemarksInputSchema},
  output: {schema: ExtractProjectRemarksOutputSchema},
  prompt: `You are an expert in extracting project remarks from .doc files. The user will provide a .doc file as a data URI, and the class name. Extract the project remarks from the document. Do not include other content from the document other than the project remarks. Return the remarks as a single string.

Class Name: {{{className}}}
Document: {{media url=docFile}}`,
});

const extractProjectRemarksFlow = ai.defineFlow(
  {
    name: 'extractProjectRemarksFlow',
    inputSchema: ExtractProjectRemarksInputSchema,
    outputSchema: ExtractProjectRemarksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
