import { Component, OnInit, signal } from '@angular/core'
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
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = signal<string | null>(null);
  isLoading = signal<boolean>(false);
  isAdmin = signal<boolean>(true);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.updateDefaultCredentials();
  }

  toggleRole() {
    this.isAdmin.update(current => !current);
    this.updateDefaultCredentials();
  }

  updateDefaultCredentials() {
    if (this.isAdmin()) {
      this.username = 'admin';
      this.password = 'admin';
    } else {
      this.username = 'mechanic1';
      this.password = 'password';
    }
  }

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
