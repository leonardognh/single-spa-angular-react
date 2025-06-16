import { Component, OnDestroy, OnInit } from '@angular/core';
import { $test, eventTest } from '@fiap/shared-data';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  constructor() {}

  ngOnInit() {
    $test.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      console.log('Valor recebido no Angular:', value);
    });
  }

  eventTestAngular() {
    eventTest('bla');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
