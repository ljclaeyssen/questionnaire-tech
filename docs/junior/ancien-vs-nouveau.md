---
sidebar_position: 5
---

# Ancien vs Nouveau - Guide de Référence

## Composants

| Ancien (NgModule) | Nouveau (Standalone) |
|-------------------|---------------------|
| Déclaration dans NgModule | `standalone: true` |
| `declarations: [MyComponent]` | `imports: [CommonModule]` |
| Module séparé nécessaire | Tout dans le composant |

```typescript
// ✅ Moderne
@Component({
  standalone: true,
  imports: [CommonModule]
})
export class MyComponent {}

// ❌ Legacy
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})
export class MyModule {}
```

## Control Flow

| Ancien | Nouveau |
|--------|---------|
| `*ngIf` | `@if` |
| `*ngFor` | `@for` |
| `*ngSwitch` | `@switch` |

```html
<!-- ❌ Legacy -->
<div *ngIf="user">{{user.name}}</div>
<div *ngFor="let item of items; trackBy: trackFn">{{item}}</div>

<!-- ✅ Moderne -->
@if (user) {
  <div>{{user.name}}</div>
}
@for (item of items; track item.id) {
  <div>{{item}}</div>
}
```

## Input / Output

| Feature | Ancien | Nouveau |
|---------|--------|---------|
| Input | `@Input()` | `input()` |
| Output | `@Output()` | `output()` |
| Template | `{{name}}` | `{{name()}}` |
| Obligatoire | `@Input({ required: true })` | `input.required<T>()` |

```typescript
// ❌ Legacy
@Input() name!: string;
@Output() clicked = new EventEmitter<void>();

// ✅ Moderne
name = input.required<string>();
clicked = output<void>();
```

## État et Réactivité

| Ancien | Nouveau |
|--------|---------|
| Variable | Signal |
| Getter | Computed |
| Zone.js | Zoneless (opt) |

```typescript
// ❌ Legacy
count = 0;
get double() { return this.count * 2; }

// ✅ Moderne
count = signal(0);
double = computed(() => this.count() * 2);
```

## Routing

| Ancien | Nouveau |
|--------|---------|
| `RouterModule.forRoot()` | `provideRouter()` |
| `loadChildren` (module) | `loadComponent` |

```typescript
// ❌ Legacy
RouterModule.forRoot([
  { path: 'users', loadChildren: () => import('./users.module').then(m => m.UsersModule) }
])

// ✅ Moderne
provideRouter([
  { path: 'users', loadComponent: () => import('./users.component').then(m => m.UsersComponent) }
])
```

## Guards & Interceptors

| Ancien | Nouveau |
|--------|---------|
| Guard classe | `CanActivateFn` |
| Interceptor classe | `HttpInterceptorFn` |

```typescript
// ❌ Legacy
export class AuthGuard implements CanActivate {
  canActivate() { return true; }
}

// ✅ Moderne
export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
```

## Bootstrap

```typescript
// ❌ Legacy (main.ts)
platformBrowserDynamic().bootstrapModule(AppModule);

// ✅ Moderne (main.ts)
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});
```

## Questions fréquentes pour examinateurs

1. **Différence principale ?** → Standalone supprime les NgModules
2. **@if plus rapide que *ngIf ?** → Oui, ~50% plus rapide
3. **Peut-on mélanger ancien/nouveau ?** → Oui pendant migration
4. **Quand migrer ?** → Nouveaux projets : tout de suite. Legacy : progressivement
5. **NgModules obsolètes ?** → Oui depuis Angular 19+
6. **Signals obligatoires ?** → Non mais recommandés
7. **Zone.js nécessaire ?** → Plus avec zoneless (Angular 18+)
