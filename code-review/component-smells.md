---
sidebar_position: 3
---

# Code Review : UserProfileComponent

Identifiez les problèmes dans le code suivant.

```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { PostService } from './post.service';

@Component({
  selector: 'app-user-profile',
  template: `
    <div *ngIf="user">
      <h1>{{ user.firstName }} {{ user.lastName }}</h1>
      <p>Score: {{ user.posts.length > 0 ? (user.posts.reduce((acc, p) => acc + p.likes, 0) / user.posts.length).toFixed(2) : 0 }}</p>
      <p>Top posts: {{ user.posts.filter(p => p.likes > 100).length }}</p>
      <ul>
        <li *ngFor="let post of posts">{{ post.title }}</li>
      </ul>
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  user: any;
  posts: any[] = [];

  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {}

  ngOnInit() {
    this.userService.getUser(42).subscribe(user => {
      this.user = user;

      this.postService.getPostsByUser(user.id).subscribe(posts => {
        this.posts = posts;
      });
    });

    this.userService.getUserStats(42).subscribe(stats => {
      console.log('Stats loaded', stats);
    });
  }
}
```

<details>
<summary>Voir l'analyse</summary>

| # | Problème | Sévérité | Ligne |
|---|----------|----------|-------|
| 1 | `subscribe()` sans `unsubscribe` dans `ngOnInit` | Critique | ~32, ~39 |
| 2 | Subscribe imbriqué (`subscribe` dans un `subscribe`) | Critique | ~34 |
| 3 | Logique métier complexe dans le template | Important | ~13–14 |
| 4 | Pas de `ChangeDetectionStrategy.OnPush` | Moyen | ~7 |
| 5 | Injection par constructeur au lieu de `inject()` | Mineur | ~27–30 |
| 6 | Services injectés sans `readonly` | Mineur | ~27–28 |

### 1. `subscribe()` sans `unsubscribe`
**Pourquoi c'est un problème :**
Les observables de `ngOnInit` ne sont jamais résiliés. Si le composant est détruit (navigation, `*ngIf`), les callbacks continuent de s'exécuter, provoquant des memory leaks et potentiellement des erreurs sur des vues détruites.

**Fix :**
```typescript
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class UserProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.userService.getUser(42)
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => { this.user = user; });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### 2. Subscribe imbriqué
**Pourquoi c'est un problème :**
Imbriquer un `subscribe` dans un autre crée une chaîne fragile et non annulable. Si le premier observable émet plusieurs fois, on accumule des souscriptions fantômes. C'est le signe qu'on devrait utiliser `switchMap` ou `concatMap`.

**Fix :**
```typescript
import { switchMap } from 'rxjs/operators';

this.userService.getUser(42).pipe(
  takeUntil(this.destroy$),
  switchMap(user => {
    this.user = user;
    return this.postService.getPostsByUser(user.id);
  })
).subscribe(posts => {
  this.posts = posts;
});
```

### 3. Logique métier dans le template
**Pourquoi c'est un problème :**
Des appels à `reduce`, `filter` et `toFixed` directement dans le HTML sont recalculés à chaque cycle de détection de changements. C'est illisible, non testable, et potentiellement coûteux en performance.

**Fix :**
```typescript
// Dans le composant
get averageLikes(): string {
  if (!this.user?.posts?.length) return '0';
  const total = this.user.posts.reduce((acc: number, p: any) => acc + p.likes, 0);
  return (total / this.user.posts.length).toFixed(2);
}

get topPostsCount(): number {
  return this.user?.posts?.filter((p: any) => p.likes > 100).length ?? 0;
}
```
```html
<p>Score: {{ averageLikes }}</p>
<p>Top posts: {{ topPostsCount }}</p>
```

### 4. Pas de `ChangeDetectionStrategy.OnPush`
**Pourquoi c'est un problème :**
Sans `OnPush`, Angular vérifie le composant à chaque événement de l'application, même sans rapport. Pour un composant qui ne reçoit ses données que via des observables, `OnPush` est à la fois plus performant et plus explicite sur les sources de changement.

**Fix :**
```typescript
@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
```

### 5. Injection par constructeur au lieu de `inject()`
**Pourquoi c'est un problème :**
La fonction `inject()` est l'approche moderne et recommandée depuis Angular 14+. Elle rend les dépendances plus explicites, fonctionne dans les guards/resolvers fonctionnels, et évite le boilerplate du constructeur.

**Fix :**
```typescript
import { inject } from '@angular/core';

export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private postService = inject(PostService);

  // Plus besoin de constructeur
}
```

### 6. Services injectés sans `readonly`
**Pourquoi c'est un problème :**
Un service injecté ne devrait jamais être réassigné. Sans `readonly`, rien n'empêche un développeur de remplacer accidentellement `this.userService = ...` dans le corps de la classe. C'est un guard-rail simple à mettre en place.

**Fix :**
```typescript
constructor(
  private readonly userService: UserService,
  private readonly postService: PostService,
) {}
```

</details>
