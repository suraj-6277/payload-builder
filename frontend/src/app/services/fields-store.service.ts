import { Injectable, signal } from '@angular/core';
import { ExtractedField } from './extract.service';

@Injectable({
  providedIn: 'root'
})
export class FieldsStore {
  fields = signal<ExtractedField[]>([]);

  setFields(fields: ExtractedField[]) {
    this.fields.set(fields);
  }

  clear() {
    this.fields.set([]);
  }

  addField(field: ExtractedField) {
    this.fields.update((list) => [...list, field]);
  }
}
