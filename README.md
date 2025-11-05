# Questionnaire Tech Angular

Un site Docusaurus regroupant des questions d'entretien technique Angular, des exercices de code et des code reviews, organisés par niveau (Junior, Confirmé, Senior).

## 🚀 Accès au site

Une fois déployé, le site sera accessible à : **https://ljclaeyssen.github.io/questionnaire-tech/**

## 📚 Contenu

### Junior (0-2 ans d'expérience)
- Les fondamentaux d'Angular
- Composants et templates
- Data binding et directives
- Services et Dependency Injection
- TypeScript de base

### Confirmé (2-5 ans d'expérience)
- RxJS et programmation réactive
- Formulaires réactifs
- Routing avancé et lazy loading
- HTTP et API
- State management

### Senior (5+ ans d'expérience)
- Architecture et design patterns
- Performance et optimisation
- Testing avancé
- Sécurité
- Standalone components et nouvelles fonctionnalités
- Tooling et DevOps

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/ljclaeyssen/questionnaire-tech.git
cd questionnaire-tech

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le site sera accessible à http://localhost:3000

## 📦 Build

```bash
# Build de production
npm run build

# Tester le build localement
npm run serve
```

## 🚢 Déploiement

Le site se déploie automatiquement sur GitHub Pages via GitHub Actions à chaque push sur la branche `master`.

Pour plus de détails, consultez [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📝 Ajouter du contenu

### Structure des fichiers

```
docs/
├── intro.md              # Page d'accueil
├── junior/
│   ├── _category_.json
│   ├── intro.md
│   └── composants-bases.md
├── confirme/
│   ├── _category_.json
│   ├── intro.md
│   └── rxjs-operators.md
└── senior/
    ├── _category_.json
    ├── intro.md
    └── architecture-modulaire.md
```

### Créer une nouvelle page

1. Créez un fichier Markdown dans le dossier approprié (`junior/`, `confirme/`, ou `senior/`)
2. Ajoutez le front matter :

```markdown
---
sidebar_position: 2
---

# Titre de votre page

Contenu...
```

3. Le fichier apparaîtra automatiquement dans la sidebar

### Format recommandé pour les questions

```markdown
## Question : [Votre question]

### Réponse

[Explication détaillée]

### Exemple de code

\`\`\`typescript
// Votre code ici
\`\`\`

## Exercice pratique

### Énoncé
[Description de l'exercice]

### Solution
[Code de la solution]

## Points clés à retenir

- Point 1
- Point 2
- Point 3
```

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-question`)
3. Commit vos changements (`git commit -m 'Ajout d'une question sur les pipes'`)
4. Push vers la branche (`git push origin feature/nouvelle-question`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est open source.

## 🔗 Ressources

- [Documentation Angular](https://angular.dev)
- [Documentation Docusaurus](https://docusaurus.io)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/)

## 👨‍💻 Auteur

[@ljclaeyssen](https://github.com/ljclaeyssen)
