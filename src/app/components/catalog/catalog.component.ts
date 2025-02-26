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
  private inputElement: HTMLInputElement | null = null;
  protected isLoading: boolean = true;
  private query: string = '';
  private subscription: Subscription = new Subscription();

  constructor(protected productService: ProductService, private router: Router) {
  }

  public ngOnInit() {
    this.getProducts();
  }

  private getProducts() {
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

  protected learnMore(product: ProductType): void {
    this.router.navigate(['/product', product.id]);

  }


  protected onSearch(input: HTMLInputElement, button: HTMLElement): void {

    const button$ = fromEvent(button, 'click');

    if (input) {
      this.inputElement = input;
    }
    this.subscription.add(
      button$.pipe(
        exhaustMap(() => {
          const query = input.value;
          this.query = query;
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
          this.catalogTitle = "Результат поиска по запросу " + this.query;
        } else {
          this.catalogTitle = "Ничего не найдено"
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected clearSearch() {
    this.getProducts();
    this.catalogTitle = 'Наши чайные коллекции';
    if (this.inputElement) {
      this.inputElement.value = '';
    }
  }
}
