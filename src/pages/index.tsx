import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Questionnaire Tech Angular"
      description="Cheat sheet et questions d'entretien pour Angular 16-21">
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>Questionnaire Tech Angular</h1>
          <p className={styles.subtitle}>Cheat sheet et questions d'entretien pour Angular 16-21</p>
        </div>

        <div className={styles.sections}>
          <Link to="/questions/intro" className={styles.card}>
            <h2>📚 Questions</h2>
            <p>Questions par niveau : Junior, Confirmé, Senior</p>
            <ul>
              <li>Angular CLI & Composants</li>
              <li>RxJS & Signals</li>
              <li>Nouveautés Angular 16-21</li>
            </ul>
          </Link>

          <Link to="/code-review/intro" className={styles.card}>
            <h2>🔍 Code Review</h2>
            <p>Exercices de revue de code</p>
            <ul>
              <li>Détection de bugs</li>
              <li>Optimisation de performance</li>
              <li>Sécurité & mauvaises pratiques</li>
            </ul>
          </Link>

          <Link to="/cas-pratiques/intro" className={styles.card}>
            <h2>⚡ Cas Pratiques</h2>
            <p>Exercices de code pratiques</p>
            <ul>
              <li>Créer des composants</li>
              <li>Implémenter des services</li>
              <li>Migrations & formulaires</li>
            </ul>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
