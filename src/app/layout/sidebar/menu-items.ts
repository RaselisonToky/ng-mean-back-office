import {
  Clock, Grid2x2, Truck,
  RotateCcw, CircuitBoard,
  ClipboardList, Layers2, CalendarCheck, LayoutGrid,
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
        href: '/dashboard',
        icon: LayoutGrid, roles: ['ADMIN']
      },
      {
        id: 'appointment',
        label: 'Rendez-vous',
        href: '/appointment',
        icon: CalendarCheck, roles: ['ADMIN']
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
        label: 'Planifier rendez-vous',
        href: '/appointment-form',
        icon: Clock, roles: ['ADMIN']
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
        icon: Layers2, roles: ['ADMIN']
      },
    ],
  },
  {
    id: 'monitoring',
    label: 'MONITORING',
    display: true,
    roles: ['ADMIN'],
    items: [
      {
        id: 'task',
        label: 'Mes tâches',
        href: '/task',
        icon: Grid2x2, roles: ['MECHANIC']
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
        href: '/inventory/deliveries',
        icon: Truck,
        roles: ['ADMIN'],
      },
      {
        id: 'supplierOrder',
        label: 'Commande fournisseur',
        href: '#',
        icon: ClipboardList,
        roles: ['ADMIN'],
      },
      {
        id: 'piece',
        label: 'Pièces détachée',
        href: '/inventory/pieces',
        icon: CircuitBoard,
        roles: ['ADMIN'],
      },
    ],
  },
];
