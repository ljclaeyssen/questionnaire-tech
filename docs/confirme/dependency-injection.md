---
sidebar_position: 4
---

# Dependency Injection

## Comment fonctionne l'injection de dépendances Angular ?
> Angular maintient un arbre d'injecteurs hiérarchique. Chaque composant, directive ou module peut avoir son propre injecteur enfant. On injecte un service via le constructeur ou via `inject()`.

```typescript
@Injectable({ providedIn: 'root' })
export class UserService {}

@Component({ ... })
export class MyComponent {
  private userService = inject(UserService);
}
```

**Piège entretien :** Un injecteur enfant "shadow" le parent pour le même token — deux composants enfants d'un même parent peuvent avoir des instances différentes si le service est déclaré dans leurs `providers`.

---

## inject() vs injection par constructeur ?
> `inject()` est la méthode moderne (Angular 14+). Elle fonctionne dans les constructors, les field initializers et les factory functions. Plus besoin de déclarer tous les paramètres dans la signature du constructeur.

```typescript
// Ancien style
constructor(private userService: UserService) {}

// Nouveau style (préféré)
private userService = inject(UserService);
```

**Piège entretien :** `inject()` ne peut être appelé qu'en contexte d'injection (initialisation de classe, constructeur, factory). L'appeler dans une méthode ordinaire lève une erreur.

---

## providedIn: 'root' vs providers array ?
> `providedIn: 'root'` crée un singleton global, accessible partout et tree-shakable. `providers: []` dans un composant crée une instance par composant — détruite avec lui.

```typescript
// Singleton global, tree-shakable
@Injectable({ providedIn: 'root' })
export class GlobalService {}

// Instance par composant
@Component({
  providers: [LocalService]
})
export class MyComponent {}
```

**Piège entretien :** `providedIn: 'root'` est tree-shakable (éliminé si non utilisé). Un service déclaré dans `providers: []` d'un NgModule ou composant ne l'est pas.

---

## C'est quoi un InjectionToken ?
> Token typé pour injecter des valeurs non-classe : config objects, feature flags, primitives. Évite les collisions de noms et apporte la sécurité de type.

```typescript
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// Provider
{ provide: APP_CONFIG, useValue: { apiUrl: '/api', debug: false } }

// Injection
private config = inject(APP_CONFIG);
```

**Piège entretien :** Sans `InjectionToken`, injecter une valeur primitive (`string`, `number`) est impossible proprement — TypeScript ne peut pas s'en servir comme token.

---

## useClass, useFactory, useValue ?
> Trois façons de configurer un provider selon le besoin : valeur statique, classe alternative, ou construction dynamique avec dépendances.

```typescript
// Valeur statique
{ provide: API_URL, useValue: 'https://api.example.com' }

// Classe alternative (ex: mock en tests)
{ provide: UserService, useClass: MockUserService }

// Factory avec dépendances dynamiques
{
  provide: UserService,
  useFactory: (http: HttpClient) => new UserService(http),
  deps: [HttpClient]
}
```

**Piège entretien :** `useFactory` est le seul qui permet de passer des dépendances calculées au moment de l'injection. Avec `inject()` dans la factory, les `deps` ne sont plus nécessaires.

---

## Hiérarchie des injecteurs ?
> Platform → Root → Environment (Module/Route) → Component. Chaque niveau peut fournir ses propres instances. La résolution remonte l'arbre jusqu'à trouver le token.

```typescript
// Niveau root (singleton global)
@Injectable({ providedIn: 'root' })
export class AuthService {}

// Niveau composant (instance isolée)
@Component({
  providers: [CartService] // nouvelle instance pour ce composant
})
export class CheckoutComponent {}
```

**Piège entretien :** Un service `providedIn: 'root'` est partagé partout. Un service dans `providers` d'un composant crée une nouvelle instance à chaque instanciation — et est détruit avec le composant.
