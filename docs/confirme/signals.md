---
sidebar_position: 3
---

# Signals - Réactivité Moderne

## Qu'est-ce qu'un Signal ?
> Primitive de réactivité introduite dans Angular 16. Un signal est un wrapper autour d'une valeur qui notifie ses consommateurs quand cette valeur change — sans Zone.js.

```typescript
const count = signal(0);
count.set(5);
count.update(n => n + 1);
console.log(count()); // 6
```

**Piège entretien :** Un signal se lit toujours avec `()`. Oublier les parenthèses retourne la référence au signal, pas sa valeur.

---

## Quels sont les 4 types de Signals ?

| Type | Usage | Écriture | Lecture |
|------|-------|----------|---------|
| `signal()` | État modifiable | set/update | `()` |
| `computed()` | Valeur dérivée | read-only | `()` |
| `input()` | Depuis le parent | read-only | `()` |
| `linkedSignal()` | Dérivé + modifiable | set/update | `()` |

```typescript
// linkedSignal : un computed qu'on peut écraser manuellement
const selectedIndex = linkedSignal(() => items().length > 0 ? 0 : -1);
// Se recalcule quand items() change, mais on peut aussi faire :
selectedIndex.set(3); // écriture manuelle
```

> **Note :** `output()` n'est **pas** un Signal. C'est un `OutputEmitterRef` — il ne se lit pas avec `()` et n'a pas de valeur réactive. Il est traité dans la page Input/Output.

**Piège entretien :** `linkedSignal` (Angular 19+) comble le trou entre `computed` (read-only) et `signal` (pas de dépendances). Cas d'usage typique : une sélection qui se réinitialise quand la liste change, mais que l'utilisateur peut modifier.

---

## Signal vs variable classique ?
> La différence clé : Angular sait exactement quel signal a changé et ne rafraîchit que les vues qui en dépendent. Avec une variable classique, Zone.js doit scanner tout l'arbre de composants.

```typescript
// Variable classique — Zone.js scanne tout
count = 0;
increment() { this.count++; }

// Signal — change detection ciblée
count = signal(0);
increment() { this.count.update(n => n + 1); }
```

**Piège entretien :** Les signals permettent de se passer de Zone.js (`zoneless`). C'est la direction prise par Angular à partir de v18.

---

## Computed vs getter ?
> Un getter est recalculé à chaque cycle de change detection. Un `computed()` est mémoïsé : il ne se recalcule que si ses dépendances changent.

```typescript
// Getter — recalculé à chaque CD
get fullName() {
  return `${this.firstName} ${this.lastName}`;
}

// Computed — recalculé uniquement si firstName() ou lastName() changent
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

**Piège entretien :** Dans un composant `OnPush`, le getter peut ne plus se mettre à jour. Le `computed()` est toujours correct car il track ses dépendances signals.

---

## Input signal vs @Input ?
> `input()` retourne un signal read-only. Plus besoin de `ngOnChanges` pour réagir aux changements — un `computed()` suffit.

```typescript
// Legacy
export class OldComponent implements OnChanges {
  @Input() name?: string;
  ngOnChanges(changes: SimpleChanges) { /* réagir */ }
}

// Moderne
export class NewComponent {
  name = input.required<string>();
  greeting = computed(() => `Hello ${this.name()}!`);
}
```

**Piège entretien :** `input.required()` garantit que la valeur n'est jamais `undefined` — c'est une erreur de compilation si le parent ne la passe pas.

---

## Signals vs RxJS ?

| Utiliser Signals | Utiliser RxJS |
|------------------|---------------|
| État local du composant | HTTP, WebSocket |
| Valeurs dérivées | debounce, retry, buffer |
| Inputs/Outputs | Event streams complexes |

```typescript
// Convertir Observable → Signal
users = toSignal(this.http.get<User[]>('/api/users'), { initialValue: [] });

// Convertir Signal → Observable
count$ = toObservable(this.count);
```

**Piège entretien :** Signals et RxJS sont complémentaires, pas concurrents. `toSignal()` / `toObservable()` permettent de faire le pont facilement.

---

## Comment gérer l'immutabilité avec les signals ?
> Ne jamais muter la valeur directement — Angular ne détectera pas le changement. Toujours passer par `set()` ou `update()` avec une nouvelle référence.

```typescript
const users = signal([{ name: 'Alice' }]);

// Mauvais — mutation directe, pas détectée
users()[0].name = 'Bob';

// Bon — nouvelle référence
users.update(list => list.map((u, i) => i === 0 ? { ...u, name: 'Bob' } : u));
```

**Piège entretien :** Ce comportement est identique à `OnPush` avec les objets imbriqués. La règle : si tu mutes sans changer la référence racine, rien ne se met à jour.

---

## C'est quoi effect() ?
> `effect()` exécute une fonction à chaque fois qu'un signal qu'elle lit change. C'est l'équivalent d'un `watch` Vue ou d'un `useEffect` React, mais automatiquement tracké.

```typescript
constructor() {
  effect(() => {
    // Re-exécuté chaque fois que count() change
    console.log('Count:', this.count());
  });
}
```

**Piège entretien :** `effect()` ne doit JAMAIS modifier d'autres signals — cela cause des erreurs `ExpressionChangedAfterItHasBeenChecked` et des boucles infinies. Pour propager de l'état, utiliser `computed()` ou `linkedSignal()`. `effect()` est réservé aux side-effects purs (logs, localStorage, DOM tiers).
