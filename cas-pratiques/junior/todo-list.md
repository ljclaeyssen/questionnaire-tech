---
sidebar_position: 2
---

# Todo List

**Niveau** : Junior
**Durée** : 30 min
**Concepts évalués** : @for, @if, gestion de liste, event handling

## Énoncé

Construire une application de gestion de tâches. L'utilisateur peut ajouter des tâches, les marquer comme complétées, les supprimer et filtrer l'affichage (Toutes / Actives / Complétées). Un compteur indique le nombre de tâches actives restantes.

## Critères d'évaluation

- Utilisation correcte de `@for` et `@if` (syntaxe Angular 17+)
- Modélisation de la tâche : interface `Todo` avec `id`, `text`, `completed`
- Gestion du filtre sans mutation du tableau source
- Binding bidirectionnel ou event-driven pour le toggle
- Cohérence du compteur avec l'état réel

<details>
<summary>Indice 1</summary>

Commence par définir une interface `Todo { id: number; text: string; completed: boolean }` et un tableau `todos: Todo[]`. Le filtre est juste un getter calculé à partir de ce tableau.
</details>

<details>
<summary>Indice 2</summary>

Pour les filtres, utilise une propriété `filter: 'all' | 'active' | 'completed'` et un getter `filteredTodos` qui retourne le sous-ensemble correspondant. Pas besoin de tableaux séparés.
</details>

<details>
<summary>Indice 3</summary>

Le toggle se fait avec `todo.completed = !todo.completed`. Pour la suppression, `this.todos = this.todos.filter(t => t.id !== id)`. Le compteur : `get activeCount() { return this.todos.filter(t => !t.completed).length; }`.
</details>
