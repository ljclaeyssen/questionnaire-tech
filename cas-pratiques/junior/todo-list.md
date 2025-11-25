---
sidebar_position: 2
---

# Cas Pratique : Todo List

## 🎯 Énoncé

Créer une application de gestion de tâches permettant d'ajouter, supprimer et marquer des tâches comme complétées.

**Niveau : Junior / Débutant**

### Fonctionnalités

L'application doit permettre de :
- Ajouter une nouvelle tâche avec un champ de saisie
- Afficher la liste de toutes les tâches
- Marquer une tâche comme complétée / non complétée (toggle)
- Supprimer une tâche
- Afficher le nombre de tâches actives restantes
- Filtrer l'affichage : Toutes / Actives / Complétées

### Interface utilisateur

L'interface doit contenir :
- Un champ de saisie pour ajouter une nouvelle tâche
- Une liste affichant toutes les tâches avec :
  - Une checkbox pour marquer comme complétée
  - Le texte de la tâche (barré si complétée)
  - Un bouton de suppression
- Des boutons de filtre : "Toutes", "Actives", "Complétées"
- Un compteur : "X tâche(s) restante(s)"

### Comportement attendu

- Quand on ajoute une tâche, le champ de saisie se vide automatiquement
- Les tâches complétées doivent être visuellement différenciées (texte barré, opacité réduite, etc.)
- Les filtres ne suppriment pas les tâches, ils changent juste l'affichage
- Le compteur affiche uniquement les tâches actives (non complétées)
- Si on appuie sur "Entrée" dans le champ de saisie, la tâche est ajoutée

### Exemple de structure

```
┌─────────────────────────────────────┐
│  Ajouter une tâche: [___________] ➕│
├─────────────────────────────────────┤
│  ☐ Faire les courses         [🗑️]  │
│  ☑ Appeler le dentiste       [🗑️]  │
│  ☐ Terminer le projet Angular [🗑️]  │
├─────────────────────────────────────┤
│  [Toutes] [Actives] [Complétées]   │
│  2 tâche(s) restante(s)             │
└─────────────────────────────────────┘
```
