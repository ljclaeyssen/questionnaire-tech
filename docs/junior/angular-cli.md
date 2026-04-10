---
sidebar_position: 2
---

# Angular CLI

## Comment créer un nouveau projet Angular ?

> `ng new mon-projet` génère la structure complète avec config TypeScript, tests et optionnellement le routing.

```bash
ng new mon-projet --routing --style=scss
```

**Piège entretien :** Mentionner `--routing` et `--style` montre qu'on sait paramétrer dès le départ. Sans `--routing`, il faut l'ajouter manuellement ensuite.

---

## Quelle commande pour lancer le projet en développement ?

> `ng serve` démarre un serveur local avec hot-reload sur `http://localhost:4200`.

```bash
ng serve --open       # ouvre le navigateur automatiquement
ng serve --port 4300  # change le port
```

**Piège entretien :** Ne pas confondre `ng serve` (dev, pas de build sur disque) et `ng build` (génère les fichiers dans `/dist`).

---

## Différence entre `ng serve` et `ng build` ?

> `ng serve` : serveur de dev en mémoire, rebuild à chaud, pas de fichiers générés. `ng build` : compile et écrit les fichiers dans `dist/` pour le déploiement.

```bash
ng build                            # production par défaut (depuis Angular 12)
ng build --configuration=development  # build dev (sans optimisations)
```

**Piège entretien :** `ng build` est en mode production par défaut — tree-shaking, minification et AOT sont activés. `ng serve` n'est jamais utilisé pour servir une appli en production.

---

## Quelles sont les commandes `ng generate` les plus utilisées ?

> `ng generate` (alias `ng g`) crée automatiquement les fichiers avec le bon boilerplate et les bonnes conventions de nommage.

| Commande | Raccourci | Génère |
|----------|-----------|--------|
| `ng g component user-card` | `ng g c` | Composant |
| `ng g service user` | `ng g s` | Service |
| `ng g directive highlight` | `ng g d` | Directive |
| `ng g pipe truncate` | `ng g p` | Pipe |
| `ng g guard auth` | `ng g g` | Guard |
| `ng g interceptor auth` | - | Interceptor |
| `ng g interface user` | `ng g i` | Interface |

**Piège entretien :** Connaître les raccourcis (`ng g c`, `ng g s`) est un signal de pratique quotidienne. Mentionner `--skip-tests` et `--flat` pour les options les plus utiles.

---

## Options utiles de `ng generate component` ?

> Permettent de personnaliser les fichiers générés sans modifier la config globale.

```bash
ng g c user-card --skip-tests    # pas de .spec.ts
ng g c user-card --inline-template -s  # template et style dans le .ts
ng g c user-card --flat          # pas de sous-dossier
```

**Piège entretien :** `--flat` est utile pour les petits composants utilitaires. `--inline-template` est rarement utilisé en production mais peut être attendu en réponse sur les options.
