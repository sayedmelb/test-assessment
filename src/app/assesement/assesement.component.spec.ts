import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { assesmentService } from '../services/assesment.service';
import { questionService } from '../services/question.service';
import { studentsService } from '../services/student.service';

import { AssesementComponent } from './assesement.component';

fdescribe('AssesementComponent', () => {
  let component: AssesementComponent;
  let fixture: ComponentFixture<AssesementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssesementComponent ],
      imports: [    
        HttpClientModule,   
        FormsModule, 
        ReactiveFormsModule,   
      ],
      providers: [assesmentService,studentsService,questionService]
    }).compileComponents();
    
    

    fixture = TestBed.createComponent(AssesementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it(`should have as title 'Assesement'`, () => {
    const fixture = TestBed.createComponent(AssesementComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Assesement');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AssesementComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-assesment')?.textContent).toContain('Assesement');
  });
});
