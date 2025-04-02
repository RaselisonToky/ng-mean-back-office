import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf,NgFor } from '@angular/common';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  imports: [MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,NgIf,NgFor]
})
export class DialogComponent {
  
  @Input() customClass: string = '';
  form: FormGroup;
  title: string;
  formConfig: any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = data.title;
    this.formConfig = data.formConfig || [];
    this.customClass = data.customClass || '';

    // Création dynamique du FormGroup basé sur la configuration
    const formGroupConfig:any = {};
    this.formConfig.forEach((field: any) => {
      formGroupConfig[field.name] = [
        data.entity?.[field.name] || field.defaultValue || '',
        field.validators || []
      ];
    });

    this.form = this.fb.group(formGroupConfig);
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
