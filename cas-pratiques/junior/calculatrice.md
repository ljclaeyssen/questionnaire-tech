---
sidebar_position: 1
---

# Cas Pratique : Calculatrice Simple

## 🎯 Énoncé

Créer une calculatrice simple permettant d'effectuer les opérations de base.

**Niveau : Junior / Débutant**

### Fonctionnalités

La calculatrice doit permettre de :
- Effectuer les 4 opérations de base : addition (+), soustraction (-), multiplication (×), division (÷)
- Afficher le résultat en temps réel
- Gérer les nombres décimaux
- Inclure un bouton pour effacer (Clear)
- Gérer les erreurs (division par zéro, etc.)

### Interface utilisateur

L'interface doit contenir :
- Un affichage pour les nombres et le résultat
- Des boutons pour les chiffres de 0 à 9
- Des boutons pour les opérations (+, -, ×, ÷)
- Un bouton égal (=) pour calculer le résultat
- Un bouton Clear (C) pour réinitialiser
- Un bouton pour le point décimal (.)

### Exemple de design

```
┌─────────────────────────┐
│      [Affichage]        │
├─────────────────────────┤
│  7  │  8  │  9  │  ÷   │
├─────────────────────────┤
│  4  │  5  │  6  │  ×   │
├─────────────────────────┤
│  1  │  2  │  3  │  -   │
├─────────────────────────┤
│  0  │  .  │  =  │  +   │
├─────────────────────────┤
│        Clear (C)        │
└─────────────────────────┘
```
