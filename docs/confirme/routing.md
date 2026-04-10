---
sidebar_position: 5
---

# Routing

## Comment configurer le routing Angular ?
> On configure le routing via `provideRouter(routes)` dans `app.config.ts`. Plus besoin de `RouterModule.forRoot()` depuis Angular 15+. Le tableau de routes est passé directement au bootstrap.

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};

// routes.ts
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'users', component: UsersComponent },
];
```

**Piège entretien :** `RouterModule.forRoot()` n'est pas déprécié mais n'est plus recommandé. `provideRouter()` est l'API moderne, composable et tree-shakable.

---

## Comment faire du lazy loading ?
> `loadComponent` pour un composant standalone isolé, `loadChildren` pour un groupe de routes. Les deux retournent une `Promise` résolue dynamiquement au premier accès.

```typescript
export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then(m => m.AdminComponent)
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
  }
];
```

**Piège entretien :** `loadChildren` retourne désormais un tableau de `Routes` (plus un NgModule). Retourner un module dans une app standalone est une erreur courante.

---

## C'est quoi un guard fonctionnel ?
> Une fonction qui retourne `boolean | UrlTree | Observable<boolean>`. Remplace les classes `CanActivate`. S'utilise avec `inject()` pour accéder aux services sans DI par constructeur.

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login']);
};

// Usage
{ path: 'dashboard', canActivate: [authGuard], component: DashboardComponent }
```

**Piège entretien :** Les guards en classe (`implements CanActivate`) fonctionnent encore mais sont dépréciés. Préférer les fonctions — elles sont plus simples à tester et ne nécessitent pas de `provide`.

---

## Comment récupérer les paramètres de route ?
> Via `inject(ActivatedRoute)` : `.params` pour un Observable (réagit aux changements), `.snapshot.params` pour la valeur immédiate. En Angular 16+ avec `withComponentInputBinding()`, les params arrivent directement en `@Input`.

```typescript
// Méthode classique
private route = inject(ActivatedRoute);
ngOnInit() {
  this.route.params.subscribe(p => this.id = p['id']);
}

// Angular 16+ avec withComponentInputBinding()
@Input() id!: string; // injecté automatiquement depuis :id
```

**Piège entretien :** `snapshot.params` ne se met pas à jour si la route change sans recréer le composant (ex: navigation entre `/users/1` et `/users/2`). Dans ce cas, utiliser l'Observable `.params`.

---

## Nested routes et router-outlet ?
> Les routes enfants se déclarent dans `children: []`. Le composant parent doit contenir un `<router-outlet>` pour afficher les enfants. Chaque niveau de nesting nécessite son propre outlet.

```typescript
export const routes: Routes = [
  {
    path: 'users',
    component: UsersLayoutComponent, // contient <router-outlet>
    children: [
      { path: '', component: UsersListComponent },
      { path: ':id', component: UserDetailComponent }
    ]
  }
];
```

**Piège entretien :** Oublier le `<router-outlet>` dans le composant parent est l'erreur la plus fréquente — les routes enfants existent mais ne s'affichent pas, sans erreur console.
