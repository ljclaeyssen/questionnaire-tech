---
sidebar_position: 4
---

# Input / Output - Communication entre composants

## ❓ Comment passer des données du parent vers l'enfant ?

### ✅ Moderne (Angular 16+)
```typescript
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: '<p>{{name()}}</p>'
})
export class ChildComponent {
  name = input.required<string>();  // Obligatoire
  age = input<number>(0);            // Optionnel avec défaut
}
```

### ❌ Legacy
```typescript
import { Component, Input } from '@angular/core';

export class ChildComponent {
  @Input() name!: string;
  @Input() age = 0;
}
```

**Utilisation (identique) :**
```html
<app-child [name]="'John'" [age]="25"></app-child>
```

## ❓ Comment envoyer des événements de l'enfant vers le parent ?

### ✅ Moderne (Angular 17.3+)
```typescript
import { Component, output } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  template: '<button (click)="clicked.emit(\'Hello!\')">Click</button>'
})
export class ChildComponent {
  clicked = output<string>();
}
```

### ❌ Legacy
```typescript
import { Component, Output, EventEmitter } from '@angular/core';

export class ChildComponent {
  @Output() clicked = new EventEmitter<string>();
}
```

**Utilisation (identique) :**
```html
<app-child (clicked)="handleClick($event)"></app-child>
```

## Comparaison

| Feature | @Input/@Output (legacy) | input/output (moderne) |
|---------|------------------------|------------------------|
| Syntaxe template | `{{name}}` | `{{name()}}` |
| Obligatoire | `@Input({ required: true })` | `input.required<T>()` |
| Défaut | `@Input() age = 0` | `input<number>(0)` |
| Type-safety | ⚠️ Peut être undefined | ✅ Type strict |
| Performance | Standard | ✅ Optimisée |

## ❓ Communication entre frères ?

**Via le parent :**
```typescript
@Component({
  selector: 'app-parent',
  template: `
    <app-sibling-a (dataChange)="sharedData = $event" />
    <app-sibling-b [data]="sharedData" />
  `
})
export class ParentComponent {
  sharedData = '';
}
```

**Via un service (recommandé) :**
```typescript
@Injectable({ providedIn: 'root' })
export class SharedService {
  data = signal<string>('');
}

// Composant A
export class SiblingA {
  service = inject(SharedService);
  updateData() {
    this.service.data.set('nouvelle valeur');
  }
}

// Composant B
export class SiblingB {
  service = inject(SharedService);
  data = this.service.data;  // Signal reactif
}
```

## ❓ Transformation et alias ?

```typescript
// Transformation
email = input('', {
  transform: (value: string) => value.toLowerCase().trim()
});

// Alias
userId = input.required<string>({ alias: 'id' });

// Usage
<app-user [id]="123" [email]="'USER@EXAMPLE.COM'" />
// → userId() = 123
// → email() = 'user@example.com'
```

## Questions fréquentes pour examinateurs

1. **Input sert à quoi ?** → Passer données parent → enfant
2. **Output sert à quoi ?** → Envoyer événements enfant → parent
3. **Différence @Input vs input() ?** → Ancien vs moderne, signals
4. **input.required() ?** → Input obligatoire avec type-safety
5. **Communication entre frères ?** → Via parent ou service
6. **Quand utiliser input() vs @Input() ?** → input() pour nouveaux projets (Angular 16+)
7. **Peut-on transformer un input ?** → Oui avec `transform`
8. **Alias d'input ?** → Oui avec `{ alias: 'newName' }`
