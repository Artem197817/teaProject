import {Component, OnInit} from '@angular/core';
import {ProductType} from '../../types/productTypes';
import {ProductService} from '../../services/product.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {ActivatedRoute, Router,} from '@angular/router';
import {map, Observable, switchMap} from 'rxjs';
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


  constructor(protected productService: ProductService,
              private route: ActivatedRoute,
              private router: Router,
              private orderService: OrderService,) {
  }

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const productId = params.get('id');

        if (productId) {
          return this.productService.getProducts().pipe(
            map(products => products.find(product => product.id === parseInt(productId)))
          );
        } else {
          console.error('Product ID is missing.');
          return new Observable<undefined>();
        }
      })
    );
  }


  orderProduct(product: ProductType) {
    this.orderService.selectProduct(product);
    this.router.navigate(['order'])
  }
}
