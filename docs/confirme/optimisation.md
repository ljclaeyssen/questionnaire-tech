---
sidebar_position: 9
---

# Optimisation d'Application

## Comment optimiser la change detection ?
> Passer les composants en `ChangeDetectionStrategy.OnPush`. Angular ne vérifie le composant que si un `@Input` change de référence, un event DOM est émis depuis le composant, ou un Observable souscrit via `async` pipe émet. Ça force à travailler avec des références immutables — ce qui est sain de toute façon.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ data$ | async }}`
})
export class MyComponent {
  data$ = this.http.get('/api/data');
}
```

**Piège entretien :** Avec OnPush, muter un objet sans changer sa référence ne déclenche rien. Depuis Angular 17+, les Signals simplifient ça — ils notifient automatiquement la CD sans Zone.js.

---

## Pourquoi éviter les appels de fonction dans les templates ?
> `{{ calcul() }}` se réévalue à **chaque cycle de change detection**, même si les données n'ont pas changé. Sur un composant Default, ça peut être des dizaines de fois par seconde.

```html
<!-- Mauvais — recalculé à chaque CD -->
<p>{{ getTotal() }}</p>

<!-- Bon — pipe pur, recalculé uniquement si la référence change -->
<p>{{ items | totalPipe }}</p>

<!-- Mieux — computed signal, mémoïsé automatiquement -->
<p>{{ total() }}</p>
```

**Piège entretien :** Les pipes purs ne se réévaluent que quand leur input change par référence. Un `computed()` signal est encore mieux : mémoïsé et granulaire.

---

## Comment optimiser les listes ?
> Utiliser `track` avec `@for` (ou `trackBy` avec `*ngFor`) pour que Angular identifie les éléments existants et ne recrée que les nouveaux nœuds DOM. Pour les très longues listes, virtualiser avec `cdk-virtual-scroll-viewport`.

```html
<!-- track évite de recréer le DOM pour les éléments inchangés -->
@for (item of items(); track item.id) {
  <app-item [data]="item" />
}

<!-- Virtualisation pour les listes > 100 éléments -->
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let item of items">{{ item.name }}</div>
</cdk-virtual-scroll-viewport>
```

**Piège entretien :** Sans `track`, Angular détruit et recrée tous les éléments DOM à chaque changement de la liste — même si un seul item a bougé. C'est le gain de perf le plus facile à obtenir.

---

## Lazy loading : loadComponent, loadChildren, @defer ?
> `loadComponent` charge un composant standalone à la demande via le router. `loadChildren` charge un groupe de routes. `@defer` (Angular 17+) fait du lazy loading déclaratif directement dans le template, sans passer par le router.

```typescript
// Router — charge au premier accès de la route
{ path: 'admin', loadComponent: () => import('./admin.component').then(m => m.AdminComponent) }

// Template — charge quand l'élément entre dans le viewport
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <div>Chargement...</div>
}
```

**Piège entretien :** `@defer` réduit le bundle initial sans toucher au routing. Les triggers disponibles : `on idle`, `on viewport`, `on interaction`, `on hover`, `on timer(Xms)`. C'est le levier le plus simple pour améliorer le TTI.

---

## Async pipe vs subscribe manuel ?
> `async` pipe souscrit automatiquement à un Observable, affiche la dernière valeur, et se désinscrit à la destruction du composant. Zéro risque de memory leak.

```html
<!-- async pipe — unsubscribe automatique -->
@if (users$ | async; as users) {
  @for (user of users; track user.id) {
    <app-user [data]="user" />
  }
}
```

**Piège entretien :** Chaque `| async` dans le template crée une souscription séparée. Si tu utilises `users$ | async` à 3 endroits, tu as 3 souscriptions (et potentiellement 3 requêtes HTTP). Solution : un seul `@if (users$ | async; as users)` en wrapper, ou `toSignal()`.

---

## runOutsideAngular : quand et pourquoi ?
> `NgZone.runOutsideAngular()` exécute du code sans déclencher la change detection. Utile pour les opérations fréquentes qui n'impactent pas la vue : scroll listeners, animations, resize observers, requestAnimationFrame.

```typescript
private ngZone = inject(NgZone);

ngOnInit() {
  this.ngZone.runOutsideAngular(() => {
    window.addEventListener('scroll', this.onScroll);
    // Pas de CD à chaque pixel scrollé
  });
}
```

**Piège entretien :** Si tu modifies l'état du composant dans un callback `runOutsideAngular`, il faut rentrer dans la zone avec `this.ngZone.run(() => ...)` ou utiliser `markForCheck()`. En zoneless avec Signals, ce pattern devient inutile — la CD est déjà granulaire.

---

## Comment diagnostiquer les problèmes de perf ?
> **Angular DevTools** (onglet Profiler) pour identifier les composants qui se re-rendent trop souvent. **Source Map Explorer** pour traquer les dépendances lourdes dans le bundle. Depuis Angular 17 (esbuild par défaut), `webpack-bundle-analyzer` n'est plus compatible.

```bash
# Analyser la taille du bundle
ng build --source-map
npx source-map-explorer dist/my-app/browser/*.js
```

**Piège entretien :** Les coupables classiques dans le bundle : `moment.js` (remplacer par `date-fns` ou `Temporal`), `lodash` entier (n'importer que les fonctions utilisées), et les polyfills inutiles. Angular DevTools montre aussi le temps passé dans chaque composant par cycle de CD.
