---
sidebar_position: 3
---

# Cas Pratique : Formulaire Multi-étapes

## 🎯 Énoncé

Créer un formulaire de réservation de voyage en plusieurs étapes avec navigation et validation progressive.

**Niveau : Confirmé**

### Fonctionnalités

L'application doit permettre de :
- Naviguer entre 4 étapes du formulaire
- Valider chaque étape avant de passer à la suivante
- Revenir aux étapes précédentes
- Conserver les données saisies lors de la navigation
- Afficher un indicateur visuel de progression
- Afficher un récapitulatif final avant validation
- Désactiver le bouton "Suivant" si l'étape actuelle est invalide

### Les 4 étapes

#### Étape 1 : Informations personnelles
- Civilité (M./Mme/Autre) - obligatoire
- Prénom - obligatoire, min 2 caractères
- Nom - obligatoire, min 2 caractères
- Email - obligatoire, format email valide
- Téléphone - obligatoire, format français (10 chiffres)

#### Étape 2 : Destination et dates
- Destination (liste déroulante) - obligatoire
  - Paris, Londres, Rome, Barcelone, Amsterdam, Berlin
- Date de départ - obligatoire, doit être dans le futur
- Date de retour - obligatoire, doit être après la date de départ
- Nombre de voyageurs - obligatoire, entre 1 et 10

#### Étape 3 : Options de voyage
- Type de chambre - obligatoire
  - Standard, Confort, Suite
- Pension (liste déroulante) - obligatoire
  - Petit-déjeuner, Demi-pension, Pension complète
- Assurance annulation (checkbox)
- Commentaires (textarea, optionnel)

#### Étape 4 : Récapitulatif
- Afficher toutes les informations saisies
- Permettre de revenir à n'importe quelle étape pour modifier
- Bouton "Confirmer la réservation"

### Interface utilisateur

L'interface doit contenir :
- Un indicateur de progression (étape actuelle / total)
- Un titre pour chaque étape
- Le formulaire de l'étape courante
- Des boutons de navigation :
  - "Précédent" (désactivé sur la première étape)
  - "Suivant" (désactivé si l'étape est invalide)
  - "Confirmer" (uniquement sur la dernière étape)

### Exemple de structure

```
┌─────────────────────────────────────────────┐
│  Réservation de voyage                      │
├─────────────────────────────────────────────┤
│  [●━━━━━○━━━━━○━━━━━○] Étape 1/4          │
│                                             │
│  Informations personnelles                  │
│                                             │
│  Civilité: [M. ▼]                          │
│  Prénom:   [_____________]                  │
│  Nom:      [_____________]                  │
│  Email:    [_____________]                  │
│  Téléphone:[_____________]                  │
│                                             │
│  [Précédent]              [Suivant]         │
└─────────────────────────────────────────────┘
```

### Comportement attendu

- Ne pas pouvoir passer à l'étape suivante si l'étape courante est invalide
- Pouvoir revenir aux étapes précédentes à tout moment
- Les données saisies doivent être conservées lors de la navigation
- Sur le récapitulatif, afficher toutes les informations de manière claire
- Après validation finale, afficher un message de confirmation et réinitialiser le formulaire