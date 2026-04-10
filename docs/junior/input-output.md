---
sidebar_position: 4
---

# Input / Output - Communication entre composants

## Comment passer des données du parent vers l'enfant ?
> `input()` est la syntaxe moderne (Angular 17+, stable depuis 18). `@Input()` est le legacy. Les deux s'utilisent de la même façon dans le template.

```typescript
// Moderne
export class ChildComponent {
  name = input.required<string>();
  age = input<number>(0);
}

// Legacy
export class ChildComponent {
  @Input() name!: string;
  @Input() age = 0;
}
```

**Piège entretien :** Avec `input()`, la lecture est `name()` (appel de fonction). Avec `@Input()`, c'est `name` directement. Oublier les parenthèses dans le template = valeur non résolue.

---

## Comment envoyer des événements de l'enfant vers le parent ?
> `output()` (Angular 17.3+) remplace `@Output() + EventEmitter`. L'API d'émission reste identique : `.emit()`.

```typescript
// Moderne
export class ChildComponent {
  clicked = output<string>();
  // template : (click)="clicked.emit('Hello!')"
}

// Legacy
export class ChildComponent {
  @Output() clicked = new EventEmitter<string>();
}
```

**Piège entretien :** `output()` n'est PAS un Signal — c'est un `OutputEmitterRef`. Il ne se lit pas avec `()` et n'a pas de valeur réactive.

---

## Quelle est la différence concrète entre @Input/@Output et input()/output() ?

| Feature | @Input/@Output (legacy) | input/output (moderne) |
|---------|------------------------|------------------------|
| Syntaxe template | `{{name}}` | `{{name()}}` |
| Obligatoire | `@Input({ required: true })` | `input.required<T>()` |
| Défaut | `@Input() age = 0` | `input<number>(0)` |
| Type-safety | Peut être undefined | Type strict |
| Réactivité | Zone.js | Signal natif |

**Piège entretien :** Pour les nouveaux projets Angular 17+, toujours préférer `input()`/`output()`. `@Input` reste valide mais ne bénéficie pas de la réactivité des signals.

---

## Comment faire communiquer deux composants frères ?
> Deux approches : via le parent (state lifting) ou via un service partagé (recommandé pour états complexes).

```typescript
// Via service (recommandé)
@Injectable({ providedIn: 'root' })
export class SharedService {
  data = signal<string>('');
}

export class SiblingA {
  service = inject(SharedService);
  update() { this.service.data.set('nouvelle valeur'); }
}

export class SiblingB {
  service = inject(SharedService);
  data = this.service.data; // Signal réactif
}
```

**Piège entretien :** Le state lifting (via parent) fonctionne mais pollue le parent avec une logique qui ne le concerne pas. Le service est l'approche scalable.

---

## Peut-on transformer ou aliaser un input ?
> Oui, `input()` supporte nativement `transform` et `alias`.

```typescript
email = input('', {
  transform: (v: string) => v.toLowerCase().trim()
});

userId = input.required<string>({ alias: 'id' });
// Usage : <app-user [id]="'abc'" [email]="'USER@EX.COM'" />
// → userId() = 'abc', email() = 'user@ex.com'
```

**Piège entretien :** Avec `@Input()`, `transform` n'est disponible qu'à partir d'Angular 16 et la syntaxe est `@Input({ transform: ... })`. Avant ça, il fallait le faire dans `ngOnChanges`.
