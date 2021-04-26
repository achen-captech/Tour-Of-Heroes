import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../models/hero';
import { HeroService } from '../services/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
})
export class HeroSearchComponent implements OnInit {
  heroes$: Observable<Hero[]> = of([]);
  // RxJS Subject - is both a source of observable values & an Observable itself. You can subscribe to a Subject as you would any Observable
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // passing a new search term directly to teh searchHeroes() after every user keystroke would create an excessive amount of HTTP requests, taxing server resources & burning through data plans
  // this method pipes the searchTerms observable through a sequence of RxJS operators that reduce the number of calls to the searchHeroes(), ultimately returning an observable of timely hero search results (each a Hero[])
  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term))
    );
  }

  search(term: string): void {
    // push values into searchTerms
    // every time the user types in the textbox, the binding calls search() with the textbox value, a "search term"
    // searchTerms becomes an Observable emitting a steady stream of search terms
    this.searchTerms.next(term);
  }
}
