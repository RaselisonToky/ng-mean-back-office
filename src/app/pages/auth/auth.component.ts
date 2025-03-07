import { Component } from '@angular/core';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-auth',
  imports: [LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
}
