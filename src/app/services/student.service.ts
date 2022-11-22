import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Students } from '../models/students';

@Injectable({ providedIn: 'root' })
export class studentsService {
  constructor(private httpClient: HttpClient) {
   
  }

  getStudents(): Observable<Students[]> {
    return this.httpClient.get<Array<Students>>('data/students.json');
  }

  getStudentResponses():Observable<any>{
    return this.httpClient.get('data/student-responses.json');
  }
}
