---
sidebar_position: 4
---

# Control Flow - @if, @for, @switch

## ❓ Pourquoi la nouvelle syntaxe ?

Angular 17 remplace les directives structurelles par une syntaxe native plus performante.

**Gains :**
- 🚀 50% plus rapide
- 📦 Bundle size réduit
- 📖 Plus lisible

## @if - Conditions

### Syntaxe de base

```html
<!-- ✅ Moderne -->
@if (user) {
  <div>Bonjour {{user.name}}</div>
}

<!-- ❌ Ancien -->
<div *ngIf="user">Bonjour {{user.name}}</div>
```

### else et else if

```html
<!-- ✅ Moderne -->
@if (role === 'admin') {
  <div>Panel Admin</div>
} @else if (role === 'user') {
  <div>Panel User</div>
} @else {
  <div>Guest</div>
}
```

**Note :** `else if` natif ! (impossible avec *ngIf)

**💡 Bonus - Ancien style avec ng-template :**
```html
<!-- ❌ Ancien - Verbeux et pas de else if natif -->
<div *ngIf="user; else noUser">
  Bonjour {{user.name}}
</div>
<ng-template #noUser>
  <div>Veuillez vous connecter</div>
</ng-template>

<!-- ❌ Ancien - else if avec ng-template imbriqués -->
<div *ngIf="role === 'admin'; else checkUser">
  <div>Panel Admin</div>
</div>
<ng-template #checkUser>
  <div *ngIf="role === 'user'; else guest">
    <div>Panel User</div>
  </div>
</ng-template>
<ng-template #guest>
  <div>Guest</div>
</ng-template>
```

## @for - Boucles

### Syntaxe de base

```html
@for (user of users; track user.id) {
  <div>{{user.name}}</div>
}
```

**⚠️ Important :** `track` est OBLIGATOIRE !

**À quoi sert track ?**
- Identifie de manière unique chaque élément de la liste
- Angular utilise cette valeur pour savoir quels éléments ont changé, été ajoutés ou supprimés
- **Performance** : évite de recréer tout le DOM, réutilise les éléments existants
- Utilise `track $index` si pas d'ID unique, ou `track item.id` pour un identifiant stable

**Exemple :**
```typescript
// Sans track: Angular recrée TOUT le DOM
// Avec track: Angular ne recrée que les éléments modifiés
users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
// Si on ajoute Bob → Angular réutilise Alice grâce à track user.id
```

### Variables de contexte

```html
@for (user of users; track user.id; let i = $index; let first = $first) {
  <div [class.first]="first">
    {{i + 1}}. {{user.name}}
  </div>
}
```

**Variables disponibles :**
- `$index` : Index (0-based)
- `$first` : Premier élément
- `$last` : Dernier élément
- `$even` : Index pair
- `$odd` : Index impair
- `$count` : Nombre total

### @empty - Liste vide

```html
@for (user of users; track user.id) {
  <div>{{user.name}}</div>
} @empty {
  <p>Aucun utilisateur</p>
}
```

Équivalent à :
```html
<!-- ❌ Ancien - Verbeux -->
<div *ngIf="users.length > 0">
  <div *ngFor="let user of users">{{user.name}}</div>
</div>
<div *ngIf="users.length === 0">
  <p>Aucun utilisateur</p>
</div>
```

## @switch - Switch case

```html
@switch (status) {
  @case ('pending') {
    <span>En attente</span>
  }
  @case ('approved') {
    <span>Approuvé</span>
  }
  @case ('rejected') {
    <span>Rejeté</span>
  }
  @default {
    <span>Inconnu</span>
  }
}
```

## Comparaison avant/après

| Ancien | Nouveau | Avantage |
|--------|---------|----------|
| `*ngIf` | `@if` | else if natif |
| `*ngFor; trackBy: fn` | `@for; track id` | track inline |
| `*ngSwitch` | `@switch` | Plus lisible |
| ng-template pour else | `@else` | Simplifié |
| Deux *ngIf pour empty | `@empty` | Intégré |

## ❓ track vs trackBy ?

```typescript
// ❌ Ancien - Fonction séparée
trackByUserId(index: number, user: User) {
  return user.id;
}
```

```html
<div *ngFor="let user of users; trackBy: trackByUserId">
```

```html
<!-- ✅ Nouveau - Expression inline -->
@for (user of users; track user.id) {
  <div>{{user.name}}</div>
}
```

**Avantages :**
- Pas de fonction séparée
- Peut utiliser l'index : `track $index`
- Peut combiner : `track user.id + user.name`

## Migration automatique

```bash
# Migrer tout le projet
ng generate @angular/core:control-flow

# Migrer un fichier
ng g @angular/core:control-flow --path src/app/my.component.ts
```

## Cas complexes

### Conditions imbriquées

```html
@if (user) {
  @if (user.isAdmin) {
    <admin-panel />
  } @else {
    <user-panel />
  }
} @else {
  <login-form />
}
```

### Boucle avec conditions

```html
@for (product of products; track product.id) {
  <div class="product">
    <h3>{{product.name}}</h3>

    @if (product.isNew) {
      <span class="badge">Nouveau</span>
    }

    @if (product.onSale) {
      <span class="price">{{product.price * 0.8}}€</span>
    } @else {
      <span class="price">{{product.price}}€</span>
    }
  </div>
}
```

## Performance

```
Benchmark (10 000 éléments) :

*ngFor + *ngIf :
  Initial render: 250ms
  Update: 180ms

@for + @if :
  Initial render: 120ms (-52%)
  Update: 90ms (-50%)
```

## Questions fréquentes pour examinateurs

1. **Pourquoi @if au lieu de *ngIf ?** → Performance, lisibilité, else if natif
2. **track obligatoire ?** → Oui dans @for
3. **Différence track vs trackBy ?** → track inline, trackBy fonction séparée
4. **@empty sert à quoi ?** → Afficher contenu si liste vide
5. **Variables dans @for ?** → $index, $first, $last, $even, $odd, $count
6. **Migration auto ?** → `ng generate @angular/core:control-flow`
7. **Peut mélanger ancien/nouveau ?** → Oui pendant migration
8. **Gain de performance ?** → ~50% plus rapide
9. **else if avec *ngIf ?** → Non, besoin de ng-template
10. **Depuis quelle version ?** → Angular 17
