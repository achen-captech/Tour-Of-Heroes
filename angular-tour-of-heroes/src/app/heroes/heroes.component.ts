import { Component, OnInit } from '@angular/core';
import { Hero } from './../hero';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
})
export class HeroesComponent implements OnInit {
  selectedHero?: Hero;
  heroes: Hero[] = [];

  // simultaneously defines a private heroService property & identifies it as a HeroService injection site
  // when Angular creates a HeroesComponent, the DI system sets the heroService parameter to a singleton instance of HeroService
  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  getHeroes(): void {
    // waits for Observable in service to emit array of heroes --> subscribe() passess the
    // emitted array to the callback which sets the component's heroes property
    this.heroService.getHeroes().subscribe((heroes) => (this.heroes = heroes));
  }
}
