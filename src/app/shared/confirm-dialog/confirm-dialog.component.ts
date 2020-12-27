import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    cancelText: string,
    confirmText: string,
    message: string,
    title: string,
  }, private mdDialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  ngOnInit(): void {
    console.log(this.data);
  }

  public cancel() {
    this.close(false);
  }

  public confirm() {
    this.close(true);
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }

}
