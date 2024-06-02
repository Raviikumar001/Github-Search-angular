import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache: Map<string, any>;

  constructor() {
    this.cache = new Map<string, any>();
    this.loadCacheFromLocalStorage();
  }

  private loadCacheFromLocalStorage(): void {
    const cacheData = localStorage.getItem('cache');
    if (cacheData) {
      this.cache = new Map<string, any>(JSON.parse(cacheData));
    }
  }

  private saveCacheToLocalStorage(): void {
    localStorage.setItem(
      'cache',
      JSON.stringify(Array.from(this.cache.entries()))
    );
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  set(key: string, value: any): void {
    this.cache.set(key, value);
    this.saveCacheToLocalStorage();
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
    localStorage.removeItem('cache');
  }

  getObservable<T>(key: string, fetch: Observable<T>): Observable<T> {
    if (this.has(key)) {
      return of(this.get(key));
    } else {
      return fetch.pipe(tap((value) => this.set(key, value)));
    }
  }
}
