---
sidebar_position: 2
---

# Architecture Patterns

## Smart vs Dumb components ?

> Smart (container) : gère l'état, injecte des services, orchestre la logique métier. Dumb (presentational) : reçoit des inputs, émet des outputs, zéro logique métier. La séparation rend les dumb components réutilisables et testables sans mocks.

```typescript
// Dumb component — aucun service injecté
@Component({
  selector: 'app-user-card',
  template: `<div>{{ user().name }}</div>`,
})
export class UserCard {
  user = input.required<User>();
  delete = output<string>();
}

// Smart component — orchestre et délègue
@Component({
  selector: 'app-user-list',
  imports: [UserCard],
  template: `@for (u of users(); track u.id) { <app-user-card [user]="u" (delete)="remove($event)" /> }`,
})
export class UserList {
  private userService = inject(UserService);
  users = this.userService.users;
  remove(id: string) { this.userService.delete(id); }
}
```

**Piege entretien :** Un dumb component ne doit JAMAIS injecter un service. Si tu le fais, c'est un smart component déguisé — et tu perds tout le bénéfice de la séparation.

---

## Comment structurer une app Angular à grande échelle ?

> Deux approches classiques selon la taille du projet :

### Feature-based (apps moyennes)

Chaque feature est un dossier isolé avec ses routes, services et composants. `shared/` pour le réutilisable, `core/` pour les singletons.

```
src/app/
  core/            # Services singleton, guards, interceptors
  shared/          # Composants/pipes/directives réutilisables
  features/
    users/         # Tout ce qui concerne "users"
      data/        # Services, modèles
      ui/          # Composants
      users.routes.ts
    orders/
      ...
```

### Clean Architecture / Hexagonale (apps critiques)

Sépare strictement le domaine métier du framework. Les dépendances coulent de l'extérieur vers le coeur — jamais l'inverse. Le domaine est du TypeScript pur (zéro `@angular/*`).

```
src/app/
  domain/          # Coeur métier (TS pur, zéro dépendance Angular)
    models/        # Interfaces, types, value objects
    gateways/      # Ports : classes abstraites (contrats)
  gateways/        # Adaptateurs : implémentations concrètes (REST, in-memory)
  use-cases/       # Orchestration métier (1 classe = 1 action, méthode execute())
  store/           # État réactif (Signals), sélecteurs computed()
  ui/              # Couche Angular (composants, routes, thème)
    features/      # Un dossier par feature, lazy-loaded
    shared/        # Composants réutilisables
```

| Couche | Peut importer | Ne peut PAS importer |
|---|---|---|
| `domain/` | TypeScript pur, types RxJS | Angular, gateways concrets, ui |
| `gateways/` | `domain/`, Angular (HttpClient) | use-cases, store, ui |
| `use-cases/` | `domain/`, `store/` | Angular, ui, gateways concrets |
| `store/` | `domain/` | use-cases, ui, gateways |
| `ui/` | Toutes les couches | — (rester léger) |

Ces règles de dépendance s'appliquent automatiquement via `eslint-plugin-boundaries`.

**Piege entretien :** La Clean Architecture est un plus en entretien senior, mais ne la proposer que si l'app le justifie (domaine complexe, beaucoup de logique métier, équipe large). Pour un CRUD simple, feature-based suffit. Imposer l'hexagonal sur un petit projet est de l'over-engineering — c'est un red flag aussi.

---

## State management : quand et quoi utiliser ?

> Signals pour l'état local d'un composant. Services + signals pour l'état partagé simple (ex : panier, utilisateur courant). NgRx ou NGRX SignalStore uniquement si l'app a des flows complexes : undo/redo, time-travel debugging, cache invalidation multi-sources, état synchronisé avec le backend en temps réel.

```typescript
// 90% des cas — service + signal suffit
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);
  readonly count = computed(() => this.items().length);

  add(item: CartItem) {
    this.items.update(current => [...current, item]);
  }
}
```

**Piege entretien :** 90% des apps n'ont PAS besoin de NgRx. Proposer NgRx d'emblée sans justification est un red flag — ça montre qu'on suit une mode sans analyser le besoin réel.

---

## Standalone vs NgModule pour organiser ?

> Standalone est le défaut depuis Angular 19. Un composant déclare ses propres imports — plus de module intermédiaire. Le lazy loading se fait via les routes directement (`loadComponent`). Les NgModules restent valides pour les libs tierces ou les migrations progressives.

```typescript
// Lazy loading sans module
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'orders',
    loadChildren: () =>
      import('./features/orders/orders.routes').then(m => m.ORDERS_ROUTES),
  },
];
```

**Piege entretien :** En migration, on peut mixer standalone et NgModules. Mais tout nouveau composant doit être standalone — déclarer un composant standalone dans un NgModule existant fonctionne, c'est la voie de migration officielle.
