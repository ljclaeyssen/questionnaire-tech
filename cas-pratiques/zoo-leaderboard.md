---
sidebar_position: 2
---

# Cas Pratique : Leaderboard du Zoo

## 🎯 Énoncé

Créer un prototype fonctionnel (qui fonctionne sans backend) permettant de déterminer le meilleur animal du Zoo !

**📥 <a href="/questionnaire-tech/downloads/zoo-images.zip" download>Télécharger les images des animaux (.zip)</a>**

### Fonctionnalités

Chaque animal aura :
- Une photo
- Un nom
- Un score

Le but de ce projet est de faire affronter par le biais d'un **VS** ces animaux de manière aléatoire pour définir le meilleur. C'est à l'utilisateur d'utiliser ses propres critères !

### Pages à créer

#### 1. Page VS
- Affiche les photos de deux animaux
- Permet à l'utilisateur de choisir le meilleur
- Met à jour les scores

#### 2. Page Leaderboard
- Affiche le classement des animaux en fonction de leur score
- Permet de voir tous les animaux triés

### Liste des animaux

```json
{
  "zoo": [
    "ewe",
    "iguana",
    "peccary",
    "sloth",
    "ape",
    "ferret",
    "kangaroo",
    "quagga",
    "starfish",
    "blue_crab",
    "frog",
    "leopard",
    "rat",
    "cheetah",
    "gemsbok",
    "llama",
    "reindeer",
    "dog",
    "ground_hog",
    "moose",
    "silver_fox"
  ]
}
```