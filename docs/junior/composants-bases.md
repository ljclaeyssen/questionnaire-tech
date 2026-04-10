---
sidebar_position: 3
---

# Les Composants

## Qu'est-ce qu'un composant Angular ?

> Une classe TypeScript décorée avec `@Component` qui encapsule une partie de l'UI : template HTML, styles CSS et logique associée.

```typescript
@Component({
  selector: 'app-user-card',
  standalone: true, // implicite depuis Angular 19
  template: '<p>{{ name }}</p>',
})
export class UserCard {
  name = 'Alice';
}
```

**Piège entretien :** Un composant Angular = les 3 couches réunies (vue, style, logique). Le `selector` est le tag HTML qui permet de l'utiliser : `<app-user-card />`.

---

## Comment créer un composant ?

> Via Angular CLI, qui génère les 4 fichiers avec le bon boilerplate.

```bash
ng generate component user-card
# ou
ng g c user-card
```

Fichiers générés : `.ts`, `.html`, `.scss`, `.spec.ts`.

**Piège entretien :** Toujours utiliser la CLI plutôt que créer les fichiers manuellement. Elle gère aussi l'enregistrement dans le module si nécessaire.

---

## Différence entre `template` et `templateUrl` ?

> `template` : HTML inline dans le décorateur. `templateUrl` : fichier `.html` séparé.

```typescript
// Inline — acceptable pour les très petits composants
@Component({ template: '<h1>{{ title }}</h1>' })

// Fichier séparé — recommandé en pratique
@Component({ templateUrl: './user-card.component.html' })
```

**Piège entretien :** `templateUrl` est la norme en production (lisibilité, coloration syntaxique, refacto). `template` inline est surtout utile pour des composants de test ou des exemples de documentation.

---

## Standalone vs NgModule : quelle différence ?

> Standalone : le composant déclare lui-même ses dépendances via `imports`. NgModule : un module central déclare et exporte les composants.

```typescript
// Standalone (Angular 14+, défaut depuis Angular 19)
@Component({
  standalone: true, // implicite depuis Angular 19, on peut l'omettre
  imports: [CommonModule, RouterLink],
})
export class UserCard {}
```

```typescript
// Legacy NgModule
@NgModule({
  declarations: [UserCardComponent],
  imports: [CommonModule],
})
export class UserModule {}
```

**Piège entretien :** Standalone est la norme depuis Angular 19. Sur un projet existant en NgModule, savoir cohabiter les deux est un vrai plus.

---

## Quels sont les éléments clés du décorateur `@Component` ?

> Les propriétés du décorateur définissent comment Angular monte et affiche le composant.

| Propriété | Rôle |
|-----------|------|
| `selector` | Tag HTML du composant |
| `standalone` | Pas besoin de NgModule (Angular 14+, défaut 19+) |
| `imports` | Dépendances du template (standalone) |
| `template` / `templateUrl` | Vue HTML |
| `styles` / `styleUrl` | CSS scopé au composant |

**Piège entretien :** `selector` est obligatoire. Les styles sont automatiquement scopés au composant (pas de fuite CSS). `styleUrl` (singulier) est la nouvelle syntaxe depuis Angular 17.
