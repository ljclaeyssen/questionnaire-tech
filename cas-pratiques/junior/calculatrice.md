---
sidebar_position: 1
---

# Calculatrice Simple

**Niveau** : Junior
**Durée** : 30 min
**Concepts évalués** : event binding, data binding, gestion d'état local

## Énoncé

Construire une calculatrice permettant d'effectuer les 4 opérations de base (+, -, ×, ÷).
L'affichage se met à jour au fil de la saisie. Gérer les nombres décimaux et la division par zéro.
Un bouton Clear remet la calculatrice à zéro.

## Critères d'évaluation

- Structure de l'état : comment le candidat modélise `display`, `operator`, `previousValue`
- Séparation entre la logique de calcul et le template
- Gestion des cas limites : division par zéro, double opérateur, résultat décimal
- Clarté du binding : utilise-t-il `(click)`, `[textContent]` à bon escient ?

<details>
<summary>Indice 1</summary>

Pense à l'état minimal nécessaire : la valeur courante affichée, l'opérateur en attente, et la valeur précédente. Trois propriétés suffisent.
</details>

<details>
<summary>Indice 2</summary>

Chaque bouton chiffre appelle une méthode `appendDigit(digit: string)` qui concatène au display courant. Les boutons opérateurs appellent `setOperator(op: string)` qui mémorise le premier opérande.
</details>

<details>
<summary>Indice 3</summary>

Pour le calcul final, une simple structure `switch` sur l'opérateur suffit. Pense à convertir `parseFloat` avant de calculer, et à afficher `"Erreur"` si division par zéro.
</details>
