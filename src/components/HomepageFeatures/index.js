import clsx from 'clsx';
import styles from './styles.module.css';

const features = [
  {
    title: '📱 App Patient',
    description: 'Application mobile React Native. Recherche de médicaments, carte GPS des pharmacies, pharmacies de garde.',
  },
  {
    title: '💊 App Pharmacien',
    description: 'Dashboard web Next.js. Gestion du stock, caisse, alertes péremption, statistiques en temps réel.',
  },
  {
    title: '🖥️ Admin Dashboard',
    description: 'Panel super admin. Gestion des pharmacies, abonnements, planning de garde Togo & Bénin.',
  },
  {
    title: '🗄️ Backend Supabase',
    description: 'PostgreSQL + Auth + Storage + Edge Functions. RLS sur toutes les tables, fonctions GPS Haversine.',
  },
  {
    title: '💳 Paiements Mobile Money',
    description: 'CinetPay / Klasha. Flooz & Mixx (Togo), MTN MoMo & Moov (Bénin). Abonnements 12 500 FCFA/mois.',
  },
  {
    title: '🌍 Togo & Bénin',
    description: 'Conçu pour Lomé et Cotonou. Multidevise FCFA, WhatsApp Business, Firebase FCM, OpenStreetMap.',
  },
];

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map(({title, description}) => (
            <div key={title} className={clsx('col col--4', styles.featureCol)}>
              <div className={styles.featureCard}>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
