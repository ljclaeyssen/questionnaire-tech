---
sidebar_position: 3
---

# Formulaire Multi-étapes

**Niveau** : Confirmé
**Durée** : 45 min
**Concepts évalués** : stepper/wizard, FormGroup composé, validation progressive, routing ou state

## Énoncé

Construire un formulaire de réservation de voyage en 4 étapes : informations personnelles, destination et dates, options de voyage, récapitulatif. On ne peut passer à l'étape suivante que si l'étape courante est valide. Les données sont conservées lors de la navigation entre étapes. Le récapitulatif final affiche toutes les informations saisies.

## Critères d'évaluation

- Modélisation du formulaire : un `FormGroup` global avec des sous-groupes par étape ou des `FormGroup` indépendants
- Validation progressive : seule l'étape active est validée avant de passer à la suivante
- Persistance des données entre les étapes (pas de reset involontaire)
- Indicateur de progression clair
- Gestion du récapitulatif : lecture seule depuis les valeurs du formulaire

<details>
<summary>Indice 1</summary>

Deux approches valides : un `FormGroup` global avec des sous-groupes par étape (`step1: FormGroup`, `step2: FormGroup`, etc.) ou des `FormGroup` indépendants gérés dans un service. La première est plus simple pour débuter.
</details>

<details>
<summary>Indice 2</summary>

Pour valider uniquement l'étape courante avant de passer à la suivante : `if (this.currentStepForm.valid) { this.currentStep++; }`. Affiche les erreurs sur `markAllAsTouched()` si le candidat clique "Suivant" sans remplir les champs.
</details>

<details>
<summary>Indice 3</summary>

Le récapitulatif (étape 4) lit simplement `this.form.value` ou les valeurs de chaque sous-groupe. Pas besoin de stocker les données ailleurs — elles sont déjà dans le formulaire tant qu'on ne le réinitialise pas.
</details>
