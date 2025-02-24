import { Routes } from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {CatalogComponent} from './components/catalog/catalog.component';
import {ProductComponent} from './components/product/product.component';
import {OrderComponent} from './components/order/order.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'product/:id', component: ProductComponent },
  { path: 'order', component: OrderComponent },
  // { path: '', redirectTo: '/main', pathMatch: 'full' },
  { path: '**', redirectTo: '/main' },
];
