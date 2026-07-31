import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = `${environment.apiBaseUrl}/templates`;

  constructor(private http: HttpClient) {}

  saveTemplate(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  getTemplates(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
