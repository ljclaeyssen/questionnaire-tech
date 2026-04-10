---
sidebar_position: 2
---

# Zoo Leaderboard

**Niveau** : Confirmé
**Durée** : 45 min
**Concepts évalués** : routing, services, state management, composants multiples

## Énoncé

Construire un prototype fonctionnel (sans backend) de tournoi animalier. Deux animaux s'affrontent en VS — l'utilisateur vote pour le meilleur. Les scores se mettent à jour et un leaderboard classe les animaux par score. L'application comporte deux pages : la page VS et le classement.

**📥 <a href="/questionnaire-tech/downloads/zoo-images.zip" download>Télécharger les images des animaux (.zip)</a>**

```json
["ewe", "iguana", "peccary", "sloth", "ape", "ferret", "kangaroo", "quagga",
 "starfish", "blue_crab", "frog", "leopard", "rat", "cheetah", "gemsbok",
 "llama", "reindeer", "dog", "ground_hog", "moose", "silver_fox"]
```

## Critères d'évaluation

- Architecture service : le state (scores, animaux) est dans un service partagé, pas dans les composants
- Routing Angular entre la page VS et le leaderboard
- Tirage aléatoire des deux adversaires sans répétition
- Tri réactif du leaderboard après chaque vote
- Composants bien découpés (carte animal, page VS, page leaderboard)

<details>
<summary>Indice 1</summary>

Crée un `ZooService` qui maintient la liste des animaux avec leurs scores. Les deux composants (VS et Leaderboard) l'injectent — c'est le service qui fait autorité, pas le composant.
</details>

<details>
<summary>Indice 2</summary>

Pour tirer deux adversaires aléatoires distincts : mélange le tableau avec Fisher-Yates (ou `sort(() => Math.random() - 0.5)`) et prends les deux premiers. Appelle cette fonction à chaque vote pour préparer le prochain match.
</details>

<details>
<summary>Indice 3</summary>

Le leaderboard est simplement `animals.sort((a, b) => b.score - a.score)`. Si tu utilises des signaux Angular, expose un `computed(() => [...this.animals()].sort(...))` pour que le template se mette à jour automatiquement.
</details>
