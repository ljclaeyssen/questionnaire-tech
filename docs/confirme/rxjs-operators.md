---
sidebar_position: 2
---

# RxJS - Opérateurs Essentiels

## ❓ Différence entre map et switchMap ?

### map - Transformation simple
```typescript
numbers$.pipe(
  map(x => x * 2)
).subscribe(console.log);
// 1 → 2, 2 → 4, 3 → 6
```

### switchMap - Aplatissement d'Observable
```typescript
searchInput$.pipe(
  switchMap(term => this.api.search(term))
).subscribe(console.log);
// Annule la requête précédente si nouvelle recherche
```

**Différence clé :**
- `map` : transforme une valeur
- `switchMap` : transforme en Observable et annule le précédent

## ❓ Quand utiliser quel opérateur ?

| Opérateur | Comportement | Cas d'usage |
|-----------|--------------|-------------|
| `switchMap` | Annule le précédent | Recherche, autocomplétion |
| `mergeMap` | Exécute en parallèle | Requêtes indépendantes |
| `concatMap` | Exécute en séquence | Actions ordonnées |
| `exhaustMap` | Ignore les nouvelles | Prévenir double-clic |

```typescript
// switchMap - Recherche
searchInput$.pipe(
  debounceTime(300),
  switchMap(term => this.api.search(term))
)

// mergeMap - Requêtes parallèles
users$.pipe(
  mergeMap(user => this.api.getPosts(user.id))
)

// concatMap - Actions séquentielles
orders$.pipe(
  concatMap(order => this.api.createOrder(order))
)

// exhaustMap - Empêcher double-clic
saveButton$.pipe(
  exhaustMap(() => this.api.save(data))
)
```

## Opérateurs de transformation

```typescript
// map - Transformer
of(1, 2, 3).pipe(map(x => x * 2))
// → 2, 4, 6

// map - Extraire propriété
of({name: 'John'}).pipe(map(obj => obj.name))
// → 'John'

// scan - Accumuler
of(1, 2, 3).pipe(scan((acc, val) => acc + val, 0))
// → 1, 3, 6
```

## Opérateurs de filtrage

```typescript
// filter - Filtrer
of(1, 2, 3, 4).pipe(filter(x => x > 2))
// → 3, 4

// take - Prendre n valeurs
of(1, 2, 3).pipe(take(2))
// → 1, 2

// distinctUntilChanged - Ignorer doublons
of(1, 1, 2, 2, 3).pipe(distinctUntilChanged())
// → 1, 2, 3

// debounceTime - Attendre délai
input$.pipe(debounceTime(300))
// Émet après 300ms d'inactivité
```

## Opérateurs de combinaison

```typescript
// combineLatest - Émet dès que chaque observable a émis au moins une fois,
// puis à chaque changement de n'importe quel observable
combineLatest([obs1$, obs2$]).pipe(
  map(([val1, val2]) => val1 + val2)
)
// Use case: formulaire avec plusieurs champs interdépendants

// withLatestFrom - Émet quand la source émet, combine avec dernière valeur des autres
click$.pipe(
  withLatestFrom(user$, settings$),
  map(([click, user, settings]) => ({ click, user, settings }))
)
// Use case: action utilisateur qui a besoin du contexte actuel

// forkJoin - Attend que tous soient complétés, émet une seule fois (comme Promise.all)
forkJoin([req1$, req2$, req3$])
// Use case: charger plusieurs ressources en parallèle

// merge - Émet immédiatement dès qu'un des observables émet
merge(click$, keypress$)
// Use case: réagir à plusieurs types d'événements
```

## Gestion d'erreur

```typescript
this.http.get('/api/users').pipe(
  catchError(error => {
    console.error(error);
    return of([]); // Valeur par défaut
  }),
  retry(3) // Réessayer 3 fois
)
```

## ❓ Comment éviter les memory leaks ?

```typescript
// ❌ Mauvais - Memory leak
ngOnInit() {
  this.data$.subscribe(data => this.data = data);
}

// ✅ Bon - DestroyRef (Angular 16+)
private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.data$.pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(data => this.data = data);
}

// ✅ Meilleur - Async pipe (pas de subscription manuelle)
@Component({
  template: `
    @if (data$ | async; as data) {
      <div>{{ data }}</div>
    }
  `
})
export class MyComponent {
  data$ = this.http.get('/api/data');
  // Unsubscribe automatique !
}
```

**💡 Bonus - Ancien style (Angular < 16) :**
```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.data$.pipe(takeUntil(this.destroy$))
    .subscribe(data => this.data = data);
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

## RxJS vs Signals

| Utiliser RxJS | Utiliser Signals |
|---------------|------------------|
| Async (HTTP, WebSocket) | État local synchrone |
| Opérations complexes | Valeurs dérivées simples |
| Event streams | Inputs/Outputs |
| debounce, retry, etc. | Performance optimale |

```typescript
// Signal pour état local
count = signal(0);
double = computed(() => this.count() * 2);

// RxJS pour async
users$ = this.http.get<User[]>('/api/users').pipe(
  retry(3),
  catchError(() => of([]))
);

// Convertir Observable → Signal
users = toSignal(this.users$, { initialValue: [] });
```

## Questions fréquentes pour examinateurs

1. **map vs switchMap ?** → map transforme, switchMap aplatit et annule
2. **Quand switchMap ?** → Recherche, autocomplétion (annule précédent)
3. **Quand mergeMap ?** → Requêtes parallèles indépendantes
4. **Quand concatMap ?** → Actions séquentielles (ordre important)
5. **exhaustMap ?** → Ignorer nouvelles émissions (anti double-clic)
6. **combineLatest vs withLatestFrom ?** → combineLatest émet si n'importe quel observable change, withLatestFrom émet uniquement quand la source émet
7. **combineLatest vs forkJoin ?** → combineLatest émet à chaque changement après première émission de tous, forkJoin attend que tous soient complétés
8. **catchError ?** → Gérer erreurs, retourner valeur par défaut
9. **Comment éviter memory leaks ?** → DestroyRef + takeUntilDestroyed, ou async pipe (recommandé)
10. **debounceTime ?** → Attendre inactivité (recherche)
