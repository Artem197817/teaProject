import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ProductType} from '../../types/productTypes';
import {NgForOf, NgIf} from '@angular/common';
import {TruncateTextPipe} from '../../pipes/truncate-text.pipe';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {catchError, exhaustMap, fromEvent, Subscription, tap} from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  templateUrl: './catalog.component.html',
  imports: [
    NgForOf,
    TruncateTextPipe,
    FormsModule,
    NgIf
  ],
  styleUrl: './catalog.component.less'
})
export class CatalogComponent implements OnInit, OnDestroy {

  protected products: ProductType[] = []
  protected catalogTitle = 'Наши чайные коллекции';
  protected inputElement: HTMLInputElement | null = null;
  protected isLoading: boolean = true;

  constructor(protected productService: ProductService, private router: Router) {
  }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.isLoading = true;
    this.productService.getProducts()
      .subscribe({
        next: (value) => {
          this.products = value;
          this.isLoading = false;
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        }
      });

  }

  learnMore(product: ProductType): void {
    this.router.navigate(['/product', product.id]);

  }


  private subscription: Subscription = new Subscription();

  onSearch(input: HTMLInputElement, button: HTMLElement): void {

    const button$ = fromEvent(button, 'click');
    const query = input.value;
    if (input) {
      this.inputElement = input;
    }
    this.subscription.add(
      button$.pipe(
        exhaustMap(() => {
          this.isLoading = true;
          return this.productService.searchProduct(query).pipe(
            tap((response) => {
              this.products = response;
            }),
            catchError((error) => {
              console.error('Ошибка при поиске продуктов:', error);
              return [];
            })
          );
        })
      ).subscribe(() => {
        this.isLoading = false;
        if (this.products.length > 0) {
          this.catalogTitle = "Результат поиска по запросу " + query;
        } else {
          this.catalogTitle = "Ничего не найдено"
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearSearch() {
    this.getProducts();
    this.catalogTitle = 'Наши чайные коллекции';
    if (this.inputElement) {
      this.inputElement.value = '';
    }
  }
}
