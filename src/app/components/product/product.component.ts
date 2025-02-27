import {Component, OnInit} from '@angular/core';
import {ProductType} from '../../types/productTypes';
import {ProductService} from '../../services/product.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {ActivatedRoute, Router,} from '@angular/router';
import {catchError, Observable, of, switchMap} from 'rxjs';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [
    NgIf,
    AsyncPipe
  ],
  styleUrl: './product.component.less'
})
export class ProductComponent implements OnInit {

  product$: Observable<ProductType | undefined> = new Observable<ProductType>();


  constructor(protected readonly productService: ProductService,
              private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly orderService: OrderService) {
  }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');

        if (productId) {
          return this.productService.getProductById(productId).pipe(
            catchError(error => {
              console.error('Ошибка при получении продукта:', error);
              return of(undefined);
            })
          );
        } else {
          console.error('Product ID is missing.');
          return of(undefined);
        }
      })
    );
  }


  orderProduct(product: ProductType) {
    this.orderService.selectProduct(product);
    this.router.navigate(['order'])
  }
}
