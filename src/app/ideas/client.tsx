"use client";

import { useState, useTransition } from "react";
import { type SchoolClass } from "./data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2, FileText, X } from "lucide-react";
import { processAndEmailDocument } from "../actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function IdeasClient({
  initialData,
}: {
  initialData: SchoolClass[];
}) {
  const [selectedClass, setSelectedClass] = useState<string>(
    initialData[0]?.id || ""
  );
  const [teamName, setTeamName] = useState("");
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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

  const resetForm = () => {
    setTeamName("");
    setTeamLeaderName("");
    setTeamMembers("");
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file || !selectedClass || !teamName || !teamLeaderName) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Please fill all required fields and select a file.",
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64File = reader.result as string;
      const className =
        initialData.find((c) => c.id === selectedClass)?.name || "Unknown";

      startTransition(async () => {
        const result = await processAndEmailDocument({
          docFile: base64File,
          className,
          teamName,
          teamLeaderName,
          teamMembers,
        });

        if (result.success) {
          toast({
            title: "Success!",
            description: result.message,
          });
          resetForm();
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
    <Card>
      <CardHeader>
        <CardTitle>Submit Your Idea</CardTitle>
        <CardDescription>
          Fill out the form below to submit your project idea.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="class-select">Class</Label>
              <Select
                value={selectedClass}
                onValueChange={setSelectedClass}
                required
              >
                <SelectTrigger id="class-select">
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
             <div className="space-y-2">
              <Label htmlFor="team-name">Team Name</Label>
              <Input
                id="team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. The Innovators"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-leader">Team Leader Name</Label>
            <Input
              id="team-leader"
              value={teamLeaderName}
              onChange={(e) => setTeamLeaderName(e.target.value)}
              placeholder="Enter team leader's full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team-members">
              Team Member Names (with class and section)
            </Label>
            <Textarea
              id="team-members"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              placeholder="e.g. John Doe - Class VI, Section A&#x0a;Jane Smith - Class VI, Section B"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="doc-file">Abstract of Your Ideas (.doc/.docx)</Label>
            {!filePreview ? (
              <label
                htmlFor="doc-file"
                className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-secondary transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    DOC or DOCX file
                  </p>
                </div>
                <Input
                  id="doc-file"
                  type="file"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  onChange={handleFileChange}
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  required
                />
              </label>
            ) : (
              <div className="relative flex items-center p-3 rounded-md border bg-secondary">
                <FileText className="h-6 w-6 mr-3 text-primary" />
                <span className="text-sm font-medium text-foreground truncate">
                  {filePreview}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => {
                    setFile(null);
                    setFilePreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={!file || isPending}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Ideas"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
