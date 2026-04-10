---
sidebar_position: 6
---

# Lifecycle Hooks

## Quels sont les principaux lifecycle hooks ?

> Angular exécute des hooks à chaque étape de la vie d'un composant. Les 4 incontournables sont ngOnInit, ngOnChanges, ngAfterViewInit et ngOnDestroy.

| Hook | Quand | Cas d'usage |
|---|---|---|
| `ngOnChanges` | À chaque changement d'@Input | Réagir aux nouvelles valeurs reçues |
| `ngOnInit` | Une fois, après le premier ngOnChanges | Initialisation, appels HTTP |
| `ngAfterViewInit` | Après le rendu du template | Accès aux @ViewChild |
| `ngOnDestroy` | Juste avant la destruction | Cleanup, unsubscribe |

**Piège entretien :** ngOnChanges se déclenche AVANT ngOnInit — et peut s'exécuter plusieurs fois si les inputs changent.

---

## Quel est l'ordre d'exécution des hooks ?

> L'ordre est strict et déterministe. Voici la séquence complète :

| # | Hook | Quand | Fréquence |
|---|------|-------|-----------|
| 1 | `constructor` | Injection de dépendances | 1 fois |
| 2 | `ngOnChanges` | Input reçu/modifié | N fois (avant chaque ngOnInit aussi) |
| 3 | `ngOnInit` | Composant initialisé | 1 fois |
| 4 | `ngDoCheck` | Chaque cycle de change detection | N fois |
| 5 | `ngAfterContentInit` | Contenu projeté (`<ng-content>`) prêt | 1 fois |
| 6 | `ngAfterContentChecked` | Après chaque vérification du contenu projeté | N fois |
| 7 | `ngAfterViewInit` | Vue (template + enfants) rendue | 1 fois |
| 8 | `ngAfterViewChecked` | Après chaque vérification de la vue | N fois |
| 9 | `ngOnDestroy` | Juste avant la destruction | 1 fois |

**Piège entretien :** ngOnChanges ne s'exécute pas si le composant n'a pas d'@Input. Les hooks "Checked" (4, 6, 8) tournent à chaque cycle de CD — ne jamais y mettre de logique lourde.

---

## ngOnInit vs constructor ?

> Le constructor sert uniquement à l'injection de dépendances. ngOnInit s'exécute quand le composant est complètement initialisé avec ses inputs disponibles.

```typescript
constructor(private http: HttpClient) {
  // OK : injection
  // JAMAIS : this.http.get(...)
}

ngOnInit() {
  // OK : les @Input sont disponibles ici
  this.http.get('/api/data').subscribe(...);
}
```

**Piège entretien :** appeler un service HTTP dans le constructor est une erreur classique — les @Input ne sont pas encore valorisés à ce stade.

---

## Comment nettoyer à la destruction ?

> ngOnDestroy permet de libérer les ressources (unsubscribe, clearInterval…). En Angular moderne, préférer takeUntilDestroyed ou l'async pipe qui gèrent ça automatiquement.

```typescript
// Approche moderne (Angular 16+)
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MyComponent {
  constructor() {
    this.svc.data$
      .pipe(takeUntilDestroyed()) // se désinscrit tout seul
      .subscribe(data => this.data = data);
  }
}
```

**Piège entretien :** oublier de se désinscrire d'un Observable infini (timer, websocket) provoque une memory leak même après destruction du composant.

---

## Et les hooks modernes ?

> `afterNextRender()` et `afterRender()` (Angular 17+) remplacent `ngAfterViewInit` pour les interactions DOM. `afterNextRender()` s'exécute une seule fois, `afterRender()` après chaque rendu. En Angular 19, `afterRenderEffect()` les complète pour les cas réactifs signal-based.

```typescript
import { afterNextRender } from '@angular/core';

export class MyComponent {
  constructor() {
    afterNextRender(() => {
      // DOM disponible, exécuté une seule fois
      this.chart = new Chart(this.canvas.nativeElement);
    });
  }
}
```

**Piège entretien :** Ces hooks ne s'exécutent pas côté serveur (SSR). `afterRenderEffect()` (Angular 19+) est préférable quand la logique dépend de signals — il track automatiquement les dépendances.
