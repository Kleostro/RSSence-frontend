import { MenuItem, MenuItemCommandEvent } from 'primeng/api';

export const getPostActions = (
  editPost: (event: MenuItemCommandEvent) => void,
  deletePost: (event: MenuItemCommandEvent) => void,
): MenuItem[] => {
  return [
    {
      command: editPost,
      icon: 'pi pi-pencil',
      label: 'Edit',
    },
    {
      command: deletePost,
      icon: 'pi pi-trash',
      label: 'Delete',
    },
  ];
};
