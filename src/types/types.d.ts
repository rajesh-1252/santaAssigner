export interface EmployeeDataTypes {
  Employee_Name: string;
  Employee_EmailID: string;
}

export interface AssignedSantaData extends EmployeeDataTypes {
  Secret_Child_Name: string;
  Secret_Child_EmailID: string;
}
