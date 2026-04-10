---
sidebar_position: 3
---

# Convertisseur d'Unités

**Niveau** : Junior
**Durée** : 30 min
**Concepts évalués** : two-way binding, formulaire simple, logique de calcul

## Énoncé

Construire un convertisseur d'unités couvrant la température (°C, °F, K), la distance (m, km, miles, pieds) et le poids (kg, g, lb, oz). L'utilisateur saisit une valeur, choisit l'unité source et l'unité cible — le résultat s'affiche en temps réel. Un bouton permet d'inverser les deux unités.

## Critères d'évaluation

- Architecture du mapping de conversions : évite les `if/else` en cascade
- Réactivité du résultat : recalcul à chaque changement de valeur ou d'unité
- Gestion du cas `from === to` et des entrées vides ou invalides
- Propreté du two-way binding (`ngModel` ou reactive forms)

<details>
<summary>Indice 1</summary>

Centralise les formules dans un objet de type `Record<string, Record<string, (v: number) => number>>` plutôt que des `if` imbriqués. Ex : `conversions['°C']['°F'] = v => v * 9/5 + 32`.
</details>

<details>
<summary>Indice 2</summary>

Quand le type de conversion change (ex: Température → Distance), les unités disponibles changent aussi. Maintiens une liste `availableUnits` dérivée du type sélectionné pour alimenter les deux selects.
</details>

<details>
<summary>Indice 3</summary>

Pour le bouton "inverser", il suffit de swapper `fromUnit` et `toUnit` : `[this.fromUnit, this.toUnit] = [this.toUnit, this.fromUnit]`. La méthode `convert()` recalcule automatiquement si elle est appelée à chaque changement.
</details>
