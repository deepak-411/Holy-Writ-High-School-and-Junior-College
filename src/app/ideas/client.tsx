"use client";

import { useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SchoolClass, type Student } from "./data";
import { Badge } from "@/components/ui/badge";

export default function IdeasClient({
  initialData,
}: {
  initialData: SchoolClass[];
}) {
  const [selectedClass, setSelectedClass] = useState(initialData[0]?.id || "");
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    setEditingStudent(null);
  };

  const currentClass = initialData.find((c) => c.id === selectedClass);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Student Projects</CardTitle>
        <div className="w-full max-w-xs">
           <Select value={selectedClass} onValueChange={handleClassChange}>
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
                <TableHead className="hidden md:table-cell">Section</TableHead>
                <TableHead>Project Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClass.students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {student.rollNo || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {student.section ? (
                       <Badge variant="secondary">{student.section}</Badge>
                    ): 'N/A'}
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
  );
}
