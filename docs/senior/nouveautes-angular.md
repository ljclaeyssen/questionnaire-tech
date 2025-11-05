---
sidebar_position: 4
---

# Nouveautés Angular 16-21

## Angular 16 (Mai 2023)

### 🎯 Signals
```typescript
count = signal(0);
double = computed(() => this.count() * 2);

count.set(5);
count.update(n => n + 1);
```

**Impact :** Nouvelle primitive de réactivité, foundation pour zoneless.

### 📝 Required Inputs
```typescript
// Avant
@Input() name?: string;

// Maintenant
name = input.required<string>();
```

### 🌊 Hydration SSR
```typescript
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```

**Gains :** Pas de flickering, meilleur SEO.

### 🔧 Autres
- Standalone par défaut dans CLI
- DestroyRef pour cleanup
- takeUntilDestroyed()

## Angular 17 (Novembre 2023)

### 🎨 Control Flow (@if, @for, @switch)
```html
@if (user) {
  <div>{{user.name}}</div>
}

@for (item of items; track item.id) {
  <div>{{item}}</div>
}
```

**Gains :** 50% plus rapide, bundle size réduit.

### 🎭 Deferrable Views
```html
@defer (on viewport) {
  <app-heavy />
} @placeholder {
  Loading...
} @error {
  Error!
}
```

**Triggers :** idle, viewport, interaction, hover, timer.

### ⚡ Vite + esbuild
Build jusqu'à 87% plus rapide.

### 🌐 Nouveau site angular.dev
Remplace angular.io avec documentation interactive.

## Angular 17.3 (Début 2024)

### 📤 Output signals
```typescript
// Avant
@Output() clicked = new EventEmitter<string>();

// Maintenant
clicked = output<string>();
```

### 🔗 Model inputs (two-way binding)
```typescript
value = model<string>('');

// Usage
<app-input [(value)]="myValue" />
```

### 👁️ viewChild/contentChild signals
```typescript
// Avant
@ViewChild('input') input?: ElementRef;

// Maintenant
input = viewChild<ElementRef>('input');
```

## Angular 18 (Mai 2024)

### 🚫 Zoneless (Experimental)
```typescript
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
});
```

**Gains :** -30KB bundle, +25% performance.

### ✅ APIs stables
- input() / output() stables
- Deferrable views stables
- SSR amélioré

### 🎨 Material 3
Angular Material passe à Material Design 3.

## Angular 19 (Novembre 2024)

### 💧 Incremental Hydration
```typescript
@defer (on viewport; hydrate on viewport) {
  <app-chart />
}
```

**Gains :** TTI réduit de 70%.

### 🎯 Standalone par défaut
```bash
ng new my-app
# Génère 100% standalone (pas de NgModules)
```

### 🔗 LinkedSignals
```typescript
const value = signal(10);
const doubled = linkedSignal(() => value() * 2);
```

### 📊 Resource API
```typescript
const userId = signal(1);
const user = resource({
  request: () => ({ id: userId() }),
  loader: ({ request }) => this.http.get(`/api/users/${request.id}`)
});
```

## Angular 20 (Mai 2025)

### 📊 Resource API stable
```typescript
// httpResource pour HTTP avec signals
const user = httpResource({
  url: () => `/api/users/${userId()}`,
  loader: (url) => this.http.get<User>(url)
});

// user.value(), user.isLoading(), user.error()
```

### ⚡ Signals API stable
Signals, computed, input, output, viewChild officiellement stables.

### 🛠️ ESBuild par défaut
CLI utilise ESBuild pour des builds plus rapides et bundles plus petits.

## Angular 21 (Novembre 2025)

### 🚫 Zoneless par défaut
```typescript
// ng new mon-app
// Zoneless activé automatiquement, plus besoin de provideExperimentalZonelessChangeDetection()
```

**Gains :** Plus de zone.js patchings, change detection prévisible avec Signals.

### 📝 Signal Forms (Developer Preview)
```typescript
import { form, Control, required } from '@angular/forms/signals';

const userForm = form({
  name: Control('', [required()]),
  email: Control('', [required()])
});

// Accès direct sans subscribe
console.log(userForm.value().name);

// Réactivité automatique
effect(() => {
  console.log('Form value:', userForm.value());
});
```

**Avantages :**
- Pas de valueChanges observable
- Pas de subscribe/unsubscribe
- Compatible zoneless
- Plus lisible et concis

### ⚡ Amélioration @defer
Optimisations pour le lazy loading de composants.

## Comparaison des versions

| Version | Feature principale | Performance | Bundle |
|---------|-------------------|-------------|--------|
| 16 | Signals | +20% | -5% |
| 17 | Control Flow | +50% | -10% |
| 18 | Zoneless exp. | +25% | -15% |
| 19 | Incr. Hydration | +30% | -5% |
| 20 | Resource API | +15% | -10% |
| 21 | Zoneless défaut | +20% | -15% |

## Timeline de migration

```
2023 Q2 : Angular 16 → Signals
2023 Q4 : Angular 17 → Control Flow
2024 Q2 : Angular 18 → Tester Zoneless
2024 Q4 : Angular 19 → Standalone 100%
2025 Q2 : Angular 20 → Resource API stable
2025 Q4 : Angular 21 → Zoneless par défaut + Signal Forms
```

## ❓ Que retenir pour entretien ?

### Angular 16
- Signals (signal, computed, input)
- Hydration SSR
- Required inputs

### Angular 17
- @if, @for, @switch
- Deferrable views
- Vite/esbuild

### Angular 18
- Zoneless (experimental)
- APIs signals stables
- Material 3

### Angular 19
- Incremental hydration
- Standalone obligatoire
- Resource API

### Angular 20
- Resource API stable (httpResource)
- ESBuild par défaut
- Signals API complètement stable

### Angular 21
- Zoneless par défaut
- Signal Forms (developer preview)
- Amélioration @defer

## Questions fréquentes pour examinateurs

1. **Nouveauté majeure Angular 16 ?** → Signals
2. **Nouveauté majeure Angular 17 ?** → Control Flow (@if, @for)
3. **Deferrable views ?** → Lazy loading de composants avec triggers
4. **Zoneless c'est quoi ?** → Angular sans Zone.js (plus léger, rapide)
5. **Quand zoneless par défaut ?** → Expérimental en 18, par défaut en 21
6. **Signal Forms c'est quoi ?** → Forms avec signals au lieu d'observables (Angular 21, dev preview)
7. **Incremental hydration ?** → Hydratation progressive (Angular 19)
8. **Standalone obligatoire quand ?** → Angular 19+
9. **Resource API ?** → Fetch data avec signals, introduite en 19, stable en 20
10. **httpResource ?** → Resource API pour HTTP avec gestion auto loading/error (Angular 20)
