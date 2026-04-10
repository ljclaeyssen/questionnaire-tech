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
| `loadChildren` (module) | `loadChildren` (routes) + `loadComponent` |

```typescript
// ❌ Legacy
RouterModule.forRoot([
  { path: 'users', loadChildren: () => import('./users.module').then(m => m.UsersModule) }
])

// ✅ Moderne
provideRouter([
  { path: 'users', loadComponent: () => import('./users.component').then(m => m.UsersComponent) },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES) }
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

