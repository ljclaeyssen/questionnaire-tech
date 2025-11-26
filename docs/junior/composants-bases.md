---
sidebar_position: 3
---

# Les Composants

## ❓ Qu'est-ce qu'un composant Angular ?

Une classe TypeScript décorée avec `@Component` qui contrôle une partie de l'interface utilisateur.

**Structure :**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,          // Angular 17+, par défaut depuis Angular 19
  imports: [],
  template: '<p>Hello</p>',
  styles: ['p { color: blue; }']
})
export class ExampleComponent {
  title = 'Mon Composant';
}
```

**Éléments clés :**
- `selector` : Tag HTML
- `standalone: true` : Pas besoin de NgModule
- `imports` : Dépendances nécessaires
- `template` ou `templateUrl` : Vue HTML
- `styles` ou `styleUrls` : CSS

## ❓ Comment créer un composant ?

```bash
# Angular CLI (recommandé)
ng generate component mon-composant
ng g c mon-composant  # Version courte
```

**Fichiers générés :**
```
mon-composant/
├── mon-composant.component.ts
├── mon-composant.component.html
├── mon-composant.component.scss
└── mon-composant.component.spec.ts
```

**Options utiles :**
- `--skip-tests` : Pas de fichier de test
- `--inline-template` : Template dans le .ts
- `--inline-style` : Styles dans le .ts
- `--flat` : Pas de dossier

## ❓ template vs templateUrl ?

```typescript
// Template inline
@Component({
  template: '<h1>{{title}}</h1>'
})

// Template externe 
@Component({
  templateUrl: './my.component.html'
})
```

**Quand utiliser quoi ?**
- `template` : Idéalement jamais
- `templateUrl` : Idéalement toujours

## ❓ Standalone vs NgModule ?

### ✅ Moderne (Angular 17+)
```typescript
@Component({
  standalone: true,
  imports: [CommonModule]
})
export class MyComponent {}
```

### ❌ Legacy (Angular < 17)
```typescript
// my.component.ts
export class MyComponent {}

// my.module.ts
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})
export class MyModule {}
```

**Note :** Standalone est la norme depuis Angular 19+.

## Questions fréquentes pour examinateurs

1. **Qu'est-ce qu'un composant ?** → Classe + @Component + template + styles
2. **Comment créer un composant ?** → ng generate component
3. **Différence template vs templateUrl ?** → Inline vs fichier séparé
4. **C'est quoi standalone ?** → Composant sans NgModule
5. **Selector obligatoire ?** → Oui, pour utiliser le composant
6. **Peut-on avoir plusieurs composants dans un fichier ?** → Oui mais déconseillé
