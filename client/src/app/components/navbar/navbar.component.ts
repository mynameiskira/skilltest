import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [RouterLink, CommonModule],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
    public auth = inject(AuthService);
}
