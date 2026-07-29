import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ExtractedField {
  description: string;
  variableTemplate: string;
  variableValue: string;
}

export interface ExtractResponse {
  fields: ExtractedField[];
  rawTextPreview?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExtractService {
  private apiUrl = '/extract';

  constructor(private http: HttpClient) {}

  extractDocument(file: File): Observable<ExtractResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ExtractResponse>(this.apiUrl, formData);
  }
}
