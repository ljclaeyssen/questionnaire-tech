---
sidebar_position: 4
---

# Nouveautés Angular

## Angular 16 (Mai 2023)

### Signals
```typescript
count = signal(0);
double = computed(() => this.count() * 2);
count.set(5);
```
**Impact :** Nouvelle primitive de réactivité, foundation pour zoneless.

### Required Inputs
```typescript
@Input({ required: true }) name!: string;
```
**Impact :** Erreur compile-time si input manquant (fini le `?` partout). Note : `input.required<string>()` signal-based arrive en Angular 17.

### Hydration SSR
```typescript
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```
**Impact :** Pas de flickering au rechargement, meilleur SEO.

## Angular 17 (Novembre 2023)

### Control Flow (@if, @for, @switch)
```html
@if (user) { <div>{{user.name}}</div> }
@for (item of items; track item.id) { <div>{{item}}</div> }
```
**Impact :** 50% plus rapide, remplace `*ngIf`/`*ngFor`, bundle size réduit.

### Deferrable Views
```html
@defer (on viewport) {
  <app-heavy />
} @placeholder { Loading... }
```
**Impact :** Lazy loading déclaratif avec triggers : idle, viewport, interaction, hover, timer.

### Vite + esbuild
**Impact :** Build jusqu'à 87% plus rapide, hot reload quasi instantané.

## Angular 17.3 (Début 2024)

### Output / Model / viewChild signals
```typescript
clicked = output<string>();
value = model<string>('');
input = viewChild<ElementRef>('input');
```
**Impact :** API unifiée signals pour I/O et accès DOM — supprime `@Output`, `@ViewChild`.

## Angular 18 (Mai 2024)

### Zoneless (Experimental)
```typescript
bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection()]
});
```
**Impact :** -30KB bundle, +25% perf — change detection pilotée par Signals uniquement.

### APIs stables
`input()`, `output()`, deferrable views passent en stable. Material 3 disponible.

## Angular 19 (Novembre 2024)

### Incremental Hydration
```html
@defer (on viewport; hydrate on viewport) {
  <app-chart />
}
```
**Impact :** TTI réduit de 70%, hydratation progressive par bloc.

### Standalone par défaut
```bash
ng new my-app  # Génère 100% standalone — NgModules obsolètes
```

### Resource API + LinkedSignal
```typescript
const user = resource({
  params: () => ({ id: userId() }),
  loader: async ({ params }) => {
    const res = await fetch(`/api/users/${params.id}`);
    return (await res.json()) as User;
  }
});
const selectedIndex = linkedSignal(() => items().length > 0 ? 0 : -1);
```
**Impact :** Data fetching réactif natif (loader async, pas Observable). `linkedSignal` : signal dérivé + modifiable manuellement.

## Angular 20 (Mai 2025)

### httpResource (Experimental)
```typescript
const users = httpResource<User[]>({
  url: '/api/users'
});

// users.value(), users.isLoading(), users.error()
```

> **Attention :** `httpResource` est **experimental**. L'API peut encore évoluer.

### ESBuild par défaut
CLI utilise ESBuild pour des builds plus rapides et bundles plus petits.

### ESBuild par défaut
CLI utilise ESBuild pour des builds plus rapides et bundles plus petits.

## Angular 21 (Novembre 2025)

### Zoneless par défaut
```typescript
// ng new mon-app → zoneless activé automatiquement
// Plus besoin de provideExperimentalZonelessChangeDetection()
bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
  // Zone.js n'est plus là
});
```
**Impact :** Plus de monkey-patching Zone.js, change detection pilotée uniquement par les Signals. -30KB de bundle.

### Signal Forms (Experimental)
```typescript
import { signal } from '@angular/core';
import { form, FormField, required, email, minLength } from '@angular/forms/signals';

interface LoginData { email: string; password: string; }
const model = signal<LoginData>({ email: '', password: '' });

const loginForm = form(model, (schema) => {
  required(schema.email, { message: 'Email requis' });
  email(schema.email);
  required(schema.password);
  minLength(schema.password, 8);
});

// Lecture : loginForm.email().value(), loginForm.email().valid(), loginForm.email().errors()
// Template : <input [formField]="loginForm.email" />
```
**Impact :** Plus de `valueChanges` Observable, plus de `subscribe`. Tout est signal-based : `value()`, `valid()`, `touched()`, `dirty()`. La directive `[formField]` synchronise automatiquement `required`, `disabled`, `readonly`.

> **Attention :** Signal Forms sont **experimental** — l'API peut changer.

### Vitest par défaut
```bash
ng new mon-app   # Vitest configuré automatiquement
ng test          # Exécute Vitest (plus Karma)
```
**Impact :** Vitest remplace Karma comme runner par défaut sur les nouveaux projets. Karma reste supporté pour les projets existants.

## Angular 22 (à venir)

> **Roadmap annoncée — ne pas présenter comme acquis en entretien.**

### debounced() (Experimental)
```typescript
import { signal } from '@angular/core';
import { debounced } from '@angular/core';

const search = signal('');
const debouncedSearch = debounced(() => search(), 300);
// debouncedSearch.value() se met à jour 300ms après le dernier changement de search()
```
**Impact :** Plus besoin de `debounceTime` RxJS pour les cas simples. Retourne une `Resource<T>` — s'intègre nativement dans l'écosystème signals.

### ChangeDetectionStrategy : OnPush par défaut
```typescript
// Default est renommé en Eager (et déprécié)
// OnPush devient le défaut — plus besoin de le déclarer
@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush ← c'est le défaut maintenant
  template: `{{ data() }}`
})
export class MyComponent {
  data = signal('hello');
}
```
**Impact :** Fin de l'ère du dirty checking global. Les nouveaux composants sont OnPush par défaut. `ChangeDetectionStrategy.Default` est renommé `Eager` et déprécié.

## Comparaison des versions

| Version | Feature principale | Performance | Bundle |
|---------|-------------------|-------------|--------|
| 16 | Signals | +20% | -5% |
| 17 | Control Flow | +50% | -10% |
| 18 | Zoneless exp. | +25% | -15% |
| 19 | Incr. Hydration | +30% | -5% |
| 20 | httpResource + Signals stables | +15% | -10% |
| 21 | Zoneless défaut + Signal Forms | +20% | -30KB |
| 22 | OnPush défaut + debounced() | TBD | TBD |

## Timeline de migration

```
2023 Q2 : Angular 16 → Signals
2023 Q4 : Angular 17 → Control Flow
2024 Q2 : Angular 18 → Tester Zoneless
2024 Q4 : Angular 19 → Standalone 100%
2025 Q2 : Angular 20 → Signals stables, httpResource (experimental)
2025 Q4 : Angular 21 → Zoneless défaut, Signal Forms (exp.), Vitest
2026 Q2 : Angular 22 → OnPush défaut, debounced() (roadmap)
```

---

## Comment aborder une migration Angular en entretien ?
> Présenter une stratégie progressive : ng update version par version, migration automatique (schematics), feature flags pour basculer progressivement. Ne jamais proposer un big bang.

**Piège entretien :** Le recruteur veut entendre "progressif" et "sans casser la prod", pas une liste de features.

---

## Signals vs Zone.js : quel impact sur l'architecture ?
> Zone.js fait du dirty checking global (coûteux). Signals permettent une change detection granulaire — seuls les composants qui consomment un signal modifié sont re-rendus. C'est ce qui rend le zoneless possible.

**Piège entretien :** Savoir expliquer POURQUOI les Signals existent (performance), pas juste la syntaxe.

---

## Quelle version Angular minimum recommander pour un nouveau projet ?
> Angular 19+ minimum. Standalone par défaut, Signals stables, control flow moderne, SSR mature. Angular 17 est acceptable si contraintes d'entreprise.

**Piège entretien :** Justifier son choix avec des arguments techniques, pas juste "la dernière".
