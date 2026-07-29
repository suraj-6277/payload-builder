import { Component } from '@angular/core';
import { PayloadBuilder } from './components/payload-builder/payload-builder';
import { DocumentExtractor } from './components/document-extractor/document-extractor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PayloadBuilder, DocumentExtractor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}