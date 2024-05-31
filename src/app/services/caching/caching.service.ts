import { Injectable } from '@angular/core';
import { Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CachingService {
  private cache: { [key: string]: Observable<any> } = {};

  getObservable(key: string, observable: Observable<any>): Observable<any> {
    if (!this.cache[key]) {
      this.cache[key] = observable.pipe(shareReplay(1));
    }
    return this.cache[key];
  }

  clearCache(key?: string) {
    if (key) {
      delete this.cache[key];
    } else {
      this.cache = {};
    }
  }
}
