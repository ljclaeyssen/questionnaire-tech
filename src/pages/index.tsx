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
            <p>19 sujets par niveau : Junior, Confirmé, Senior</p>
            <ul>
              <li>CLI, Composants, Lifecycle, Pipes</li>
              <li>Signals, RxJS, DI, Routing, Forms</li>
              <li>Architecture, Performance, Testing</li>
            </ul>
          </Link>

          <Link to="/code-review/intro" className={styles.card}>
            <h2>🔍 Code Review</h2>
            <p>4 exercices de revue de code Angular</p>
            <ul>
              <li>Components : memory leaks, change detection</li>
              <li>Services : état mutable, couplage</li>
              <li>Formulaires : validation, observables</li>
            </ul>
          </Link>

          <Link to="/cas-pratiques/intro" className={styles.card}>
            <h2>⚡ Cas Pratiques</h2>
            <p>11 exercices de live coding</p>
            <ul>
              <li>Junior : calculatrice, todo, recherche</li>
              <li>Confirmé : forms, routing, guards</li>
              <li>Senior : dashboard, refactoring legacy</li>
            </ul>
          </Link>
        </div>
      </main>
    </Layout>
  );
}
