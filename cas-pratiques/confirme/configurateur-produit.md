---
sidebar_position: 4
---

# Configurateur de Produit

**Niveau** : Confirmé
**Durée** : 45 min
**Concepts évalués** : RxJS combineLatest, calculs réactifs, règles métier dynamiques

## Énoncé

Construire un configurateur d'ordinateur portable où le prix total se recalcule automatiquement à chaque changement de sélection. L'utilisateur choisit processeur, RAM, stockage, carte graphique et des options supplémentaires (checkboxes). Des configurations pré-définies (Bureautique, Gaming, Créatif) peuvent être chargées en un clic. Le panneau de prix affiche le détail des options et la différence par rapport à la configuration de base.

## Critères d'évaluation

- Réactivité du calcul : `combineLatest` ou signaux pour agréger tous les choix
- Modélisation des options : prix et label portés par les données, pas hardcodés dans le template
- Chargement des configs pré-définies : patcher le formulaire sans tout reconstruire
- Règles de compatibilité : désactivation ou avertissements selon les combinaisons
- Séparation entre la logique de calcul et le composant

<details>
<summary>Indice 1</summary>

Modélise chaque option avec `{ id: string; label: string; price: number }`. Le prix total est alors `selectedOptions.reduce((sum, opt) => sum + opt.price, 0)`. Les configs pré-définies sont juste des objets qui listent les IDs à sélectionner.
</details>

<details>
<summary>Indice 2</summary>

Avec un reactive form, écoute `form.valueChanges.pipe(map(values => this.calculatePrice(values)))` pour recalculer en temps réel. Avec des signaux, utilise `computed(() => this.calculatePrice(this.config()))`.
</details>

<details>
<summary>Indice 3</summary>

Pour charger une config pré-définie : `this.form.patchValue({ cpu: 'i5', ram: '8gb', ... })`. Pour les règles de compatibilité, un simple getter `hasWarning()` qui vérifie les combinaisons incompatibles suffit — pas besoin de validators Angular pour ça.
</details>
