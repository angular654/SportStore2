import { Injectable } from "@angular/core";
//import { Http, Request, RequestMethod } from "@angular/http";

import { Product } from "./product.model";
import { Cart } from "./cart.model";
import { Order } from "./order.model";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
const PROTOCOL = "http";
const PORT = 3500;
@Injectable()
export class RestDataSource {
    baseUrl: string;
    auth_token: string;
    constructor(private http: HttpClient) {
        this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
    }
    authenticate(user: string, pass: string): Observable<boolean> {
        return this.http.post<{ success: boolean, token: string }>(this.baseUrl + "login", { name: user, password: pass })
            .pipe(
                map((r) => {
                    this.auth_token = r.success ? r.token : null;
                    return r.success;
                }));
    }
    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.baseUrl + `products`);
    }
    saveProduct(product: Product): Observable<Product> {
        return this.http.post<Product>(this.baseUrl + `products`, product, {
            headers: {
                Authorization: `Bearer<${this.auth_token}>`
            }
        });
    }
    saveOrder(order: Order): Observable<Order> {
        return this.http.post<Order>(this.baseUrl + `orders`, order,
            {
                headers: {
                    Authorization: `Bearer<${this.auth_token}>`
                }
            });
    }
    updateProduct(product : Product): Observable<Product> {
        return this.http.put<Product>(this.baseUrl + `products/${product.id}`,product,{
            headers: {
                Authorization: `Bearer<${this.auth_token}>`
            }
        });
    }
    deleteProduct(id: number): Observable<Product> {
        return this.http.delete<Product>(this.baseUrl + `products/${id}`, {
            headers: {
                Authorization: `Bearer<${this.auth_token}>`
            }
        });
        //return this.sendRequest(RequestMethod.Delete,
        //  `products/${id}`, null, true);
    }
    getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + `orders`, {headers: {
            Authorization: `Bearer<${this.auth_token}>`
        }});
        // return this.sendRequest(RequestMethod.Get,
        //   "orders", null, true);
    }
    deleteOrder(id: number): Observable<Order> {
        return this.http.delete<Order>(this.baseUrl + `orders/${id}`, {
            headers: {
                Authorization: `Bearer<${this.auth_token}>`
            }
        });
        //return this.sendRequest(RequestMethod.Delete,
        //  `orders/${id}`, null, true);
    }
    updateOrder(order: Order): Observable<Order> {
        return this.http.put<Order>(this.baseUrl + `orders/${order.id}`, order, {
            headers: {
                Authorization: `Bearer<${this.auth_token}>`
            }
        });
        // return this.sendRequest(RequestMethod.Put,
        //  `orders/${order.id}`, order, true);
    }
    // private sendRequest(verb: RequestMethod,
    //     url: string, body?: Product | Order, auth: boolean = false)
    //     : Observable<Product | Product[] | Order | Order[]> {
    //     let request = new Request({
    //         method: verb,
    //         url: this.baseUrl + url,
    //         body: body
    //     });
    //     if (auth && this.auth_token != null) {
    //         request.headers.set("Authorization", `Bearer<${this.auth_token}>`);
    //     }
    //     return this.http.request(request).map(response => response.json());
    // }
}