import {
  Clock,
  Wrench,
  Bookmark,
  Grid2x2,
  Truck,
  Newspaper,
  RotateCcw
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
    label: 'STOCK & MATERIEL',
    display: true,
    items: [
      {
        id: 'transaction',
        label: 'Transaction',
        href: '/inventory/transactions',
        icon: RotateCcw,
        roles: ['ADMIN'],
      },
      {
        id: 'delivery',
        label: 'Livraison',
        href: '#',
        icon: Truck,
        roles: ['ADMIN'],
      },
      {
        id: 'supplierOrder',
        label: 'Commande fournisseur',
        href: '#',
        icon: Newspaper,
        roles: ['ADMIN'],
      },
    ],
  },
];
