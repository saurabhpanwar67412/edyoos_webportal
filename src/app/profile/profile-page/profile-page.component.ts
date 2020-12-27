import { Component, OnInit, NgZone, Input, ViewChild, ElementRef } from '@angular/core';
import * as lodash from 'lodash';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TakePhotoComponent } from './take-photo/take-photo.component';
import { WebcamImage } from 'ngx-webcam';
import { ProfileService } from 'src/app/shared/profile.service';
import { Change_Password_Metadata, Profile_METADATA, emailVaidatorsfor, logValidationErrors, errorMessages } from './profile-page-metadata';
import { UserService } from 'src/app/shared/user.service';
import { CountryISO } from './country-iso.enum';
import { CRUDApiResponseModel } from 'src/app/model/crud_apiresponse.model';
import { ApiResponse } from 'src/app/model/apiresponse.model';
import { VechicleRequestModel } from 'src/app/model/cart/booking_request.model';
import { environment } from 'src/environments/environment';
import { DASHBOARD_DROPDOWN_METADATA, Gender_For_Profile, DASHBOARD_TABS_METADATA } from 'src/app/dashboard/dashboard_metadata';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';
import { CommonService } from 'src/app/shared/common.service ';
import { MapsAPILoader } from '@agm/core';
import { EditLicensePlateComponent } from './EditLicensePlate/EditLicensePlate.component';
import { GenderEnum } from 'src/app/shared/enum/gender_enum';
import { CustomValidators } from 'src/app/helper/custom-validators';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Make } from 'src/app/model/common/make.model';

interface Gender_drop_down {
  id: number;
  value: string;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  @Input() tabName;
  DASHBOARD_TABS_METADATA = DASHBOARD_TABS_METADATA;
  public show = false;
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  changePasswordForm: FormGroup;
  vehicleForm: FormGroup;
  imageForm: FormGroup;
  webcamImage;
  Change_Password_Metadata = Change_Password_Metadata;
  Profile_METADATA = Profile_METADATA;
  passwordChanged;
  profileForm: FormGroup;
  CountryISO = CountryISO;
  timeZones = [];
  isOpen;
  isInit = true;
  errors = errorMessages;
  httperror: string;
  vehicledetails: VechicleRequestModel[];
  private email: string;
  private userid: number;
  fileToUpload: File = null;
  profileSaved;
  imagealreadyavailble: string = null;
  // genderdet: Gender_drop_down[];
  public modeselect = 'Male';
  private taskmenu = Gender_For_Profile;
  public updatebutton = true;

  @ViewChild('searchBar')
  public searchElementRef: ElementRef;
  profileid: any;

  makes: any;
  selectedMakeName: any;
  models: any;
  filteredMakes: Observable<string[]>;
  filteredModels: Observable<string[]>;

  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private userService: UserService,
    public dialog: MatDialog,
    private dialogService: ConfirmDialogService,
    private commentService: CommonService,
    protected mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private metaTagService: Meta
  ) {
    let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    this.userid = userdetails.id;
    this.email = userdetails.email;
    this.createImageForm();
    this.imageForms.push(this.createFileGroup());

    for (let i = -12; i < 15; i++) {
      if (i > -1) {
        this.timeZones.push('+' + i);
      }
      else {
        this.timeZones.push(i);
      }
    }
  }
  toggle() {
    this.show = !this.show;
  }
  get imageForms() {
    return this.imageForm.get('files') as FormArray;
  }
  createImageForm() {
    this.imageForm = this.formBuilder.group({
      files: this.formBuilder.array([])
    });
  }
  isSelected(tabName) {
    if (tabName === this.tabName) {
      return true;
    }
  }
  ngOnInit(): void {
    this.tabName = 'settings';
    this.createForms();
    this.createImageForm();
    this.imageForms.push(this.createFileGroup());
    let userdetails = JSON.parse(localStorage.getItem('edyoosUserDetails'));
    this.userid = userdetails.id;
    this.email = userdetails.email;

    // this.profileService.getProfileImageBase64().subscribe((response) => {
    //   if (response) {
    //     this.cardImageBase64 = `data:image/jpeg;base64,${response}`;
    //     this.isImageSaved = true;
    //   }
    // });

    this.registerChangePasswordListeners();

    this.changePasswordForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.changePasswordForm);
    })

    // this.genderdet = [{ id: 1, value: 'Male' }, { id: 2, value: 'Female' }, { id: 3, value: 'Others' }];


    this.isOpen = this.commentService.SideNavigationBarToggler;

    this.metaTagService.updateTag(
      { name: 'title', content: 'Log In To Your Edyoos Easy Online Reservations Account' }
    );
    this.metaTagService.updateTag(
      {
        name: 'description', content: 'Manage your parking reservations online. Reserve parking for events, city '+
        'parking, airport parking, and more. Track your parking spots in real-time.'
      }
    );

    this.metaTagService.updateTag(
      {
        name: 'keywords', content: 'parking, parking reservations, reserved parking, city parking, online parking, event '+
        'parking, airport parking'
      }
    );

    this.commentService.getAllMakes().subscribe(
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

  private _filterMake(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.makes.filter(option => option.Make_Name.toLowerCase().includes(filterValue)).slice(0,100);
  }

  private _filterModel(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (this.models == undefined)
      return;
    return this.models.filter(option => option.Model_Name.toLowerCase().includes(filterValue));
  }

  gender = GenderEnum;
  getGenderArray(): Array<string> {
    var keys = Object.keys(this.gender);
    return keys.slice(keys.length / 2);
  }

  onMakeFocusOut(event: any) {
    let typedMake = this.vehicleForm.controls.vehicleMake.value.toLowerCase();
    var selectedMake = this.makes.filter(x => x.Make_Name.toLowerCase() === typedMake);
    if (selectedMake.length > 0) {

      if (this.selectedMakeName != undefined && typedMake === this.selectedMakeName.toLowerCase())
      {
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
    
    if (selectedMake.Make_Name.toLowerCase() === this.selectedMakeName.toLowerCase())
    return;

    this.selectedMakeName = selectedMake.Make_Name;
    this.commentService.getAllModelsByMake(selectedMake.Make_ID).subscribe(
      (response) => {
        this.models = response.data;
        this.vehicleForm.controls.vehicleModel.setValue('');
      },
      (error) => {}
    );
  }

  attributeDisplay(attribute1, attribute2) {
    if (attribute1.id == attribute2.id) {
      return attribute1.name;
    } else {
      return '';
    }
  }

  getVehicleDetails() {
    this.userService.getVehicleDetails(this.userid)
      .subscribe((response) => {
        console.log(response.data);
        this.vehicledetails = response.data;

      }, (error) => {
        console.log(error);

      });
  }

  disabledDefault: boolean = false;

  saveSetDefault(vehicleDetails) {
    this.disabledDefault = true;
    let body = {
      VehicleID: vehicleDetails.id,
      VehicleLicensePlateNumber: vehicleDetails.licensePlateNumber,
      VehicleMake: vehicleDetails.make,
      VehicleModel: vehicleDetails.model,
      UserId: vehicleDetails.userID,
      Color: vehicleDetails.color,
      IsDefault: !vehicleDetails.isDefault
    }

    this.userService.savevehicle(body).subscribe((response) => {
      this.disabledDefault = false;
      this.getVehicleDetails();

      const options = {
        title: 'Updated',
        message: 'Vehicle Details Updated Successfully!',
        confirmText: 'OK'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {

      });

    },
      (error) => {
        this.disabledDefault = false;
        this.httperror = error;
      }
    );

  }

  savevehicle() {
    const body = this.vehicleForm.value;
    body.userID = this.userid;
    this.userService.savevehicle(body).subscribe((response) => {

      this.vehicleForm.reset();
      this.getVehicleDetails();

      const options = {
        title: 'Updated',
        message: 'Vehicle Details Updated Successfully!',
        confirmText: 'OK'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {

          this.show = !this.show;
        }
      });

    },
      (error) => {
        this.httperror = error;
      }
    );
  }
  requiredFileType(type: string[]) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        const extension = file.name.split('.')[1].toLowerCase();
        if (!type.some(s => s == extension.toLowerCase())) {
          return {
            requiredFileType: true
          };
        }

        return null;
      }

      return null;
    };
  }
  requiredFileSize(size: number) {
    return function (control: FormControl) {
      const file = control.value;
      if (file) {
        if (file.size / 1024 / 1024 > size) {
          return {
            requiredFileSize: true
          };
        }

        return null;
      }

      return null;
    };
  }
  createFileGroup() {
    return this.formBuilder.group({
      fileID: [0],
      fileMappingID: [0],
      userID: [0],
      fileName: [null],
      filePath: [null, Validators.required],
      fileType: [null],
      fileLocalPath: [null],
      filePropertyGroupID: [0],
      fileSource: [null, [this.requiredFileType(['png', 'jpg']), this.requiredFileSize(1)]]

    });
  }
  createForms() {
    this.changePasswordForm = this.formBuilder.group({
      [Change_Password_Metadata.currentPassword]: ['', Validators.required],
      [Change_Password_Metadata.newPassword]: [null,
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          CustomValidators.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
      ],
      [Change_Password_Metadata.confirmPassword]: ['', Validators.required]
    });

    this.profileForm = this.formBuilder.group({

      [Profile_METADATA.firstName]: ['', Validators.required],
      [Profile_METADATA.lastName]: ['', Validators.required],
      [Profile_METADATA.gender]: ['', Validators.required],
      [Profile_METADATA.email]: ['', [Validators.required, emailVaidatorsfor.emailVaidator]],
      [Profile_METADATA.phoneNumber]: ['', [Validators.required, Validators.pattern('^[1234567890][0-9]{9}$')]],
      [Profile_METADATA.address1]: ['', Validators.required],
      [Profile_METADATA.address2]: [''],
      [Profile_METADATA.city]: ['', Validators.required],
      [Profile_METADATA.state]: ['', Validators.required],
      [Profile_METADATA.zipCode]: ['', [Validators.required, Validators.max(99999)]],

      [Profile_METADATA.apt]: [''],
      [Profile_METADATA.aboutYou]: ['']
    });

    this.vehicleForm = this.formBuilder.group({
      'vehicleLicensePlateNumber': ['', Validators.required],
      'vehicleMake': ['', Validators.required],
      'vehicleModel': ['', Validators.required],
      'userID': ['', ''],
      color: ['', Validators.required],
      isDefault: [false, Validators.required]
    });

    // this.profileForm.valueChanges.subscribe((data) => {
    //   this.logValidationErrors(this.profileForm);
    // });

    // this.updatebutton = true;

    this.onPageLoad();
  }

  onSelectMake(event) {

  }
  
  setDefault() {
    let colorControl = this.vehicleForm.get('isDefault');
    colorControl.setValue(!colorControl.value);
  }

  onPageLoad() {
    this.getVehicleDetails();
    this.getuserprofile();
  }

  getuserprofile() {

    this.userService.getuserprofile(this.userid).subscribe((response) => {
      this.profileid = response.data[0].userProfileDetailsID;

      this.profileForm.patchValue(response.data[0]);
      this.profileForm.get(Profile_METADATA.address1).setValue(response.data[0].address);

      // this.modeselect = response.data[0].gender;

      // const fileGroup = this.imageForms.controls[0] as FormGroup;
      // fileGroup.patchValue(response.data[0].files);

      if (response.data[0].files) {
        this.imagealreadyavailble = response.data[0].files.filePath;
      }

      // else {
      //   $("#profile-file-upload").val("");
      //   this.cardImageBase64 = null;
      //   this.imagealreadyavailble = null;
      // }


      // const url = `${environment.apiURL}`;
      // this.updatebutton = false;
      // this.imagealreadyavailble = response.data[0].files[0].filePath;



    },
      (error) => {
        this.httperror = error;
      }
    );
  }
  // logValidationErrors(group: FormGroup = this.profileForm): void {
  //   this.errors = logValidationErrors(group);
  // }

  registerChangePasswordListeners() {
    this.changePasswordForm.get(Change_Password_Metadata.confirmPassword).valueChanges.subscribe((value) => {
      const newPasswordValue = this.changePasswordForm.get(Change_Password_Metadata.newPassword).value;
      if (value && value != newPasswordValue) {
        this.changePasswordForm.get(Change_Password_Metadata.confirmPassword).setErrors({ notIdentical: true });

      }
    });
    this.changePasswordForm.get(Change_Password_Metadata.newPassword).valueChanges.subscribe((value) => {
      const confirmPasswordControl = this.changePasswordForm.get(Change_Password_Metadata.confirmPassword);
      if (value && value != confirmPasswordControl.value && confirmPasswordControl.touched) {
        this.changePasswordForm.get(Change_Password_Metadata.confirmPassword).setErrors({ notIdentical: true });
      }
      else if (value && value === confirmPasswordControl.value && confirmPasswordControl.touched && confirmPasswordControl.value) {
        confirmPasswordControl.setErrors([]);
        confirmPasswordControl.updateValueAndValidity();
      }
    });
  }

  fileChangeEvent(fileInput: any) {

    this.imageError = null;
    if (fileInput.target.files && fileInput.target.files[0]) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg', 'image/jpg'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.target.files[0].size > max_size) {
        this.imageError =
          'Maximum size allowed is ' + max_size / 1000 + 'Mb';

        return false;
      }

      if (!lodash.includes(allowed_types, fileInput.target.files[0].type)) {
        this.imageError = 'Only Images are allowed ( JPG | JPEG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];

          console.log(img_height, img_width);


          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Maximum dimentions allowed ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            this.imagealreadyavailble = null;

            // this.profileService.SaveProfileImageBase64(this.cardImageBase64.replace('data:image/jpeg;base64,', ''))
            //   .subscribe(() => { });
            //  this.previewImagePath = imgBase64Path;
          }

        };
      };
      const file: File = fileInput.target.files[0];

      const fileGroup = this.imageForms.controls[0] as FormGroup;
      // const file=fileInput.target.files[0];
      reader.readAsDataURL(fileInput.target.files[0]);
      this.profileForm.patchValue({ 'files': fileInput.target.files[0] });
      if (fileInput.target.files.length > 0) {

        fileGroup.patchValue({
          fileSource: file,
          filePath: file.name,
          fileType: file.type,
          fileName: file.name,
        });
        this.profileForm.markAsDirty();
      }
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.imagealreadyavailble = null;
    this.imageForm.reset();
    this.profileForm.markAsDirty();
  }

  takePhoto() {
    const modalRef = this.modalService.open(TakePhotoComponent, { centered: true });
    modalRef.result.then((webCamImage: WebcamImage) => {
      this.webcamImage = webCamImage;
      this.cardImageBase64 = `data:image/jpeg;base64,${webCamImage.imageAsBase64}`;
      this.isImageSaved = true;
      this.profileService.SaveProfileImageBase64(this.cardImageBase64.replace('data:image/jpeg;base64,', ''))
        .subscribe(() => { });
      console.log(this.webcamImage.imageAsBase64);
    }).catch((error) => {
      console.log(error);
    });
  }

  updatePassword() {
    const body = this.changePasswordForm.value;
    body.email = this.email;
    this.httperror = null;
    this.userService.changePassword(body).subscribe((response: ApiResponse<CRUDApiResponseModel>) => {

      this.changePasswordForm.reset();
      const options = {
        title: 'Updated',
        message: 'Password Updated Successfully!',
        confirmText: 'OK'
      };
      this.dialogService.open(options);
      this.dialogService.confirmed().subscribe(confirmed => {
        if (confirmed) {

        }
      });

    },
      (error) => {
        this.httperror = error;
      }
    );
  }
  toFormData<T>(formValue: T, formData: FormData) {

    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      if (value != null && value != '') {
        formData.append(key, value);
      }
    }

    return formData;
  }
  saveProfile() {
    if (this.profileForm.invalid) {
      // this.logValidationErrors();
    }
    else {
      let formData = new FormData();
      let body = this.profileForm.value;
      delete body.phone;
      // body.phoneNumber = this.profileForm.get(Profile_METADATA.phoneNumber).value.number;
      body.userID = this.userid;
      body.UserProfileDetailsID = this.profileid;

      delete body['files'];

      formData = this.toFormData(this.profileForm.value, formData);

      for (let i = 0; i < this.imageForm.get('files').value.length; i++) {

        if (this.imageForm.get('files').value[i].filePath != null) {
          formData.append("files.filePath", this.imageForm.get('files').value[i].filePath)
        }
        // var filePath="files[" + i + "].filePath";
        // datafiles.filePath= this.imageForm.get('files').value[i].filePath;
        if (this.imageForm.get('files').value[i].fileSource != null) {
          formData.append("files.fileSource", this.imageForm.get('files').value[i].fileSource)
        }

        if (this.imageForm.get('files').value[i].fileID != null) {
          formData.append('files.fileID', this.imageForm.get('files').value[i].fileID);
        }
        if (this.imageForm.get('files').value[i].fileMappingID != null) {
          formData.append("files.fileMappingID", this.imageForm.get('files').value[i].fileMappingID)
        }

        if (this.imageForm.get('files').value[i].fileName != null) {
          formData.append("files.fileName", this.imageForm.get('files').value[i].fileName)
        }

        if (this.imageForm.get('files').value[i].fileType != null) {
          formData.append("files.fileType", this.imageForm.get('files').value[i].fileType)
        }
      }
      formData.append('files.UserID', this.userid.toString());

      this.httperror = null;

      this.userService.updateProfile(formData).subscribe((response: ApiResponse<CRUDApiResponseModel>) => {
        this.profileForm.reset();
        this.imageForm.reset();
        this.getuserprofile();


        const options = {
          title: 'Updated',
          message: 'Profile Updated Successfully!',
          confirmText: 'OK'
        };
        this.dialogService.open(options);
        this.dialogService.confirmed().subscribe(confirmed => {
          if (confirmed) {

          }
        });

      },
        (error) => {
          this.httperror = error;
        }
      );
      // this.profileSaved = true;
    }
  }
  // phonevalueChanges(value) {
  //   if (!this.isInit) {
  //     this.profileForm.get(Profile_METADATA.phone).markAsTouched();
  //     this.profileForm.get(Profile_METADATA.phone).patchValue(value || '');
  //   }
  //   this.isInit = false;
  // }
  ngAfterViewInit() {
    this.initializeAutoComplete();
  }
  geoCoder;
  initializeAutoComplete() {
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          this.onAutocompleteSelected(place);
          console.log(place);
        });
      });
    });
  }

  componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

  logValidationErrors(group: FormGroup = this.changePasswordForm): void {

    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';

      if (abstractControl && !abstractControl.valid) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            if (this.formErrors[key] == '')
              this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  };

  formErrors = {

    [Change_Password_Metadata.currentPassword]: '',
    [Change_Password_Metadata.newPassword]: '',
    [Change_Password_Metadata.confirmPassword]: ''

  };

  // This object contains all the validation messages for this form
  validationMessages = {
    [Change_Password_Metadata.currentPassword]: {
      required: 'Current Password is required'
    },
    [Change_Password_Metadata.newPassword]: {
      required: "New Password is required",
      minlength: "Must be at least 8 characters!",
      hasNumber: "Must contain at least 1 number!",
      hasCapitalCase: "Must contain at least 1 in Capital Case!",
      hasSmallCase: "Must contain at least 1 Letter in Small Case!",
      hasSpecialCharacters: "Must contain at least 1 Special Character!"
    },
    [Change_Password_Metadata.confirmPassword]: {
      required: 'Change Password is required.',
      notIdentical: 'Confirm Password must be Identical to New Password'
    },

  };

  onAutocompleteSelected(value) {

    if (value.address_components) {
      this.profileForm.get(Profile_METADATA.city).setValue(null);
      this.profileForm.get(Profile_METADATA.state).setValue(null);
      this.profileForm.get(Profile_METADATA.zipCode).setValue(null);
      let addressLine1;
      for (var i = 0; i < value.address_components.length; i++) {
        var addressType = value.address_components[i].types[0];
        if (this.componentForm[addressType]) {
          var val = value.address_components[i][this.componentForm[addressType]];
          if (addressType == 'street_number' || addressType == 'route') {
            if (addressLine1) {
              addressLine1 = `${addressLine1} ${val}`;
            }
            else {
              addressLine1 = val;
            }
          }
          else if (addressType == 'locality') {
            this.profileForm.get(Profile_METADATA.city).setValue(val);
          }
          else if (addressType == 'administrative_area_level_1') {
            this.profileForm.get(Profile_METADATA.state).setValue(val);
          }

          else if (addressType == 'postal_code') {
            this.profileForm.get(Profile_METADATA.zipCode).setValue(val);
          }
        }
      }
      this.profileForm.get(Profile_METADATA.address1).setValue(addressLine1);

    }

  }

  editVehiclePlate(vehicleDetails: any) {
    const dialogRef = this.dialog.open(EditLicensePlateComponent, {
      width: '800px',
      data: vehicleDetails,
      minHeight: '180px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.getVehicleDetails();
      }

    });
  }
  deleteVehiclePlate(vehicleID) {

    const options = {
      title: 'Confirmation',
      message: 'Are you sure want to delete this',
      confirmText: 'Confirm',
      cancelText: 'Cancel'
    };
    this.dialogService.open(options);
    this.dialogService.confirmed().subscribe(confirmed => {
      if (confirmed) {
        this.userService.deleteVehicleDetails(vehicleID)
          .subscribe((response) => {

            this.getVehicleDetails();
            const options = {
              title: 'Updated',
              message: 'Deleted Successfully!',
              confirmText: 'OK'
            };
            this.dialogService.open(options);
            this.dialogService.confirmed().subscribe(confirmed => {
              if (confirmed) {

              }
            });

          }, (error) => {
            this.httperror = error;
          })
        // this.createForms();
        this.show = !this.show;
      }
    });
  }
}
