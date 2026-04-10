---
sidebar_position: 3
---

# Performance

## Quels sont les leviers de performance Angular ?

> Les gains les plus importants viennent dans cet ordre : éviter les re-renders inutiles (OnPush + signals), réduire le bundle initial (lazy loading), puis optimiser le runtime (track, zoneless). Chaque levier a un contexte d'application — ne pas tout activer aveuglément.

| Levier | Impact | Quand l'utiliser |
|---|---|---|
| `OnPush` | Haut | Systématiquement sur les dumb components |
| Signals (zoneless) | Haut | Angular 18+ (exp.), 21+ (défaut) |
| `@defer` | Haut | Contenu hors viewport initial |
| `track` dans `@for` | Moyen | Listes dynamiques |
| `loadComponent` / `loadChildren` | Haut | Features non critiques au démarrage |
| Preloading strategy | Moyen | Navigation probable après initial load |
| `provideClientHydration()` | Haut | Apps SSR |

**Piege entretien :** OnPush n'est pas magique — si tu passes un objet muté (et non remplacé), Angular ne détecte pas le changement. Avec OnPush, toujours retourner de nouvelles références.

---

## @defer : comment et quand ?

> `@defer` charge un composant paresseusement de façon déclarative, directement dans le template. Le bundle JS du composant n'est téléchargé que lorsque le trigger est satisfait. Idéal pour tout ce qui n'est pas visible au premier render.

```typescript
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="skeleton" style="height: 300px"></div>
} @loading (minimum 200ms) {
  <app-spinner />
} @error {
  <p>Impossible de charger le graphique.</p>
}
```

**Piege entretien :** `@defer` ne fait PAS de SSR par défaut — le contenu différé n'est pas inclus dans le HTML initial. Aucune stratégie de `prefetch` ne change ça. Pour le SEO en SSR, utiliser l'hydration incrémentale d'Angular 19 (`@defer (hydrate on viewport)`) qui rend le contenu côté serveur et l'hydrate progressivement côté client.

---

## Comment analyser la taille du bundle ?

> `source-map-explorer` pour un breakdown précis par fichier source. Depuis Angular 17 (esbuild par défaut), `webpack-bundle-analyzer` n'est plus compatible — utiliser `source-map-explorer` ou `esbuild-visualizer`.

```bash
# Générer le build avec source maps
ng build --source-map

# Analyser
npx source-map-explorer dist/my-app/browser/*.js
```

**Piege entretien :** Les coupables classiques sont `moment.js` (importé entier au lieu de `date-fns` tree-shakable), `lodash` (importer `lodash-es` ou les fonctions individuelles), et les icônes Material importées en masse. Chercher aussi les polyfills inutiles dans `polyfills.ts`.

---

## Preloading strategies ?

> Après le chargement initial, Angular peut précharger les modules lazy en arrière-plan. `PreloadAllModules` précharge tout immédiatement. Une stratégie custom permet de cibler uniquement les routes probables (ex : via un flag `data: { preload: true }` sur les routes).

```typescript
// Stratégie custom
@Injectable({ providedIn: 'root' })
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    return route.data?.['preload'] ? load() : EMPTY;
  }
}

// Dans app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(SelectivePreloadingStrategy)),
  ],
};
```

**Piege entretien :** `PreloadAllModules` consomme de la bande passante dès le chargement initial — sur mobile 3G, c'est contre-productif. Préférer une stratégie sélective basée sur la navigation probable de l'utilisateur.

---

## SSR et hydration ?

> Sans hydration, Angular détruit et recrée le DOM côté client après le SSR — double render, flash de contenu. `provideClientHydration()` réutilise le DOM existant. Angular 19 apporte l'hydration incrémentale : hydrater les composants au moment où ils entrent dans le viewport.

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()), // rejoue les events capturés avant hydration
    provideServerRendering(),
  ],
};

// Hydration incrémentale (Angular 19)
@defer (hydrate on viewport) {
  <app-comments [postId]="postId()" />
}
```

**Piege entretien :** Les event listeners ne fonctionnent pas avant l'hydration — l'app semble "gelée" si le JS est lent à charger. `withEventReplay()` capture et rejoue les interactions utilisateur pendant ce délai. Sans ça, un clic sur un bouton avant hydration est silencieusement ignoré.
