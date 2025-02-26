import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {ProductType} from '../types/productTypes';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url: string = 'https://testologia.ru/tea';


  constructor(private http: HttpClient) {
  }


  getProducts(): Observable<ProductType[]> {
    return this.http.get<ProductType[]>(this.url);
  }


  getProductById(id: string): Observable<ProductType> {
    return this.http.get<ProductType>(`${this.url}?id=${id}`);
  }

  searchProduct(query: string): Observable<ProductType[]> {
    return this.http.get(`${this.url}?search=${query}`).pipe(
      map((response: any) => response as ProductType[])
    );
  }


}
