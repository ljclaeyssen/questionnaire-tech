---
sidebar_position: 2
---

# Angular CLI - L'outil indispensable

## Qu'est-ce que l'Angular CLI ?

L'**Angular CLI** (Command Line Interface) est l'outil officiel pour créer, développer et builder des applications Angular. C'est votre meilleur ami pour gagner du temps !

## Commandes de base

### 1. ng new - Créer un nouveau projet

```bash
ng new mon-projet
```

**Options importantes :**
- `--routing` : Ajoute le routing Angular
- `--style=scss|css|less|sass` : Choisir le préprocesseur CSS
- `--skip-git` : Ne pas initialiser Git
- `--skip-install` : Ne pas installer les dépendances automatiquement

### 2. ng serve - Lancer le serveur de développement

```bash
# Lancer le serveur (par défaut sur http://localhost:4200)
ng serve

# Avec options
ng serve --open              # Ouvre automatiquement le navigateur
ng serve --port 4300         # Changer le port
```

**Options importantes :**
- `--open` : Ouvre automatiquement le navigateur
- `--port` : Changer le port

### 3. ng build - Builder pour la production

```bash
ng build
```

**Options importantes :**
- `--configuration` : Build de développement

### 4. ng test - Lancer les tests

```bash
ng test
```

## ng generate - Générer du code

La commande `ng generate` (ou `ng g`) est la plus utilisée au quotidien. Elle génère automatiquement des composants, services, pipes, etc.


| Commande | Raccourci | Génère | Exemple |
|----------|-----------|--------|---------|
| `ng g component` | `ng g c` | Composant | `ng g c user-card` |
| `ng g service` | `ng g s` | Service | `ng g s user` |
| `ng g directive` | `ng g d` | Directive | `ng g d highlight` |
| `ng g pipe` | `ng g p` | Pipe | `ng g p truncate` |
| `ng g guard` | `ng g g` | Guard | `ng g g auth` |
| `ng g interceptor` | - | Interceptor | `ng g interceptor auth` |
| `ng g interface` | `ng g i` | Interface | `ng g i user` |
| `ng g enum` | `ng g e` | Enum | `ng g e role` |
| `ng g class` | `ng g cl` | Classe | `ng g cl utils/helper` |

**Options utiles :**
- `--skip-tests` : Ne pas générer le fichier de test
- `--inline-template` ou `-t` : Template inline
- `--inline-style` ou `-s` : Style inline
- `--style=scss|css|less` : Type de fichier de style
- `--flat` : Ne pas créer de dossier
- `--export` : Exporter le composant (si dans un module)

