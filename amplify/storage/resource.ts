import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'tecnoExpressImages',
  access: (allow) => ({
    'products/*': [
      allow.guest.to(['read']), // Anyone can view
      allow.authenticated.to(['read', 'write']), // Authenticated can upload
    ],
    'admin/*': [
      allow.groups(['ADMINS']).to(['read', 'write', 'delete']), // Admin full access
    ],
  }),
});
