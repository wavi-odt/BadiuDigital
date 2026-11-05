// Tem de corresponder ao enum ProjectStatus do backend
export const PROJECT_STATUS = {
  LIVE: { label: 'Online', badge: 'badge--green' },
  CLIENT: { label: 'Cliente', badge: 'badge--petrol' },
  IN_DEVELOPMENT: { label: 'Em desenvolvimento', badge: 'badge--orange' },
  COMING_SOON: { label: 'Em breve', badge: 'badge--sand' },
};

export const getStatus = (status) =>
  PROJECT_STATUS[status] ?? { label: status, badge: 'badge--sand' };
