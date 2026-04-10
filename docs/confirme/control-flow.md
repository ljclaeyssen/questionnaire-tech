---
sidebar_position: 4
---

# Control Flow - @if, @for, @switch

## @if vs *ngIf ?
> `@if` est une syntaxe native Angular 17+ intégrée au compilateur. Elle supporte `@else if` nativement, sans `ng-template`.

```html
@if (role === 'admin') {
  <div>Panel Admin</div>
} @else if (role === 'user') {
  <div>Panel User</div>
} @else {
  <div>Guest</div>
}
```

**Piège entretien :** `else if` était impossible directement avec `*ngIf` — il fallait chaîner des `ng-template`. C'est un vrai argument de lisibilité à mentionner.

---

## @for — comment ça marche ?
> `track` est obligatoire dans `@for`. Il identifie chaque élément de manière unique pour que Angular réutilise le DOM existant plutôt que de tout recréer.

```html
@for (user of users; track user.id) {
  <div [class.highlighted]="$first">{{$index + 1}}. {{user.name}}</div>
} @empty {
  <p>Aucun utilisateur</p>
}
```

**Variables contextuelles :** `$index`, `$first`, `$last`, `$even`, `$odd`, `$count`

**Piège entretien :** Oublier `track` est une erreur de compilation. Savoir justifier `track $index` (pas d'ID stable) vs `track user.id` (identifiant stable, meilleur pour les mutations).

---

## @switch vs ngSwitch ?
> `@switch` remplace `[ngSwitch]` + `*ngSwitchCase`. La syntaxe est plus proche d'un vrai switch/case, sans directives à importer.

```html
@switch (status) {
  @case ('pending') { <span>En attente</span> }
  @case ('approved') { <span>Approuvé</span> }
  @default { <span>Inconnu</span> }
}
```

**Piège entretien :** `ngSwitch` nécessitait d'importer `NgSwitch`, `NgSwitchCase`, `NgSwitchDefault`. `@switch` n'a aucune dépendance à importer.

---

## Performances @for vs *ngFor ?
> Le nouveau control flow est compilé statiquement, ce qui permet au compilateur d'optimiser le rendu. Gains mesurés sur 10 000 éléments :

```
*ngFor + *ngIf :         @for + @if :
  Initial : 250ms          Initial : 120ms  (-52%)
  Update  : 180ms          Update  :  90ms  (-50%)
```

| Ancien | Nouveau | Avantage clé |
|--------|---------|--------------|
| `*ngIf` | `@if` | `else if` natif |
| `*ngFor; trackBy: fn` | `@for; track id` | `track` inline obligatoire |
| `[ngSwitch]` | `@switch` | Aucun import |
| deux `*ngIf` pour empty | `@empty` | Intégré à `@for` |

**Piège entretien :** Le gain de ~50% vient du fait que c'est du control flow natif compilé, pas des directives runtime. Citer les chiffres en entretien est un signal fort.

---

## Comment migrer automatiquement ?
> Angular fournit un schematic officiel. Il migre les templates en une commande.

```bash
# Migrer tout le projet
ng generate @angular/core:control-flow

# Migrer un fichier spécifique
ng g @angular/core:control-flow --path src/app/my.component.ts
```

**Piège entretien :** Ancien et nouveau styles sont compatibles dans le même projet pendant la migration. Pas besoin de tout migrer d'un coup.
