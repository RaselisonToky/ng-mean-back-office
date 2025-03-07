import {
  LucideAngularModule,
  File,
  Home,
  Menu,
  UserCheck,
  User,
  Lock,
  Settings,
  Clock,
  House,
  Hotel, Caravan, Settings2, PenTool, Wrench, ScrollText
} from 'lucide-angular';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  icon?: string | any;
  items?: MenuItem[];
  display?: boolean;
  roles?: string[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'monitoring',
    label: 'MONITORING',
    display: true,
    roles: ['ADMIN'],
    items: [
      { id: 'dashboard', label: 'Tableau de bord', href: '/garage', icon: Home, roles: ['ADMIN'] },
      { id: 'maintenance', label: 'Maintenance', href: '/maintenance', icon: Wrench, roles: ['ADMIN'] },
      { id: 'appointment', label: 'Rendez-vous', href: '/dashboard', icon: Clock, roles: ['ADMIN'] },
    ]
  },
  {
    id: 'intervention',
    label: 'INTERVENTION',
    display: true,
    roles: ['ADMIN'],
    items: [
      { id: 'interv-appointement', label: 'Rendez-vous', href: '/appointment', icon: Home, roles: ['ADMIN'] },
      { id: 'interv-maintenance', label: 'Mécanicien', href: '/m', icon: Wrench, roles: ['ADMIN'] },
    ]
  },
  {
    id: 'settings',
    label: 'CONFIGURATION',
    display: true,
    items: [
      { id: 'prestation', label: 'Prestation', href: '/service', icon: ScrollText, roles: ['ADMIN'] },
      { id: 'security', label: 'Security', href: '/settings/security', icon: UserCheck, roles: ['ADMIN'] }
    ]
  }
];
