import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { Questions } from '../models/questions';

@Injectable({ providedIn: 'root' })
export class questionService {
    constructor(private httpClient: HttpClient) {
       
      }

      getQuestions(): Observable<Questions[]> {
        return this.httpClient.get<Array<Questions>>('data/questions.json');
      }
}