import { MenuItem } from 'primeng/api';

export const getNavigationProfilePage = (
  navigateToAuthor: () => void,
  editAuthor: () => void,
  deleteAuthor: () => void,
): MenuItem[] => {
  return [
    {
      command: navigateToAuthor,
      icon: 'pi pi-user',
      label: 'Author',
    },
    {
      command: editAuthor,
      icon: 'pi pi-pencil',
      label: 'Edit',
    },
    {
      command: deleteAuthor,
      icon: 'pi pi-trash',
      label: 'Delete',
    },
  ];
};
