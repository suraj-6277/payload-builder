import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private apiUrl = 'http://localhost:5000/api/templates';

  constructor(private http: HttpClient) {}

  saveTemplate(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getTemplates(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}