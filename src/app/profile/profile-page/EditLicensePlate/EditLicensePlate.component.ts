import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';
import { CommonService } from 'src/app/shared/common.service ';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-EditLicensePlate',
  templateUrl: './EditLicensePlate.component.html',
  styleUrls: ['./EditLicensePlate.component.scss']
})
export class EditLicensePlateComponent implements OnInit {
  httpError: any;
  makes: any;
  models: any;
  selectedMakeName: any;
  filteredMakes: Observable<string[]>;
  filteredModels: Observable<string[]>;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<EditLicensePlateComponent>,
    private commenService: CommonService, private dialogService: ConfirmDialogService, 
    @Inject(MAT_DIALOG_DATA) public data: any, private userService: UserService, 
    private authenticationService: AuthenticationService

  ) { }
  vehicleForm: FormGroup;

  ngOnInit() {
    this.vehicleForm = this.formBuilder.group({
      vehicleID: [this.data.id],
      'vehicleLicensePlateNumber': [this.data.licensePlateNumber, Validators.required],
      'vehicleMake': [this.data.make, Validators.required],
      'vehicleModel': [this.data.model, Validators.required],
      'userID': ['', ''],
      color: [this.data.color, Validators.required],
      isDefault: [this.data.isDefault, Validators.required]
    });

    this.commenService.getAllMakes().subscribe(
      (response) => {
        this.makes = response.data;
      },
      (error) => {}
    );

    this.filteredMakes = this.vehicleForm.controls.vehicleMake.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterMake(value))
      );

      this.filteredModels = this.vehicleForm.controls.vehicleModel.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterModel(value))
      );

  }
  cancelVehicle() {
    this.dialogRef.close();
  }

  onMakeFocusOut(event: any) {
    let typedMake = this.vehicleForm.controls.vehicleMake.value.toLowerCase();
    var selectedMake = this.makes.filter(x => x.Make_Name.toLowerCase() === typedMake);
    if (selectedMake.length > 0) {

      if (this.selectedMakeName != undefined && typedMake === this.selectedMakeName.toLowerCase()) {
        this.vehicleForm.controls.vehicleMake.setValue(this.selectedMakeName);
        return;
      }

      this.getModels(selectedMake[0].Make_Name);
      this.vehicleForm.controls.vehicleMake.setValue(selectedMake[0].Make_Name);
      this.selectedMakeName = selectedMake[0].Make_Name;
    }
    else {
      this.selectedMakeName = this.vehicleForm.controls.vehicleMake.value;
      this.models = [];
      this.vehicleForm.controls.vehicleModel.setValue('');
    }
  }

  onModelFocusOut(event: any) {
    let typedModel = this.vehicleForm.controls.vehicleModel.value.toLowerCase();    
    var selectedModel = this.models.filter(x => x.Model_Name.toLowerCase() === typedModel);
    if (selectedModel.length > 0) {
      this.vehicleForm.controls.vehicleModel.setValue(selectedModel[0].Model_Name);
    }
  }


  getModels(makeName) {
    var selectedMake = this.makes.filter(x => x.Make_Name === makeName)[0];
    this.selectedMakeName = selectedMake.Make_Name;
    this.commenService.getAllModelsByMake(selectedMake.Make_ID).subscribe(
      (response) => {
        this.models = response.data;
        this.vehicleForm.controls.vehicleModel.setValue('');
      },
      (error) => {}
    );
  }

  updateVehicle() {
    const body = this.vehicleForm.value;
    body.userID = this.authenticationService.userValue.id;
    this.userService.savevehicle(body)
      .subscribe((response) => {
        this.dialogRef.close(true);
      }, (error) => {
        this.httpError = error;
      });
  }

  setDefault() {
    let colorControl = this.vehicleForm.get('isDefault');
    colorControl.setValue(!colorControl.value);
    this.vehicleForm.markAsDirty();
  }

  private _filterMake(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.makes == undefined)
      return;
    return this.makes.filter(option => option.Make_Name.toLowerCase().includes(filterValue)).slice(0,100);
  }

  private _filterModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.models == undefined)
      return;
    return this.models.filter(option => option.Model_Name.toLowerCase().includes(filterValue));
  }

}
