import {Component, Input, Inject, signal, effect} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { menuItems, MenuItem } from './menu-items';
import { LucideAngularModule, ChevronDown, ChevronUp } from 'lucide-angular';
import { PLATFORM_ID } from '@angular/core';
import {AuthService} from '../../pages/auth/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;

  @Input() isOpen = true;
  expandedCategories = signal<string[]>([]);
  menuItems: MenuItem[];
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.menuItems = this.filterMenuItems(menuItems);
    if (this.isBrowser) {
      effect(() => {
        localStorage.setItem('sidebarExpandedCategories', JSON.stringify(this.expandedCategories()));
      });
      const saved = localStorage.getItem('sidebarExpandedCategories');
      if (saved) {
        this.expandedCategories.set(JSON.parse(saved));
      }
    }
  }

  private filterMenuItems(menuItems: MenuItem[]): MenuItem[] {
    const userRoles = this.authService.getRoles();
    if (!userRoles) {
      return [];
    }
    return menuItems.filter(item => {
      if (!item.items) {
        return item.roles === undefined || item.roles.some((role: string) => userRoles.includes(role));
      }
      item.items = this.filterMenuItems(item.items);
      return item.items.length > 0;
    });
  }

  toggleCategory(categoryId: string) {
    this.expandedCategories.update(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }

  isCategoryExpanded(categoryId: string): boolean {
    return this.expandedCategories().includes(categoryId);
  }
}
