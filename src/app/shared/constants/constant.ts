import {STATUS} from '../../pages/appointment/model/appointment.model';

export const STATUS_CHIP_COLORS: { [key in STATUS]: { backgroundColor: string; borderColor: string; color: string } } = {
  [STATUS.PENDING]: {
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEEBA',
    color: '#856404',
  },
  [STATUS.CONFIRMED]: {
    backgroundColor: '#D4EDDA',
    borderColor: '#C3E6CB',
    color: '#155724',
  },
  [STATUS.IN_MAINTENANCE]: {
    backgroundColor: '#D1ECF1',
    borderColor: '#BEE5EB',
    color: '#0C5460',
  },
  [STATUS.SUSPENDED]: {
    backgroundColor: '#F8D7DA',
    borderColor: '#F5C6CB',
    color: '#721C24',
  },
  [STATUS.FINISHED]: {
    backgroundColor: '#E2E3E5',
    borderColor: '#D6D8DB',
    color: '#383D41',
  },
};

export const STATUS_LABELS_FR: { [key in STATUS]: string } = {
  [STATUS.PENDING]: 'En attente',
  [STATUS.CONFIRMED]: 'Confirmé',
  [STATUS.IN_MAINTENANCE]: 'En maintenance',
  [STATUS.SUSPENDED]: 'Suspendu',
  [STATUS.FINISHED]: 'Terminé',
};
