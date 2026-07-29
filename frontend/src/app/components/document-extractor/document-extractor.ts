import { Component, inject, signal } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { timeout } from 'rxjs';
import { ExtractService } from '../../services/extract.service';
import { FieldsStore } from '../../services/fields-store.service';

@Component({
  selector: 'app-document-extractor',
  standalone: true,
  imports: [CommonModule, JsonPipe],
  templateUrl: './document-extractor.html',
  styleUrl: './document-extractor.css'
})
export class DocumentExtractor {
  private extractService = inject(ExtractService);
  private fieldsStore = inject(FieldsStore);

  selectedFile = signal<File | null>(null);
  loading = signal(false);
  error = signal('');
  copied = signal(false);

  fields = this.fieldsStore.fields;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.setFile(input.files[0]);
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.setFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  private setFile(file: File) {
    const allowed = ['.docx', '.pdf', '.png', '.jpg', '.jpeg'];
    const ok = allowed.some(ext => file.name.toLowerCase().endsWith(ext));
    if (!ok) {
      this.error.set('Unsupported file type. Upload a .docx, .pdf, .png or .jpg file.');
      return;
    }
    this.selectedFile.set(file);
    this.error.set('');
    this.fieldsStore.clear();
  }

  extract() {
    const file = this.selectedFile();
    if (!file) return;
    this.loading.set(true);
    this.error.set('');
    this.fieldsStore.clear();
    this.extractService.extractDocument(file).pipe(timeout(90000)).subscribe({
      next: (res) => {
        const nextFields = res.fields || [];
        this.fieldsStore.setFields(nextFields);
        this.loading.set(false);
        if (!nextFields.length) {
          this.error.set('No template variables were found in this document.');
        }
      },
      error: (err) => {
        console.error(err);
        const message =
          err?.name === 'TimeoutError'
            ? 'Extraction timed out. Please try again.'
            : err?.error?.error || err?.message || 'Extraction failed. Please try again.';
        this.error.set(message);
        this.loading.set(false);
      }
    });
  }

  copyJson() {
    navigator.clipboard.writeText(JSON.stringify(this.fields(), null, 2)).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    });
  }

  downloadJson() {
    const blob = new Blob([JSON.stringify(this.fields(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const base = (this.selectedFile()?.name || 'extracted').replace(/\.[^.]+$/, '');
    a.href = url;
    a.download = `${base}_payload.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  reset() {
    this.selectedFile.set(null);
    this.fieldsStore.clear();
    this.error.set('');
  }
}
