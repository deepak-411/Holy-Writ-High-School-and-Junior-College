"use client";

import { useState, useTransition } from "react";
import { type SchoolClass, type Student, schoolData } from "./data";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, FileText, X } from "lucide-react";
import { processAndEmailDocument } from "../actions";

type DialogState = {
  isOpen: boolean;
  student: Student | null;
  className: string;
};

export default function IdeasClient({
  initialData,
}: {
  initialData: SchoolClass[];
}) {
  const [classes, setClasses] = useState<SchoolClass[]>(initialData);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    student: null,
    className: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleOpenDialog = (student: Student, className: string) => {
    setDialogState({ isOpen: true, student, className });
  };

  const handleCloseDialog = () => {
    if (isPending) return;
    setDialogState({ isOpen: false, student: null, className: "" });
    setFile(null);
    setFilePreview(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === "application/msword" ||
        selectedFile.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile);
        setFilePreview(selectedFile.name);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload a valid .doc or .docx file.",
        });
        setFile(null);
        setFilePreview(null);
        e.target.value = "";
      }
    }
  };
  
  const handleSubmit = () => {
    if (!file || !dialogState.student) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Please select a file to upload.",
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64File = reader.result as string;
      const { student, className } = dialogState;

      startTransition(async () => {
        const studentInfo = `${student.name} (Roll: ${student.rollNo || 'N/A'}, Class: ${className}, Section: ${student.section || 'N/A'})`;
        const result = await processAndEmailDocument({
          docFile: base64File,
          className: className,
          studentInfo: studentInfo,
        });

        if (result.success && result.extractedData) {
          toast({
            title: "Success!",
            description: result.message,
          });
          
          setClasses(prevClasses => prevClasses.map(c => 
            c.name === className ? {
              ...c,
              students: c.students.map(s => 
                s.id === student.id ? { ...s, projectRemarks: result.extractedData! } : s
              )
            } : c
          ));
          handleCloseDialog();
        } else {
          toast({
            variant: "destructive",
            title: "Submission Failed",
            description: result.message,
          });
        }
      });
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
      });
    };
  };

  return (
    <>
      <Tabs defaultValue={classes[0]?.id || "class-vi"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {classes.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {classes.map((c) => (
          <TabsContent key={c.id} value={c.id}>
            <Card>
              <CardHeader>
                <CardTitle>{c.name} Submissions</CardTitle>
                <CardDescription>
                  List of students and their project idea submissions for {c.name}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Roll No.</TableHead>
                      <TableHead className="hidden sm:table-cell">Section</TableHead>
                      <TableHead>Project Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c.students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="hidden sm:table-cell">{student.rollNo || "N/A"}</TableCell>
                        <TableCell className="hidden sm:table-cell">{student.section || "N/A"}</TableCell>
                        <TableCell>
                          {student.projectRemarks ? (
                            <p className="text-sm text-muted-foreground italic">
                              {`"${student.projectRemarks.substring(0, 100)}${student.projectRemarks.length > 100 ? "..." : ""}"`}
                            </p>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(student, c.name)}
                              className="bg-accent text-accent-foreground hover:bg-accent/90"
                            >
                              <UploadCloud className="mr-2 h-4 w-4" />
                              Upload Ideas
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={dialogState.isOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Submit Your Idea</DialogTitle>
            <DialogDescription>
              Upload your project ideas document for{" "}
              <span className="font-semibold text-primary">{dialogState.student?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doc-file" className="text-right col-span-4 mb-2">
                Project Document (.doc)
              </Label>
              <div className="col-span-4">
                {!filePreview ? (
                  <label htmlFor="doc-file" className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">DOC or DOCX file</p>
                    </div>
                    <Input id="doc-file" type="file" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={handleFileChange} accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                  </label>
                ) : (
                  <div className="relative flex items-center p-3 rounded-md border bg-secondary">
                    <FileText className="h-6 w-6 mr-3 text-primary" />
                    <span className="text-sm font-medium text-foreground truncate">{filePreview}</span>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7" onClick={() => { setFile(null); setFilePreview(null); }}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!file || isPending} className="bg-primary hover:bg-primary/90">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
