export class Students{
    id:string;
    firstName:string;
    lastName:string;
    yearLevel:number;
}

export class StudentsResponses{
    id:string;
    assessmentId:string;
    assigned:string;
    started:string;
    completed:string;
    student: Student;
    responses:Array<Responses>
}

class Student{
    id:string;
    yearLevel:number;
}

class Responses{
    questionId:string;
    response:string;
}