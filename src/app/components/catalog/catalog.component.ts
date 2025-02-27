import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {ProductType} from '../../types/productTypes';
import {NgForOf} from '@angular/common';
import {TruncateTextPipe} from '../../pipes/truncate-text.pipe';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-catalog',
  standalone: true,
  templateUrl: './catalog.component.html',
  imports: [
    NgForOf,
    TruncateTextPipe,
    FormsModule,
  ],
  styleUrl: './catalog.component.less'
})
export class CatalogComponent implements OnInit, OnDestroy {

  protected products: ProductType[] = []
  protected catalogTitle = 'Наши чайные коллекции';
  protected isLoading: boolean = true;
  protected query = signal<string>('');
  private subscription: Subscription = new Subscription();

  constructor(protected readonly productService: ProductService,
              private readonly router: Router) {
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


  protected onSearch(): void {

    if (this.query()) {
      this.isLoading = true;
      this.subscription.add(
        this.productService.searchProduct(this.query()).subscribe((result) => {
          this.products = result;
          this.isLoading = false;
          if (this.products.length > 0) {
            this.catalogTitle = "Результат поиска по запросу " + this.query();
          } else {
            this.catalogTitle = "Ничего не найдено"
          }
        })
      )}
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  protected clearSearch() {
    this.getProducts();
    this.catalogTitle = 'Наши чайные коллекции';
    this.query.set('');
  }
}
