import { MenuItem } from 'primeng/api';

export const getNavigationAuthorPage = (
  navigateToProfile: () => void,
  editProfile: () => void,
  deleteProfile: () => void,
): MenuItem[] => {
  return [
    {
      command: navigateToProfile,
      icon: 'pi pi-user',
      label: 'Profile',
    },
    {
      command: editProfile,
      icon: 'pi pi-pencil',
      label: 'Edit',
    },
    {
      command: deleteProfile,
      icon: 'pi pi-trash',
      label: 'Delete',
    },
  ];
};
