---
sidebar_position: 4
---

# Cas Pratique : Formulaire d'Inscription

## 🎯 Énoncé

Créer un formulaire d'inscription utilisateur avec validation des données et gestion d'erreurs.

**Niveau : Junior / Intermédiaire**

### Fonctionnalités

Le formulaire doit contenir les champs suivants :
- Nom (obligatoire, minimum 2 caractères)
- Prénom (obligatoire, minimum 2 caractères)
- Email (obligatoire, format email valide)
- Mot de passe (obligatoire, minimum 8 caractères, doit contenir au moins 1 majuscule, 1 minuscule, 1 chiffre)
- Confirmation du mot de passe (obligatoire, doit correspondre au mot de passe)
- Date de naissance (obligatoire, l'utilisateur doit avoir au moins 18 ans)
- Acceptation des conditions générales (checkbox, obligatoire)

### Validation

Le formulaire doit :
- Valider les champs en temps réel (après la première tentative de soumission ou après avoir quitté le champ)
- Afficher des messages d'erreur clairs pour chaque champ invalide
- Désactiver le bouton de soumission si le formulaire est invalide
- Afficher un message de succès après une soumission réussie

### Messages d'erreur attendus

- **Nom/Prénom** : "Ce champ est obligatoire" ou "Minimum 2 caractères requis"
- **Email** : "Ce champ est obligatoire" ou "Format d'email invalide"
- **Mot de passe** : "Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 minuscule et 1 chiffre"
- **Confirmation** : "Les mots de passe ne correspondent pas"
- **Date de naissance** : "Vous devez avoir au moins 18 ans"
- **CGU** : "Vous devez accepter les conditions générales"

