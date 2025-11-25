---
sidebar_position: 4
---

# Cas Pratique : Configurateur de Produit avec Calcul de Prix

## 🎯 Énoncé

Créer un configurateur de produit (ordinateur portable) où le prix se met à jour automatiquement en fonction des options sélectionnées.

**Niveau : Confirmé**

### Fonctionnalités

L'application doit permettre de :
- Sélectionner différentes options de configuration
- Calculer et afficher le prix total en temps réel
- Afficher un récapitulatif des options choisies
- Afficher la différence de prix par rapport à la configuration de base
- Désactiver certaines options incompatibles selon les choix
- Proposer des configurations pré-définies (Gaming, Bureautique, Créatif)

### Options de configuration

#### Processeur (obligatoire)
- Intel i5 - 600€ (base)
- Intel i7 - 900€ (+300€)
- Intel i9 - 1400€ (+800€)
- AMD Ryzen 7 - 850€ (+250€)
- AMD Ryzen 9 - 1300€ (+700€)

#### Mémoire RAM (obligatoire)
- 8 GB - 80€ (base)
- 16 GB - 160€ (+80€)
- 32 GB - 320€ (+240€)
- 64 GB - 640€ (+560€)

#### Stockage (obligatoire)
- SSD 256 GB - 60€ (base)
- SSD 512 GB - 120€ (+60€)
- SSD 1 TB - 240€ (+180€)
- SSD 2 TB - 480€ (+420€)

#### Carte graphique (optionnelle)
- Aucune - 0€ (base)
- NVIDIA GTX 1650 - 300€
- NVIDIA RTX 3060 - 600€
- NVIDIA RTX 4070 - 1200€

#### Options supplémentaires (checkboxes)
- Clavier rétroéclairé - 50€
- Webcam HD - 80€
- Lecteur d'empreintes - 40€
- Garantie étendue 3 ans - 200€
- Office 365 (1 an) - 100€

### Configurations pré-définies

#### Bureautique
- Intel i5, 8 GB RAM, SSD 256 GB, Aucune carte graphique
- Prix : 740€

#### Gaming
- AMD Ryzen 9, 32 GB RAM, SSD 1 TB, RTX 4070, Clavier rétroéclairé
- Prix : 3010€

#### Créatif
- Intel i9, 64 GB RAM, SSD 2 TB, RTX 4070
- Prix : 3760€

### Interface utilisateur

L'interface doit contenir :
- Des sélecteurs pour chaque catégorie d'option
- Des checkboxes pour les options supplémentaires
- Un panneau de prix en temps réel :
  - Prix de base
  - Liste des options avec leurs prix
  - Prix total TTC
  - Économie ou surcoût par rapport à la base
- Des boutons pour charger les configurations pré-définies
- Un récapitulatif de la configuration

### Exemple de structure

```
┌─────────────────────────────────────────────┐
│  Configurateur PC                           │
├──────────────────────┬──────────────────────┤
│  Configuration       │  Récapitulatif Prix  │
│                      │                      │
│  Processeur:         │  Prix de base: 740€  │
│  [Intel i7 ▼]       │                      │
│                      │  Options:            │
│  RAM:                │  + i7 Proc.   +300€  │
│  [16 GB ▼]          │  + 16GB RAM   +80€   │
│                      │  + 512GB SSD  +60€   │
│  Stockage:           │                      │
│  [512 GB ▼]         │  ───────────────────  │
│                      │  Total:      1180€   │
│  Carte graphique:    │  Surcoût:    +440€   │
│  [RTX 3060 ▼]       │                      │
│                      │                      │
│  Options:            │                      │
│  ☑ Clavier LED       │                      │
│  ☐ Webcam HD         │                      │
│                      │                      │
│  [Bureautique]       │                      │
│  [Gaming]            │                      │
│  [Créatif]           │                      │
└──────────────────────┴──────────────────────┘
```

### Comportement attendu

- Le prix doit se mettre à jour **automatiquement** à chaque changement
- Afficher le détail du calcul (prix de base + options)
- Calculer et afficher la différence par rapport à la configuration de base
- Les configurations pré-définies chargent instantanément les bonnes options
- Le prix total inclut toutes les options sélectionnées

### Règles de compatibilité (Bonus)

- Si "Aucune carte graphique", désactiver la config "Gaming"
- Si RAM < 16GB, afficher un avertissement pour les configs "Gaming" et "Créatif"
- Si processeur i5 et carte graphique RTX 4070, afficher un avertissement de bottleneck