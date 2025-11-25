---
sidebar_position: 3
---

# Cas Pratique : Convertisseur d'Unités

## 🎯 Énoncé

Créer un convertisseur permettant de convertir différentes unités de mesure (température, distance, poids, devises).

**Niveau : Junior / Débutant**

### Fonctionnalités

L'application doit permettre de :
- Choisir le type de conversion (Température, Distance, Poids, Devises)
- Saisir une valeur à convertir
- Sélectionner l'unité de départ
- Sélectionner l'unité d'arrivée
- Afficher le résultat de la conversion en temps réel
- Inverser les unités (swap)

### Types de conversions

#### 1. Température
- Celsius (°C)
- Fahrenheit (°F)
- Kelvin (K)

#### 2. Distance
- Mètres (m)
- Kilomètres (km)
- Miles (mi)
- Pieds (ft)

#### 3. Poids
- Kilogrammes (kg)
- Grammes (g)
- Livres (lb)
- Onces (oz)

#### 4. Devises
- Euro (EUR)
- Dollar américain (USD)
- Livre sterling (GBP)
- Yen japonais (JPY)

### Interface utilisateur

L'interface doit contenir :
- Un sélecteur pour le type de conversion
- Un champ numérique pour la valeur à convertir
- Un sélecteur pour l'unité de départ
- Un bouton pour inverser les unités (⇄)
- Un sélecteur pour l'unité d'arrivée
- Un affichage du résultat

### Formules de conversion

#### Température

**Celsius ↔ Fahrenheit**
```
°F = (°C × 9/5) + 32
°C = (°F - 32) × 5/9
```

**Celsius ↔ Kelvin**
```
K = °C + 273.15
°C = K - 273.15
```

**Fahrenheit ↔ Kelvin**
```
K = (°F - 32) × 5/9 + 273.15
°F = (K - 273.15) × 9/5 + 32
```

#### Distance

**Mètres ↔ Kilomètres**
```
km = m / 1000
m = km × 1000
```

**Mètres ↔ Miles**
```
mi = m / 1609.344
m = mi × 1609.344
```

**Mètres ↔ Pieds**
```
ft = m × 3.28084
m = ft / 3.28084
```

**Kilomètres ↔ Miles**
```
mi = km / 1.609344
km = mi × 1.609344
```

#### Poids

**Kilogrammes ↔ Grammes**
```
g = kg × 1000
kg = g / 1000
```

**Kilogrammes ↔ Livres**
```
lb = kg × 2.20462
kg = lb / 2.20462
```

**Kilogrammes ↔ Onces**
```
oz = kg × 35.274
kg = oz / 35.274
```

**Livres ↔ Onces**
```
oz = lb × 16
lb = oz / 16
```

#### Devises (Taux de change au 2024)

**Conversions depuis EUR**
```
USD = EUR × 1.09
GBP = EUR × 0.86
JPY = EUR × 161.50
```

**Conversions depuis USD**
```
EUR = USD × 0.92
GBP = USD × 0.79
JPY = USD × 148.50
```

**Conversions depuis GBP**
```
EUR = GBP × 1.16
USD = GBP × 1.27
JPY = GBP × 188.00
```

**Conversions depuis JPY**
```
EUR = JPY × 0.0062
USD = JPY × 0.0067
GBP = JPY × 0.0053
```

### Comportement attendu

- La conversion doit se faire en temps réel lors de la saisie
- Si l'unité de départ et d'arrivée sont identiques, afficher la même valeur
- Le bouton d'inversion (⇄) échange l'unité de départ et d'arrivée
- Gérer les nombres décimaux
- Arrondir le résultat à 2 décimales

### Exemple de structure

```
┌─────────────────────────────────────────┐
│  Type: [Température ▼]                  │
├─────────────────────────────────────────┤
│  Valeur: [_______]                      │
│                                         │
│  De:     [Celsius ▼]                    │
│          [    ⇄     ]  (Inverser)       │
│  Vers:   [Fahrenheit ▼]                 │
│                                         │
│  Résultat: XX.XX °F                     │
└─────────────────────────────────────────┘
```

### Note sur les devises

Les taux de change sont fixes dans cet exercice pour simplifier. En conditions réelles, vous utiliseriez une API pour obtenir les taux en temps réel.
