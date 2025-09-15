"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { processAndEmailDocument } from "../actions";
import { type SchoolClass, type Student } from "./data";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  className: z.string().min(1, { message: "Please select a class." }),
  teamName: z.string().min(1, { message: "Team Name is required." }),
  teamLeaderName: z
    .string()
    .min(1, { message: "Team Leader Name is required." }),
  teamMembers: z
    .string()
    .min(1, { message: "Team Member details are required." }),
  file: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, "Please upload one file.")
    .refine(
      (files) =>
        files?.[0]?.type === "application/msword" ||
        files?.[0]?.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        files?.[0]?.type === "application/pdf",
      "Please upload a .doc, .docx, or .pdf file."
    ),
});

type FormValues = z.infer<typeof formSchema>;

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function IdeasClient({
  initialData,
}: {
  initialData: SchoolClass[];
}) {
  const [selectedClass, setSelectedClass] = useState(initialData[0]?.id || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      className: "",
      teamName: "",
      teamLeaderName: "",
      teamMembers: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    const file = data.file[0];

    try {
      const docFile = await fileToDataUrl(file);
      const result = await processAndEmailDocument({
        ...data,
        fileName: file.name,
        docFile,
      });

      if (result.success) {
        toast({
          title: "Submission Successful",
          description: "Your idea has been submitted and sent via email.",
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description:
            result.message || "An unknown error occurred. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description:
          "An error occurred while processing your submission. Please try again.",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    form.setValue("className", classId, { shouldValidate: true });
  };

  const currentClass = initialData.find((c) => c.id === selectedClass);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Projects</CardTitle>
          <div className="w-full max-w-xs">
            <Select
              value={selectedClass}
              onValueChange={(value) => setSelectedClass(value)}
            >
              <SelectTrigger id="class-select-display">
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {initialData.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {currentClass && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Roll No.
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Section
                  </TableHead>
                  <TableHead>Project Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClass.students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {student.rollNo || "N/A"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.section ? (
                        <Badge variant="secondary">{student.section}</Badge>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {student.projectRemarks || "No remarks yet."}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Idea</CardTitle>
          <CardDescription>
            Fill out the form below to submit your project idea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="className"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select
                      onValueChange={handleClassChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the class for this submission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {initialData.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. The Innovators" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamLeaderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Leader Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter the team leader's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamMembers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Member Names (with class and section)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List all team members, each on a new line. e.g.&#10;Jane Doe - Class IX, Daffodil&#10;John Smith - Class IX, Daisies"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="file"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Idea Document</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".doc,.docx,.pdf"
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit Idea
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
