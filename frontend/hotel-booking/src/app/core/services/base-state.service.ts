import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { ApiState } from '../interfaces/api-state.interface';

@Injectable()
export abstract class BaseStateService<T> implements OnDestroy {
  protected state$ = new BehaviorSubject<ApiState<T>>({ status: 'idle' });

  public data$: Observable<T> = this.state$
    .asObservable()
    .pipe(
      filter((state) => state.status === 'success'),
      map((state) => state.data as T)
    );

  public isLoading$: Observable<boolean> = this.state$
    .asObservable()
    .pipe(map(({ status }) => status === 'loading'));

  public error$: Observable<Error | null> = this.state$
    .asObservable()
    .pipe(
      map((state) => state.status === 'error' ? state.error || null : null)
    );

  public hasLoaded$: Observable<boolean> = this.state$
    .asObservable()
    .pipe(map(({ status }) => status !== 'idle'));

  ngOnDestroy(): void {
    this.state$.complete();
  }

  protected setState(state: ApiState<T>): void {
    this.state$.next(state);
  }
}
