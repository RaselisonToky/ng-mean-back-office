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
  Hotel,
  Caravan,
  Settings2,
  PenTool,
  Wrench,
  ScrollText,
  Package,
  Bookmark,
  Car,
  Grid2x2,
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
      {
        id: 'dashboard',
        label: 'Tableau de bord',
        href: '/garage',
        icon: Grid2x2,
        roles: ['ADMIN'],
      },
      {
        id: 'appointment',
        label: 'Rendez-vous',
        href: '/appointment',
        icon: Bookmark,
        roles: ['ADMIN'],
      },
    ],
  },
  {
    id: 'intervention',
    label: 'INTERVENTION',
    display: true,
    roles: ['ADMIN'],
    items: [
      {
        id: 'interv-appointment',
        label: 'Planifier un rendez-vous',
        href: '/appointment-form',
        icon: Clock,
        roles: ['ADMIN'],
      },
    ],
  },
  {
    id: 'settings',
    label: 'CONFIGURATION',
    display: true,
    items: [
      {
        id: 'prestation',
        label: 'Prestation',
        href: '/service',
        icon: Wrench,
        roles: ['ADMIN'],
      },
    ],
  },
  {
    id: 'inventory',
    label: 'MATERIEL',
    display: true,
    items: [
      {
        id: 'piece',
        label: 'Piece Detachée',
        href: '#',
        icon: Settings,
        roles: ['ADMIN'],
      },
      {
        id: 'commande',
        label: 'Commande',
        href: '#',
        icon: Package,
        roles: ['ADMIN'],
      },
    ],
  },
];
