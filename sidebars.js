/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '🚀 Démarrage',
      collapsed: false,
      items: ['intro', 'architecture', 'installation'],
    },
    {
      type: 'category',
      label: '📱 App Patient (Mobile)',
      items: [
        'mobile/overview',
        'mobile/auth',
        'mobile/search',
        'mobile/map',
        'mobile/duty',
      ],
    },
    {
      type: 'category',
      label: '💊 App Pharmacien (Web)',
      items: [
        'web/overview',
        'web/auth',
        'web/products',
        'web/sales',
        'web/stats',
      ],
    },
    {
      type: 'category',
      label: '🖥️ Admin Dashboard',
      items: [
        'admin/overview',
        'admin/pharmacies',
        'admin/subscriptions',
        'admin/duty-management',
      ],
    },
    {
      type: 'category',
      label: '🗄️ Base de données',
      items: [
        'database/schema',
        'database/rls',
        'database/migrations',
      ],
    },
    {
      type: 'category',
      label: '🔌 API Reference',
      items: [
        'api/overview',
        'api/auth',
        'api/pharmacies',
        'api/products',
        'api/sales',
        'api/patients',
        'api/duty',
      ],
    },
    {
      type: 'category',
      label: '🚀 Déploiement',
      items: [
        'deployment/overview',
        'deployment/supabase',
        'deployment/web',
        'deployment/mobile',
      ],
    },
  ],
};

export default sidebars;
