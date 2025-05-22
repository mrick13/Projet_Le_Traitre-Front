import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemoService {
  private apiUrl = 'http://localhost:3000/partie/demo';

  constructor(private http: HttpClient) {}

  createDemoParty(): Observable<any> {
    return this.http.post(this.apiUrl, {});
  }
}
