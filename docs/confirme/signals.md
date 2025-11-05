---
sidebar_position: 3
---

# Signals - Réactivité Moderne

## ❓ Qu'est-ce qu'un Signal ?

Primitive de réactivité introduite dans Angular 16 pour gérer l'état de façon plus performante que Zone.js.

```typescript
import { signal, computed } from '@angular/core';

const count = signal(0);
const double = computed(() => count() * 2);

// Lecture
console.log(count());  // 0
console.log(double()); // 0

// Écriture
count.set(5);         // Remplace
count.update(n => n + 1); // Incrémente
```

## Les 4 types de Signals

| Type | Usage | Écriture | Lecture |
|------|-------|----------|---------|
| `signal()` | État modifiable | ✅ set/update | ✅ () |
| `computed()` | Valeur dérivée | ❌ read-only | ✅ () |
| `input()` | Depuis parent | ❌ read-only | ✅ () |
| `output()` | Vers parent | ✅ emit() | ❌ |

```typescript
// 1. Signal de base
const count = signal(0);
count.set(5);
count.update(n => n + 1);

// 2. Computed
const double = computed(() => count() * 2);

// 3. Input signal
name = input.required<string>();
age = input<number>(0);

// 4. Output signal
clicked = output<void>();
```

## ❓ Signal vs Variable classique ?

```typescript
// ❌ Ancien - Zone.js détecte tout
export class OldComponent {
  count = 0;
  increment() {
    this.count++; // Zone.js scanne tout l'arbre
  }
}

// ✅ Nouveau - Detection ciblée
export class NewComponent {
  count = signal(0);
  increment() {
    this.count.update(n => n + 1); // Angular sait exactement quoi rafraîchir
  }
}
```

**Avantages Signals :**
- ✅ Performance : change detection granulaire
- ✅ Type-safe : pas d'undefined surprise
- ✅ Auto-update : computed se met à jour automatiquement
- ✅ Zoneless : fonctionne sans Zone.js

## ❓ Input signal vs @Input ?

```typescript
// ❌ Ancien
@Component({...})
export class OldComponent implements OnChanges {
  @Input() name?: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      // Réagir au changement
    }
  }
}

// ✅ Nouveau
@Component({...})
export class NewComponent {
  name = input.required<string>();

  // Computed se met à jour auto
  greeting = computed(() => `Hello ${this.name()}!`);
}
```

**Avantages input signal :**
- Type-safe (required vs optional)
- Pas besoin de OnChanges
- Computed automatique
- Transformation intégrée

## Input options

```typescript
// Obligatoire
name = input.required<string>();

// Optionnel avec défaut
age = input<number>(0);

// Transformation
email = input('', {
  transform: (v: string) => v.toLowerCase().trim()
});

// Alias
userId = input.required<string>({ alias: 'id' });

// Usage
<app-user [id]="123" [email]="'USER@EXAMPLE.COM'" />
```

## ❓ Computed vs Getter ?

```typescript
// ❌ Ancien - Recalculé à chaque change detection
get fullName() {
  return `${this.firstName} ${this.lastName}`;
}

// ✅ Nouveau - Mémorisé et recalculé uniquement si dépendances changent
fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
```

## Output signal

```typescript
// ❌ Ancien
@Output() clicked = new EventEmitter<string>();

handleClick() {
  this.clicked.emit('data');
}

// ✅ Nouveau (Angular 17.3+)
clicked = output<string>();

handleClick() {
  this.clicked.emit('data');
}
```

## ❓ Signals vs RxJS ?

| Utiliser Signals | Utiliser RxJS |
|------------------|---------------|
| État local | HTTP, WebSocket |
| Valeurs dérivées | debounce, retry |
| Inputs/Outputs | Event streams |
| Performance | Opérations complexes |

```typescript
// Signals pour état
count = signal(0);
double = computed(() => this.count() * 2);

// RxJS pour async
users$ = this.http.get<User[]>('/api/users');

// Convertir Observable → Signal
users = toSignal(this.users$, { initialValue: [] });

// Convertir Signal → Observable
count$ = toObservable(this.count);
```

## Mutation et immutabilité

```typescript
// ❌ Mauvais - Mutation directe
const users = signal([{ name: 'Alice' }]);
users()[0].name = 'Bob'; // Pas détecté !

// ✅ Bon - Immutabilité
users.update(list =>
  list.map((u, i) => i === 0 ? { ...u, name: 'Bob' } : u)
);

// ✅ Bon - Remplacer
users.set([{ name: 'Bob' }]);
```

## Effect (side effects)

```typescript
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    // S'exécute quand count() change
    console.log('Count:', this.count());
  });
}
```

## Questions fréquentes pour examinateurs

1. **C'est quoi un Signal ?** → Primitive de réactivité
2. **Avantages vs variables ?** → Performance, type-safety, auto-update
3. **Différence signal vs computed ?** → signal modifiable, computed read-only dérivé
4. **input() vs @Input() ?** → Type-safe, pas de OnChanges, transformation
5. **Lecture d'un signal ?** → Appeler avec () : `count()`
6. **Écriture ?** → set() ou update()
7. **Computed recalculé quand ?** → Uniquement si dépendances changent
8. **Signals ou RxJS ?** → Signals pour état, RxJS pour async complexe
9. **toSignal() ?** → Convertit Observable en Signal
10. **Mutation directe ok ?** → Non ! Toujours immutabilité avec update/set
