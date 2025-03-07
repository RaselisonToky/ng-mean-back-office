import { Component, EventEmitter, Output } from '@angular/core';
import {AuthService} from '../../pages/auth/services/auth.service';
import {LogOut, LucideAngularModule} from 'lucide-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [
    LucideAngularModule
  ],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly LogOut = LogOut;

  constructor(private authService: AuthService) {}

  @Output() toggleSidebar = new EventEmitter<void>();

  onLogout() {
    this.authService.logout();
  }
}
