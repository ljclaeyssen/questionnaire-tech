---
sidebar_position: 2
---

# RxJS - Opérateurs Essentiels

## map vs switchMap ?
> `map` transforme une valeur (synchrone). `switchMap` transforme en Observable et annule l'Observable précédent à chaque nouvelle émission.

```typescript
// map : transformation simple
numbers$.pipe(map(x => x * 2))

// switchMap : annule la requête précédente
searchInput$.pipe(
  switchMap(term => this.api.search(term))
)
```

**Piège entretien :** Utiliser `switchMap` pour des requêtes parallèles indépendantes — c'est `mergeMap` qu'il faut.

---

## Quand utiliser quel opérateur d'aplatissement ?

| Opérateur | Comportement | Cas d'usage |
|-----------|--------------|-------------|
| `switchMap` | Annule le précédent | Recherche, autocomplétion |
| `mergeMap` | Exécute en parallèle | Requêtes indépendantes |
| `concatMap` | Exécute en séquence | Actions ordonnées |
| `exhaustMap` | Ignore les nouvelles | Prévenir double-clic |

<iframe src="https://ljclaeyssen.github.io/rxjs-visu/#/main-operators" width="800" height="600" style={{border: 'none'}}></iframe>

**Piège entretien :** `exhaustMap` est souvent oublié. Le mentionner pour les formulaires de login ou boutons de soumission fait la différence.

---

## combineLatest vs withLatestFrom vs forkJoin ?
> `combineLatest` émet à chaque changement (une fois chaque source a émis au moins une fois). `withLatestFrom` émet uniquement quand la source principale émet. `forkJoin` attend que tous soient complétés (comme `Promise.all`).

```typescript
// combineLatest : formulaire multi-champs interdépendants
combineLatest([filters$, pagination$]).pipe(
  map(([filters, page]) => ({ filters, page }))
)

// withLatestFrom : action utilisateur + contexte actuel
click$.pipe(withLatestFrom(user$))

// forkJoin : charger plusieurs ressources en parallèle
forkJoin([getUser$, getSettings$, getPermissions$])
```

**Piège entretien :** `combineLatest` ne complète jamais si une source ne complète pas. `forkJoin` ne renverra rien si une source n'émet pas avant de compléter.

---

## Comment éviter les memory leaks ?
> Ne jamais laisser une subscription ouverte à la destruction du composant. Trois patterns, du pire au meilleur.

```typescript
// Mauvais : leak
ngOnInit() {
  this.data$.subscribe(data => this.data = data);
}

// Bon : DestroyRef (Angular 16+)
private destroyRef = inject(DestroyRef);
ngOnInit() {
  this.data$.pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(data => this.data = data);
}

// Meilleur : async pipe (unsubscribe automatique)
// template: {{ data$ | async }}
```

**Piège entretien :** L'`async pipe` est la réponse attendue. Connaître aussi `takeUntil(this.destroy$)` pour les codebases Angular < 16.

---

## RxJS vs Signals, quand utiliser quoi ?

| Utiliser RxJS | Utiliser Signals |
|---------------|------------------|
| Async (HTTP, WebSocket) | État local synchrone |
| Opérations complexes (debounce, retry) | Valeurs dérivées simples |
| Event streams | Inputs/Outputs |

```typescript
// Signal pour état local
count = signal(0);
double = computed(() => this.count() * 2);

// RxJS pour async
users$ = this.http.get<User[]>('/api/users').pipe(retry(3));

// Pont Observable → Signal
users = toSignal(this.users$, { initialValue: [] });
```

**Piège entretien :** Ce n'est pas l'un ou l'autre. `toSignal` et `toObservable` permettent de les combiner. La réponse attendue : RxJS pour l'async, Signals pour l'état local.
