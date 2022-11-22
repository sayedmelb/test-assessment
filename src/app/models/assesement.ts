export class Assesement{
    id:string;
    name:string;
    questions:Array<Questions>;
}

class Questions{
    questionId:string;
    position:number;
}