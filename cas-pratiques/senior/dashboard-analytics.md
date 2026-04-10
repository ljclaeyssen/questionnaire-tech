---
sidebar_position: 1
---

# Dashboard Analytics avec Signals et @defer

**Niveau** : Senior
**Durée** : 60 min
**Concepts évalués** : Signals (signal, computed, effect), @defer (on viewport/idle), State management, Architecture smart/dumb components, OnPush

## Énoncé

Construire un dashboard analytics composé de plusieurs widgets : un graphique de tendance, des KPIs (chiffres clés) et une table de données détaillée. Le dashboard charge les données au démarrage via un service, mais les widgets lourds (graphique) sont lazy-loadés avec `@defer`. L'état global (données et filtres actifs) est géré dans un service via des signals. Un panneau de filtres (plage de dates, catégorie) met à jour tous les widgets de manière réactive sans déclencher de nouveaux appels HTTP — uniquement via `computed()`. Les composants de widget sont des **dumb components** avec `OnPush` et reçoivent leurs données en entrée.

## Critères d'évaluation

- Le service de state expose des `signal()` pour les données brutes et les filtres, et des `computed()` pour les données filtrées consommées par les widgets
- `@defer (on viewport)` est utilisé pour le widget graphique ; `@defer (on idle)` pour la table de données
- Les widgets sont des composants `standalone`, `OnPush`, sans logique métier — ils reçoivent uniquement des données en input
- Le composant parent (smart) orchestre le service et passe les données filtrées aux enfants via les inputs signal (`input()`)
- Les filtres sont des `signal()` dans le service ; leur changement propage automatiquement via `computed()` sans subscription manuelle

<details>
<summary>Indice 1 — Structure du service de state</summary>

Crée un `DashboardStateService` injectable avec :

```ts
@Injectable({ providedIn: 'root' })
export class DashboardStateService {
  private readonly rawData = signal<SalesData[]>([]);

  readonly filters = signal<Filters>({ category: 'all', dateRange: 'month' });

  readonly filteredData = computed(() => {
    const data = this.rawData();
    const { category, dateRange } = this.filters();
    return data.filter(/* ... */);
  });

  readonly kpis = computed(() => computeKpis(this.filteredData()));

  loadData() { /* appel HTTP → rawData.set(...) */ }
}
```

Les widgets consomment `filteredData()` et `kpis()` directement — aucun subscribe dans les composants.
</details>

<details>
<summary>Indice 2 — @defer pour les widgets lourds</summary>

Dans le template du composant dashboard :

```html
<!-- KPIs : affichés immédiatement -->
<app-kpi-card [kpis]="state.kpis()" />

<!-- Graphique : chargé quand il entre dans le viewport -->
@defer (on viewport) {
  <app-trend-chart [data]="state.filteredData()" />
} @placeholder {
  <div class="chart-skeleton">Chargement du graphique...</div>
}

<!-- Table : chargée pendant les temps morts du navigateur -->
@defer (on idle) {
  <app-data-table [rows]="state.filteredData()" />
} @loading {
  <p>Préparation de la table...</p>
}
```

`@defer` gère automatiquement le lazy loading du chunk JS du composant.
</details>

<details>
<summary>Indice 3 — Filtres réactifs et composants OnPush</summary>

Le panneau de filtres émet vers le service, pas vers le parent :

```ts
// filter-panel.component.ts (standalone, OnPush)
export class FilterPanelComponent {
  private state = inject(DashboardStateService);

  setCategory(category: string) {
    this.state.filters.update(f => ({ ...f, category }));
  }
}
```

Les widgets dumb n'ont aucune connaissance du service — ils sont `OnPush` et reçoivent uniquement des `input()` :

```ts
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
export class KpiCardComponent {
  kpis = input.required<Kpis>();
}
```

Avec `OnPush`, Angular ne re-render le widget que si la référence de l'input change — ce que `computed()` garantit automatiquement.
</details>
