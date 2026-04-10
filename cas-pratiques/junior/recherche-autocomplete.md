---
sidebar_position: 4
---

# Recherche avec Autocomplete

**Niveau** : Junior
**Durée** : 30 min
**Concepts évalués** : RxJS (debounceTime, map, filter), reactive forms, async pipe

## Énoncé

Construire une barre de recherche avec suggestions automatiques sur une liste de pays. La recherche se déclenche 300ms après la dernière frappe, uniquement si au moins 2 caractères sont saisis. Les résultats sont filtrés sans distinction de casse. Un compteur affiche le nombre de résultats trouvés.

```typescript
countries = [
  'France', 'Allemagne', 'Italie', 'Espagne', 'Portugal',
  'Belgique', 'Pays-Bas', 'Suisse', 'Autriche', 'Pologne',
  'Suède', 'Norvège', 'Danemark', 'Finlande', 'Islande',
  'Royaume-Uni', 'Irlande', 'Grèce', 'Croatie', 'Slovénie',
  'République tchèque', 'Slovaquie', 'Hongrie', 'Roumanie',
  'Bulgarie', 'Estonie', 'Lettonie', 'Lituanie'
];
```

## Critères d'évaluation

- Chaîne RxJS correcte : `debounceTime`, `distinctUntilChanged`, `map`, `filter`
- Utilisation de `async pipe` dans le template plutôt qu'un `subscribe` manuel
- Gestion des états : moins de 2 caractères, aucun résultat, résultats trouvés
- Nettoyage des observables (pas de fuite mémoire)

<details>
<summary>Indice 1</summary>

Crée un `FormControl` pour le champ de recherche et écoute `valueChanges`. C'est le point d'entrée naturel de la chaîne RxJS — pas besoin d'event listener manuel.
</details>

<details>
<summary>Indice 2</summary>

La chaîne ressemble à : `this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), map(term => this.filterCountries(term)))`. Assigne le résultat à `results$: Observable<string[]>` et utilise `async` dans le template.
</details>

<details>
<summary>Indice 3</summary>

Pour conditionner l'affichage selon le nombre de caractères, ajoute un `map` qui retourne un tableau vide si `term.length < 2`. Tu peux combiner ça avec un second observable `message$` pour afficher "Tapez au moins 2 caractères" vs "Aucun résultat".
</details>
