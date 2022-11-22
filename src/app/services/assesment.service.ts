import { Injectable } from "@angular/core";
import{ HttpClient} from "@angular/common/http";
import { Observable } from "rxjs";
import { Assesement } from "../models/assesement";

@Injectable({providedIn: 'root'})
export class assesmentService{

    constructor( private httpClient: HttpClient){

    }

    getAssesment():Observable<Assesement[]>{
       return  this.httpClient.get<Array<Assesement>>('data/assessments.json');
    }
}