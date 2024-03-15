import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';

declare const TXTextControl: any;
declare const loadJson: any;

interface MailMergeData {
  json?: string;
  template?: string;
  document?: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  public mailMergeData: MailMergeData = { };

  constructor(private http: HttpClient) {}

  @HostListener('document:txDocumentEditorLoaded', ['$event'])
  onTxDocumentEditorLoaded() {
    // wait until TXTextControl has been loaded
    TXTextControl.addEventListener("textControlLoaded",  () => {
      TXTextControl.loadJsonData(this.mailMergeData.json);
    });
  }

  ngOnInit() {
    this.getJsonData();
  }

  getJsonData() {
    this.http.get<MailMergeData>('/mailmerge/getjsondata').subscribe(
      (result) => {
        this.mailMergeData = result;
      }
    );
  }

  mergeTemplate() {

    TXTextControl.saveDocument(TXTextControl.StreamType.InternalUnicodeFormat, (document: any) => {

      this.mailMergeData.template = document.data;

      // send a post request to the server
      this.http.post('/mailmerge/mergetemplate', this.mailMergeData).subscribe(
        (result) => {
          this.mailMergeData = result;
          TXTextControl.loadDocument(
            TXTextControl.StreamType.InternalUnicodeFormat,
            this.mailMergeData.document);
        }
      );

    });
  }

  title = 'tx-angular-mailmerge.client';
}
