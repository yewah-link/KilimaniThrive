import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero';
import { DailyScriptureComponent } from './components/daily-scripture/daily-scripture';
import { TestimonialsComponent } from './components/testimonials/testimonials';
import { BibleStudyCtaComponent } from './components/bible-study-cta/bible-study-cta';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    DailyScriptureComponent,
    TestimonialsComponent,
    BibleStudyCtaComponent
  ],
  template: `
    <app-hero />
    <app-daily-scripture />
    <app-testimonials />
    <app-bible-study-cta />
  `
})
export class HomeComponent {}
