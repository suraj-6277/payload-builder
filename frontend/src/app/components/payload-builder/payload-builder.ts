import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FieldsStore } from '../../services/fields-store.service';

@Component({
  selector: 'app-payload-builder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './payload-builder.html',
  styleUrl: './payload-builder.css'
})
export class PayloadBuilder {
  private fieldsStore = inject(FieldsStore);

  draft = signal({
    description: '',
    variableTemplate: '',
    variableValue: ''
  });

  update(key: 'description' | 'variableTemplate' | 'variableValue', value: string) {
    this.draft.update((t) => ({ ...t, [key]: value }));
  }

  addSection() {
    const field = this.draft();
    if (!field.description.trim() || !field.variableTemplate.trim() || !field.variableValue.trim()) {
      alert('Fill in description, variableTemplate, and variableValue first.');
      return;
    }

    this.fieldsStore.addField({
      description: field.description.trim(),
      variableTemplate: field.variableTemplate.trim(),
      variableValue: field.variableValue.trim(),
    });

    this.draft.set({
      description: '',
      variableTemplate: '',
      variableValue: ''
    });
  }
}
