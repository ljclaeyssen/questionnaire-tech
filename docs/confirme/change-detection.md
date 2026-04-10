---
sidebar_position: 8
---

# Change Detection

## Comment fonctionne la change detection ?
> Angular parcourt l'arbre de composants de haut en bas et vérifie si les bindings template ont changé. Par défaut (Default strategy), TOUS les composants sont vérifiés à chaque événement.

```typescript
@Component({
  template: `{{ user.name }}`, // Angular vérifie si cette valeur a changé
})
export class UserComponent {
  user = { name: 'Alice' };
}
```

**Piège entretien :** "Angular utilise le dirty-checking" — à chaque cycle, il compare la valeur actuelle avec la précédente pour chaque binding. Ce n'est pas de la mutation tracking.

---

## Default vs OnPush ?
> Default : vérifie tout le sous-arbre à chaque event. OnPush : vérifie seulement si un `@Input` change de référence, un event DOM est émis depuis le composant, ou un Observable (async pipe) émet.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ user().name }}`,
})
export class UserCardComponent {
  user = input.required<User>();
}
```

**Piège entretien :** Avec `OnPush`, muter un objet sans changer sa référence (`user.name = 'Bob'`) ne déclenche PAS de re-render. Il faut créer un nouvel objet : `{ ...user, name: 'Bob' }`.

---

## Quand la change detection se déclenche ?
> C'est Zone.js qui intercepte les sources d'asynchronisme et déclenche un cycle de change detection après chaque event.

| Source | Déclenche CD |
|---|---|
| Event DOM (click, input) | Oui |
| `setTimeout` / `setInterval` | Oui |
| Requête HTTP | Oui |
| Promise resolved | Oui |
| Observable + `async` pipe | Oui |

**Piège entretien :** `setTimeout` dans un test déclenche de la CD alors qu'on ne s'y attend pas — c'est pourquoi on utilise `fakeAsync` + `tick()` dans les tests Angular.

---

## C'est quoi le zoneless ?
> Angular sans Zone.js. La change detection est pilotée uniquement par les Signals. Expérimental depuis Angular 18, developer preview depuis Angular 19.

```typescript
// main.ts
bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
});

// Composant zoneless : les signals pilotent le re-render
@Component({ template: `{{ count() }}` })
export class CounterComponent {
  count = signal(0);
  increment() { this.count.update(c => c + 1); }
}
```

**Piège entretien :** En zoneless, une variable classique (`this.count++`) ne déclenche PAS de re-render. Seuls les Signals, les Observables via `async` pipe, et `markForCheck()` déclenchent une mise à jour.

---

## markForCheck() vs detectChanges() ?
> `markForCheck()` marque le composant et ses ancêtres pour la prochaine CD (safe, non-bloquant). `detectChanges()` force la CD immédiatement (synchrone, à éviter).

```typescript
// Cas légitime de markForCheck() : données reçues hors zone
constructor(private cd: ChangeDetectorRef) {}

ngOnInit() {
  this.externalLib.onUpdate((data) => {
    this.data = data;
    this.cd.markForCheck(); // Angular reprendra la main au prochain cycle
  });
}
```

**Piège entretien :** Si tu as besoin de `detectChanges()`, c'est probablement un signal d'alarme architectural. La bonne réponse : passer à `OnPush` + Signals, et laisser Angular gérer le timing.
