import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth.service';;

@Component({
  selector: 'app-camping-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './camping-navbar.component.html',
  styleUrl: './camping-navbar.component.scss'
})
export class CampingNavbarComponent {

  constructor(public authService: AuthService) {}

  isGuide(): boolean {
    return this.authService.roles()[0] === 'GUIDE';
  }
}
