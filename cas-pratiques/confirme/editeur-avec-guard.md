---
sidebar_position: 5
---

# Éditeur avec Guard de Sortie

**Niveau** : Confirmé
**Durée** : 45 min
**Concepts évalués** : CanDeactivate guard fonctionnel, dirty state, reactive forms, routing

## Énoncé

Construire un éditeur d'article de blog avec deux pages : une liste d'articles et un éditeur. L'éditeur doit détecter les modifications non sauvegardées et bloquer la navigation avec une confirmation si l'utilisateur tente de quitter sans sauvegarder. La sauvegarde marque le formulaire comme propre et autorise la navigation.

## Critères d'évaluation

- Implémentation du guard fonctionnel `CanDeactivateFn` (Angular 15+)
- Lecture correcte du `dirty` state sur le reactive form
- Distinction entre `dirty` (modifié) et `saved` (explicitement sauvegardé)
- Enregistrement du guard sur la route dans `app.routes.ts`
- Comportement cohérent : confirmation uniquement si modifié ET non sauvegardé

<details>
<summary>Indice 1</summary>

Le composant doit exposer une propriété publique lisible par le guard. Une propriété `isSaved = false` remise à `true` lors de la sauvegarde, combinée à `form.dirty`, donne la condition complète.
</details>

<details>
<summary>Indice 2</summary>

Le guard fonctionnel s'écrit :

```typescript
export const unsavedChangesGuard: CanDeactivateFn<EditorComponent> = (component) => {
  if (component.articleForm.dirty && !component.isSaved) {
    return confirm('Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter ?');
  }
  return true;
};
```
</details>

<details>
<summary>Indice 3</summary>

Le guard se déclare dans le routing sur la route de l'éditeur :

```typescript
{
  path: 'articles/:id',
  component: EditorComponent,
  canDeactivate: [unsavedChangesGuard]
}
```

Attention : après une sauvegarde, pense à appeler `this.form.markAsPristine()` en plus de `this.isSaved = true` pour que le guard laisse passer sans confirmation.
</details>
