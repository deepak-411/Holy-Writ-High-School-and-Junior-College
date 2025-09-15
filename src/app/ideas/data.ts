export type Student = {
  id: number;
  name: string;
  rollNo: string;
  section: string;
  projectRemarks: string;
};

export type SchoolClass = {
  id: string;
  name: string;
  students: Student[];
};

let studentIdCounter = 1;

export const schoolData: SchoolClass[] = [
  {
    id: "class-vi",
    name: "Class VI",
    students: [
      { id: studentIdCounter++, name: "Hridhaan", rollNo: "11", section: "Daisies", projectRemarks: "" },
      { id: studentIdCounter++, name: "Maneet", rollNo: "17", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Mishti", rollNo: "18", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Sayaan", rollNo: "27", section: "Daffodils", projectRemarks: "" },
    ],
  },
  {
    id: "class-vii",
    name: "Class VII",
    students: [
      { id: studentIdCounter++, name: "Devansh Upadhyay", rollNo: "", section: "", projectRemarks: "" },
      { id: studentIdCounter++, name: "Upendra Rathod", rollNo: "29", section: "", projectRemarks: "" },
      { id: studentIdCounter++, name: "Vritika", rollNo: "31", section: "", projectRemarks: "" },
    ],
  },
  {
    id: "class-viii",
    name: "Class VIII",
    students: [
      { id: studentIdCounter++, name: "Mishwa Pokar", rollNo: "20", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Aadiaraj Hole", rollNo: "2", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Atharv Ray", rollNo: "", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Adya", rollNo: "3", section: "Daisies", projectRemarks: "" },
      { id: studentIdCounter++, name: "Kashyap Patel", rollNo: "18", section: "Daisies", projectRemarks: "" },
      { id: studentIdCounter++, name: "Mujtaba Khan", rollNo: "19", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Lucky Tiwari", rollNo: "19", section: "Daisies", projectRemarks: "" },
      { id: studentIdCounter++, name: "Shubham Raj", rollNo: "35", section: "Daisies", projectRemarks: "" },
      { id: studentIdCounter++, name: "Dimple", rollNo: "10", section: "Daffodils", projectRemarks: "" },
    ],
  },
  {
    id: "class-ix",
    name: "Class IX",
    students: [
      { id: studentIdCounter++, name: "Dev Bhagat", rollNo: "13", section: "Daffodil", projectRemarks: "" },
      { id: studentIdCounter++, name: "Tivra Pandye", rollNo: "36", section: "Daffodil", projectRemarks: "" },
      { id: studentIdCounter++, name: "Aditya Kar", rollNo: "3", section: "Daffodil", projectRemarks: "" },
      { id: studentIdCounter++, name: "Arav Patel", rollNo: "7", section: "Daffodil", projectRemarks: "" },
      { id: studentIdCounter++, name: "Anuja Gholap", rollNo: "6", section: "Daffodil", projectRemarks: "" },
      { id: studentIdCounter++, name: "Gaytri", rollNo: "16", section: "Daffodil", projectRemarks: "" },
      { id: studentIdCounter++, name: "Karan", rollNo: "", section: "Daisies", projectRemarks: "" },
    ],
  },
  {
    id: "class-x",
    name: "Class X",
    students: [
      { id: studentIdCounter++, name: "Aaryaman Rastogi", rollNo: "", section: "Daffodils", projectRemarks: "" },
      { id: studentIdCounter++, name: "Pranshu", rollNo: "", section: "", projectRemarks: "" },
    ],
  },
];
