import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import {User} from '../../../user/model/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  error = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);
    this.error.set(null);
    const loginData = {
      username: this.username,
      password: this.password
    };
    try {
      const response: any = await lastValueFrom(this.authService.login(loginData));
      if (response && response.token) {
        this.authService.setAuth(response.token);
        await this.router.navigate(['/']);
      } else {
        this.error.set("Une erreur inattendue s'est produite.");
      }
    } catch (err: any) {
      if (err.status === 401) {
        this.error.set("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        this.error.set("Une erreur s'est produite.");
        console.error("Login error:", err);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
