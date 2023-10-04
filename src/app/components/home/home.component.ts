import { Component } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { Game } from 'src/app/models/game';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  games: Game[] = [];
  filteredGames: Game[] = [];

  constructor(
    private homeService: HomeService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.loadGameData();

    this.filterService.filters$.subscribe((filters) => {
      this.applyFilters(filters);
    });
  }

  private loadGameData() {
    this.homeService.getGame().subscribe((data: Game[]) => {
      this.games = data;
      this.filteredGames = [...this.games];
      // console.log('dataload',data);
    });
  }

  applyFilters(filters: any) {
    // Aplica los filtros recibidos a los juegos
    this.filteredGames = this.games.filter((game) => {
      // Aplica los filtros seleccionados aquí
      if (filters.platforms.length > 0 && !filters.platforms.includes(game.platform)) {
        return false;
      }

      if (filters.genres.length > 0 && !filters.genres.includes(game.genre)) {
        return false;
      }

      if (filters.developers.length > 0 && !filters.developers.includes(game.developer)) {
        return false;
      }

      if (filters.highRating && game.averageRating === null) {
        return false;
      }

      if (filters.lowRating && game.averageRating !== null) {
        return false;
      }

      // Si pasa todos los filtros, incluye el juego en la lista filtrada
      return true;
    });
  }
}
