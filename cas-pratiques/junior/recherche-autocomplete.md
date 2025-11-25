---
sidebar_position: 4
---

# Cas Pratique : Recherche avec Autocomplete

## 🎯 Énoncé

Créer une barre de recherche intelligente avec suggestions automatiques utilisant RxJS.

**Niveau : Junior / Débutant**

### Fonctionnalités

L'application doit permettre de :
- Saisir du texte dans un champ de recherche
- Afficher automatiquement les résultats correspondants pendant la saisie
- Attendre que l'utilisateur arrête de taper avant de filtrer (debounce)
- Ignorer les recherches de moins de 2 caractères
- Afficher "Aucun résultat" si la recherche ne retourne rien
- Afficher le nombre de résultats trouvés

### Liste de données

Utiliser cette liste de pays pour la recherche :

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

### Comportement attendu

- Attendre **300ms** après la dernière frappe avant de filtrer
- Ne rechercher que si **au moins 2 caractères** sont saisis
- La recherche doit être **insensible à la casse**
- Si le champ est vidé, afficher tous les pays
- Afficher un message "Tapez au moins 2 caractères" si moins de 2 caractères
- Mettre en évidence le texte recherché dans les résultats (bonus)

### Interface utilisateur

L'interface doit contenir :
- Un champ de recherche (input)
- Un compteur : "X résultat(s) trouvé(s)"
- Une liste des résultats correspondants
- Un message d'information selon l'état (pas assez de caractères, aucun résultat, etc.)

### Exemple de structure

```
┌─────────────────────────────────────┐
│  Recherche: [fra_______]  🔍        │
├─────────────────────────────────────┤
│  3 résultat(s) trouvé(s)            │
├─────────────────────────────────────┤
│  • France                           │
│  • Afrique du Sud                   │
│  • République tchèque               │
└─────────────────────────────────────┘
```