---
sidebar_position: 5
---

# Cas Pratique : Éditeur avec Guard de Sortie

## 🎯 Énoncé

Créer un éditeur d'article de blog avec protection contre la perte de données lors de la navigation.

**Niveau : Confirmé**

### Fonctionnalités

L'application doit permettre de :
- Créer et éditer un article de blog
- Détecter si le formulaire a été modifié (dirty state)
- Empêcher l'utilisateur de quitter la page si des modifications non sauvegardées existent
- Afficher une boîte de dialogue de confirmation avant de quitter
- Sauvegarder l'article et marquer le formulaire comme "propre"
- Naviguer vers une liste d'articles
- Gérer la navigation par le navigateur (bouton retour) et par l'application

### Structure de l'application

#### Page Liste (/articles)
- Afficher une liste de 3-4 articles (titre + date)
- Bouton "Nouvel article"
- Cliquer sur un article pour l'éditer

#### Page Éditeur (/articles/new ou /articles/:id)
- Champ Titre (obligatoire, min 5 caractères)
- Champ Auteur (obligatoire)
- Champ Contenu (textarea, obligatoire, min 50 caractères)
- Sélecteur Catégorie (Technologie, Voyage, Cuisine, Sport)
- Checkbox "Publier immédiatement"
- Boutons :
  - "Sauvegarder" (désactivé si formulaire invalide)
  - "Annuler" (retour à la liste avec confirmation si modifié)
- Indicateur visuel si des modifications non sauvegardées existent

### Le Guard (CanDeactivate)

Le guard doit :
- Vérifier si le formulaire a été modifié (dirty) **ET** non sauvegardé
- Si oui, afficher une confirmation avant de quitter :
  - "Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?"
  - Options : "Quitter sans sauvegarder" / "Rester sur la page"
- Si non, permettre la navigation sans confirmation
- Fonctionner pour :
  - Navigation interne (bouton Annuler, clic sur la liste)
  - Navigation navigateur (bouton retour, fermeture onglet)
  - Navigation par URL

### Exemple de structure

```
┌─────────────────────────────────────────────┐
│  Éditeur d'article          [⚠ Non sauvegardé] │
├─────────────────────────────────────────────┤
│  Titre:                                     │
│  [Mon premier article____________]          │
│                                             │
│  Auteur:                                    │
│  [Jean Dupont___________________]           │
│                                             │
│  Catégorie:                                 │
│  [Technologie ▼]                           │
│                                             │
│  Contenu:                                   │
│  [________________________________]          │
│  [________________________________]          │
│  [________________________________]          │
│  [________________________________]          │
│                                             │
│  ☐ Publier immédiatement                    │
│                                             │
│  [Annuler]              [Sauvegarder]       │
└─────────────────────────────────────────────┘
```

### Comportement attendu

1. **Modifications détectées**
   - Dès qu'un champ est modifié, marquer le formulaire comme "dirty"
   - Afficher un indicateur visuel (ex: "Non sauvegardé" en orange)

2. **Tentative de navigation avec modifications non sauvegardées**
   - Bloquer la navigation
   - Afficher la boîte de dialogue de confirmation
   - Si "Quitter" → permettre la navigation
   - Si "Rester" → annuler la navigation

3. **Sauvegarde réussie**
   - Marquer le formulaire comme "pristine"
   - Retirer l'indicateur visuel
   - Permettre la navigation sans confirmation
   - Afficher un message de succès
   - Rediriger vers la liste (optionnel)

4. **Bouton Annuler**
   - Si modifications → afficher la confirmation
   - Si pas de modifications → retour direct à la liste

### Structure technique recommandée

#### Le Guard (CanDeactivate)

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```

#### Le Component

```typescript
export class EditorComponent implements CanComponentDeactivate {
  articleForm: FormGroup;
  isSaved = false;

  canDeactivate(): boolean | Observable<boolean> {
    if (this.articleForm.dirty && !this.isSaved) {
      return confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?');
    }
    return true;
  }

  save() {
    // Sauvegarder l'article
    this.isSaved = true;
    // ...
  }
}
```
