import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {OrderService} from '../../services/order.service';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrl: './order.component.less'
})
export class OrderComponent implements OnInit {

  protected orderForm: FormGroup;
  protected isShowForm: boolean = true;
  protected isShowMessage: boolean = false;
  protected isShowError: boolean = false;
  protected isDisabled: boolean = false;

  constructor(public fb: FormBuilder,
              private orderService: OrderService,
  ) {
    this.orderForm = this.fb.group({
      product: [''],
      name: ['', [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-я]+$/)]],
      last_name: ['', [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-я]+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{11}$/)]],
      zip: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      country: ['', [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-я]+$/)]],
      address: ['', [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-я0-9][A-Za-zА-Яа-я0-9\s\-\/]*$/)]],
      comment: [''],
    });
  }

  public ngOnInit(): void {
    this.orderService.selectedProduct$.subscribe(product => {
      if (product && product.title) {
        this.orderForm.patchValue({product: product.title});
      } else {
        console.error('Product or product title is undefined');
      }
    });
  }


  protected onSubmit() {
    this.isDisabled = true
    this.orderService.orderBuy(this.orderForm.value)
      .subscribe({
        next: (value) => {
          if (value.success === 1) {
            this.isShowForm = false;
            this.isShowMessage = true;
            this.isDisabled = false;
          } else {
            this.isShowError = true;
            this.isDisabled = false;
          }
        },
        error: () => {
          this.isShowError = true;
          this.isDisabled = false;
        }
      });

  }
}
