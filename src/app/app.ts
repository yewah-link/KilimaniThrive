import { Component } from '@angular/core';
import { MainLayoutComponent } from './shared/layout/main-layout';

@Component({
  selector: 'app-root',
  imports: [MainLayoutComponent],
  template: `<app-main-layout />`
})
export class App {}
