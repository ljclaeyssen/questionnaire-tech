---
sidebar_position: 1
---

# Formulaire d'Inscription

**Niveau** : Confirmé
**Durée** : 45 min
**Concepts évalués** : Reactive Forms, validators custom, validation cross-field

## Énoncé

Construire un formulaire d'inscription avec les champs : nom, prénom, email, mot de passe, confirmation du mot de passe, date de naissance et acceptation des CGU. Chaque champ a ses propres règles de validation. Le mot de passe doit respecter une politique de complexité. La date de naissance doit garantir que l'utilisateur a au moins 18 ans. La confirmation de mot de passe est une validation cross-field au niveau du groupe.

## Critères d'évaluation

- Structure du `FormGroup` et typage des contrôles
- Écriture de validators custom (`ValidatorFn` et `AbstractControl`)
- Validation cross-field : placement sur le groupe ou sur le champ de confirmation
- Affichage conditionnel des erreurs (touched, dirty, submitted)
- Désactivation du bouton submit sur état invalide

<details>
<summary>Indice 1</summary>

Un validator custom est une simple fonction `(control: AbstractControl): ValidationErrors | null`. Pour la date de naissance, compare `new Date()` à la date saisie en soustrayant 18 ans.
</details>

<details>
<summary>Indice 2</summary>

La validation cross-field (mots de passe identiques) se pose sur le `FormGroup`, pas sur le `FormControl`. Elle reçoit le groupe en paramètre et peut accéder aux deux contrôles via `group.get('password')`.
</details>

<details>
<summary>Indice 3</summary>

Pour afficher les erreurs proprement : `control.invalid && (control.dirty || control.touched)`. Pour les erreurs cross-field portées sur le groupe, tu peux les lire depuis le template via `form.errors?.['passwordMismatch']`.
</details>
