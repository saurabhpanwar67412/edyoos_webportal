import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/common.service ';
import { PaymentService } from 'src/app/shared/payment.service';
import * as moment from 'moment';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
@Component({
  selector: 'app-cart-confirmation',
  templateUrl: './cart-confirmation.component.html',
  styleUrls: ['./cart-confirmation.component.scss']
})
export class CartConfirmationComponent implements OnInit {
  myDate = Date.now();
  orderDetails: any[] = [];
  closeResult: string;
  isSpinner = false;
  currentloc;
  currentAdd: string;
  barcodevalue:string;
  invoiceNumber:string;
  format = 'CODE128';
  lineColor = '#000000';
  width = 1;
  height = 20;
  displayValue = true;
  fontOptions = '';
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 8;
  background = '#ffffff';
  margin = 5;
  marginTop = 5;
  marginBottom = 5;
  marginLeft = 5;
  marginRight = 5;
  @ViewChild('mymodal', { read: TemplateRef }) mymodal:TemplateRef<any>;
  constructor(private route: ActivatedRoute, public commonService: CommonService, public paymentService: PaymentService,private modalService: NgbModal) { }
  ngOnInit(): void {
    this.currentloc = localStorage.getItem("latandlong");
    this.currentAdd = localStorage.getItem("currentAddress") == null ? "My+Location" : localStorage.getItem("currentAddress");
    this.route.params.subscribe(params => {
      const orderID = params && params.id;
      this.paymentService.getBookingDetailsById(orderID).subscribe((details) => {
        debugger;
        this.orderDetails = details.data as unknown as any[];
        console.log(details.data);
        var result=details.data;
        this.barcodevalue=moment(new Date(this.orderDetails[0].toDate)).format("YYYYMMDDhhmmss");
        this.invoiceNumber=this.orderDetails[0].invoiceNumber.toUpperCase( );
        this.isSpinner = true;
        if(params.qrcodescan)
      {
        this.loginclick(this.mymodal);
      }
      
      }, () => this.isSpinner = true);
    });

  }

  public get additionalFee(): number {
    let additionalFees:number=0;
    if(this.orderDetails && this.orderDetails.length > 0){
      this.orderDetails.forEach((val,index)=>{
        additionalFees+=val.additionalFee;
      });
     return additionalFees;
    }
      
  }

  loginclick(value)
  {
    debugger;
    this.modalService.open(value, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  public get totalAmount(): number {
    return this.orderDetails && this.orderDetails.length > 0
      && this.orderDetails[0].totalAmount ? this.orderDetails[0].totalAmount : 0
  }
  public get name(): number {
    return this.orderDetails && this.orderDetails.length > 0
      && this.orderDetails[0].name ? this.orderDetails[0].name : '';
  }
  getImage(order: any): string {
    return order && order.files && order.files[0] && order.files[0].filePath ? order.files[0].filePath : '';
  }

}
