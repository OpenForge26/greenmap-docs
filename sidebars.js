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
      label: '🔌 API Reference',
      items: [
        'api/overview',
        'api/auth',
        'api/pharmacies',
        'api/products',
        'api/duty',
      ],
    },
  ],
};

export default sidebars;
