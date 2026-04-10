---
sidebar_position: 7
---

# Pipes

## C'est quoi un pipe ?

> Un pipe transforme une valeur dans le template sans modifier les données sous-jacentes. Il s'applique avec `|` et est chaînable.

```html
{{ user.createdAt | date:'short' }}
{{ product.name | uppercase | slice:0:20 }}
{{ price | currency:'EUR' }}
```

**Piège entretien :** les pipes n'affectent que l'affichage — la donnée d'origine reste intacte. Ce ne sont pas des méthodes de transformation de données.

---

## Quels sont les pipes built-in essentiels ?

> Angular fournit un ensemble de pipes prêts à l'emploi pour les cas les plus courants.

| Pipe | Usage |
|---|---|
| `date` | Formater une date (`'short'`, `'longDate'`…) |
| `currency` | Formater un montant avec symbole monétaire |
| `percent` | Afficher un nombre en pourcentage |
| `uppercase` / `lowercase` | Changer la casse d'une chaîne |
| `json` | Afficher un objet en JSON (debug) |
| `async` | Souscrire à un Observable ou Promise |

```html
{{ 0.42 | percent }}           <!-- 42% -->
{{ 1500 | currency:'EUR' }}    <!-- 1 500,00 € -->
{{ today | date:'dd/MM/yyyy' }}
```

**Piège entretien :** `json` est utile pour déboguer un objet en template, mais ne doit pas rester en production.

---

## C'est quoi le async pipe ?

> Le async pipe souscrit automatiquement à un Observable ou une Promise, affiche la valeur émise, et se désinscrit à la destruction du composant. C'est la meilleure pratique pour éviter les memory leaks.

```typescript
// component
data$ = this.svc.getUsers(); // Observable<User[]>
```

```html
@if (data$ | async; as users) {
  @for (user of users; track user.id) {
    <li>{{ user.name }}</li>
  }
}
```

**Piège entretien :** chaque usage de `| async` dans le template ouvre une souscription distincte. Utiliser `as` pour éviter les souscriptions multiples sur le même Observable.

---

## Comment créer un custom pipe ?

> Un pipe est une classe décorée avec @Pipe qui implémente une méthode transform(). En Angular moderne, il est standalone par défaut.

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class Truncate implements PipeTransform {
  transform(value: string, limit = 50): string {
    return value.length > limit ? value.slice(0, limit) + '…' : value;
  }
}
```

```html
{{ article.content | truncate:100 }}
```

**Piège entretien :** penser à déclarer le pipe dans les imports du composant standalone ou du module. Sans ça, Angular ne le reconnaît pas et ne lève pas d'erreur explicite.

---

## Pure vs impure pipe ?

> Un pipe pure (défaut) est recalculé uniquement si la référence d'entrée change. Un pipe impure (`pure: false`) est recalculé à chaque cycle de change detection, quelle que soit la valeur.

```typescript
// Impure : recalculé à chaque cycle CD — dangereux
@Pipe({ name: 'filterList', pure: false })
export class FilterListPipe implements PipeTransform {
  transform(items: string[], query: string): string[] {
    return items.filter(i => i.includes(query));
  }
}
```

**Piège entretien :** les pipes impures sont un piège de performance — ils s'exécutent à chaque cycle de change detection, même sans changement de données. Préférer une propriété calculée ou un signal dans le composant.
