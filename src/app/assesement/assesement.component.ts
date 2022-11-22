import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import { Assesement } from '../models/assesement';
import { Questions } from '../models/questions';
import { Students, StudentsResponses } from '../models/students';
import { assesmentService } from '../services/assesment.service';
import { questionService } from '../services/question.service';
import { studentsService } from '../services/student.service';

@Component({
  selector: 'app-assesement',
  templateUrl: './assesement.component.html',
  styleUrls: ['./assesement.component.scss'],
})
export class AssesementComponent implements OnInit {
  assesment: Assesement[] = [];
  students: Students[] = [];
  questions: Questions[]=[];
  studentResponses: StudentsResponses[]=[];
  reportHtml:any='';
  title="Assesement"
  reportTypes = [
    {
      id: 1,
      name: 'Diagnostic',
    },
    {
      id: 2,
      name: 'Progress',
    },
    {
      id: 3,
      name: 'Feedback',
    },
  ];
  assesmentForm: FormGroup;
  error: string = '';

  constructor(
    private assesmentService: assesmentService,
    private studentService: studentsService,
    private questionService: questionService,
    private formBuilder: FormBuilder
  ) {
    this.assesmentForm = this.formBuilder.group({
      studentId: ['', Validators.required],
      reportType: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
  }

  get assesmentReport() {
    return this.assesmentForm.controls;
  }

  async getData(){
    let assesmentData = this.getAssesment();
    let questionData = this.getQuestions();
    let studentsData = this.getStudents();
    let studentResponses = this.getStudentResponses();
    await Promise.all([assesmentData,questionData,studentsData, studentResponses]).then(results => {
       this.assesment=results[0];
       this.questions=results[1];
       this.students=results[2];
       this.studentResponses=results[3];
    });
  }
  async getAssesment() {
    let source=this.assesmentService.getAssesment();
    return await lastValueFrom(source);
  }

  async getQuestions(){
    let source= this.questionService.getQuestions();
    return await lastValueFrom(source);
  }

  async getStudents(){
   let source= this.studentService.getStudents();
   return await lastValueFrom(source);
  }

  async getStudentResponses(){
    let source= this.studentService.getStudentResponses();
   return await lastValueFrom(source);
  }

  generateDiagnosticReport(student, studentResponses){
    const studentName=student[0].firstName+' '+student[0].lastName;
    let response=studentResponses[studentResponses.length-1];
    const complatedDate=response.completed;
    const questionCount=this.questions.length-1;
    const questionTypes= Array.from(new Set(this.questions.map(x => x.strand)));
    const answerCount=response.responses.length-1;

    this.reportHtml=''
    this.reportHtml=this.reportHtml+'<h3>Diagnostic Report</h3>';
    this.reportHtml=this.reportHtml+''+studentName+' recently completed Numeracy assessment on '+complatedDate+'';
    this.reportHtml=this.reportHtml+'<br/>';
    this.reportHtml=this.reportHtml+'He got '+answerCount+' questions right out of '+questionCount+'. Details by strand given below:'
    this.reportHtml=this.reportHtml+'<br/>';
    this.reportHtml=this.reportHtml+'<br/>';
    
    questionTypes.forEach(questionType=>{
     
      const filterQuestion=this.questions.filter(f=>f.strand===questionType);
      let correctAnswer=0;
      filterQuestion.forEach(question=>{
         const answer=response.responses.filter(f=>f.questionId===question.id);
         if(answer[0].response==question.config.key){
          correctAnswer=correctAnswer+1;
         }
      });

      this.reportHtml=this.reportHtml+''+questionType+': '+correctAnswer+' out of '+filterQuestion.length+' correct';
      this.reportHtml=this.reportHtml+'<br/>';
    });
   
    
  }

  generateProgressReport(student, studentResponses){
    const studentName=student[0].firstName+' '+student[0].lastName;
    const asesesmentCount=studentResponses.length-1;
    const questionCount=this.questions.length-1;
    this.reportHtml=''
    this.reportHtml=this.reportHtml+'<h3>Progress Report</h3>';
    this.reportHtml=this.reportHtml+''+studentName+' has completed Numeracy assessment '+asesesmentCount+' times in total. Date and raw score given below';
    this.reportHtml=this.reportHtml+'<br/>';
    studentResponses.forEach(response=>{
      this.reportHtml=this.reportHtml+'Date: '+response.completed+', Raw Score: '+response.results.rawScore+' out of '+questionCount+'';
      this.reportHtml=this.reportHtml+'<br/>';
     });
    
    this.reportHtml=this.reportHtml+'<br/>';
    this.reportHtml=this.reportHtml+'<br/>';
    let response=studentResponses[studentResponses.length-1];
    this.reportHtml=this.reportHtml+''+studentName+' got '+response.results.rawScore+' more correct in the recent completed assessment than the oldest';
  }

  generateFeedbackReport(student, studentResponses){
    const studentName=student[0].firstName+' '+student[0].lastName;
    let response=studentResponses[studentResponses.length-1];
    const complatedDate=response.completed;
    const questionCount=this.questions.length-1;
    const answerCount=response.responses.length-1;
    this.reportHtml=''
    this.reportHtml=this.reportHtml+'<h3>Progress Report</h3>';
    this.reportHtml=this.reportHtml+''+studentName+' recently completed Numeracy assessment on '+complatedDate+'';
    this.reportHtml=this.reportHtml+'<br/>';
    this.reportHtml=this.reportHtml+' He got '+answerCount+' questions right out of '+questionCount+'. Feedback for wrong answers given below';
    this.reportHtml=this.reportHtml+'<br/>';

    this.questions.forEach(question=>{
      const answer=response.responses.filter(f=>f.questionId===question.id);
      if(answer[0].response!=question.config.key){
        this.reportHtml=this.reportHtml+'Question: '+question.stem;
        this.reportHtml=this.reportHtml+'<br/>';
        this.reportHtml=this.reportHtml+'Your Answer: '+answer[0].response;
        this.reportHtml=this.reportHtml+'<br/>';
        this.reportHtml=this.reportHtml+'Right Answer: '+question.config.key;
        this.reportHtml=this.reportHtml+'<br/>';
        this.reportHtml=this.reportHtml+'<br/>';
        this.reportHtml=this.reportHtml+'Hint: '+question.config.hint+'';
      }
   });
   
  }

  onSubmit() {
    if (this.assesmentForm.invalid) {
      return;
    }

    let student = this.students.filter(
      (f) => f.id == this.assesmentReport.studentId.value
    );
    if (student.length == 0) {
      this.error = 'Student is not found';
    }
    
    let studentData = this.studentResponses.filter(f=>f.student.id==student[0].id && f.completed);

    if(this.assesmentReport.reportType.value==='Progress'){
     this.generateProgressReport(student, studentData);
    }
    else if(this.assesmentReport.reportType.value==='Diagnostic'){
      this.generateDiagnosticReport(student, studentData);
     }
     else if(this.assesmentReport.reportType.value==='Feedback'){
      this.generateFeedbackReport(student, studentData);
     }

  }
}
