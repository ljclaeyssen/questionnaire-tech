---
sidebar_position: 3
---

# Code Review : TodoService

Identifiez les problèmes dans le code suivant.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from './logger.service';

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  public todos: any[] = [];
  public todos$ = new BehaviorSubject<any[]>([]);

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) {}

  loadTodos() {
    this.http.get<any>('/api/todos').subscribe(response => {
      let result: any[] = [];
      response.forEach((item: any) => {
        result.push({ ...item, label: item.title.toUpperCase() });
      });
      this.todos = result;
      this.todos$.next(result);
      this.logger.log('Todos loaded');
    });
  }

  addTodo(title: string) {
    this.http.post<any>('/api/todos', { title, done: false }).subscribe(todo => {
      this.todos.push(todo);
      this.todos$.next(this.todos);
    });
  }

  deleteTodo(id: number) {
    this.http.delete(`/api/todos/${id}`).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== id);
      this.todos$.next(this.todos);
    });
  }
}
```

<details>
<summary>Voir l'analyse</summary>

| # | Problème | Sévérité | Ligne |
|---|----------|----------|-------|
| 1 | État mutable `todos` exposé publiquement | Critique | ~17 |
| 2 | Pas de gestion d'erreur sur les appels HTTP | Important | ~26, ~38, ~44 |
| 3 | `BehaviorSubject` exposé directement (sans `.asObservable()`) | Important | ~18 |
| 4 | `subscribe` + boucle pour transformer des données au lieu de `pipe`/`map` | Moyen | ~26–34 |
| 5 | Couplage fort avec `LoggerService` concret | Moyen | ~23 |
| 6 | `any` utilisé partout à la place de types précis | Mineur | ~17–18, ~26, ~38, ~44 |

### 1. État mutable `todos` exposé publiquement
**Pourquoi c'est un problème :**
N'importe quel composant peut faire `todoService.todos.push(...)` en dehors du service, contournant toute logique centralisée. Le `BehaviorSubject` devient alors désynchronisé, et le state devient ingérable dès qu'on a plusieurs consommateurs.

**Fix :**
```typescript
private _todos: Todo[] = [];

get todos(): ReadonlyArray<Todo> {
  return this._todos;
}
```

### 2. Pas de gestion d'erreur sur les appels HTTP
**Pourquoi c'est un problème :**
Si le serveur retourne une 404 ou 500, l'erreur est silencieusement ignorée. Le composant n'en sait rien, l'utilisateur ne voit rien, et les logs ne capturent rien. En production, c'est une source de bugs impossibles à tracer.

**Fix :**
```typescript
import { catchError, EMPTY } from 'rxjs';

this.http.get<Todo[]>('/api/todos').pipe(
  catchError(err => {
    this.logger.error('Failed to load todos', err);
    return EMPTY;
  })
).subscribe(todos => {
  this._todos = todos;
  this.todos$.next(todos);
});
```

### 3. `BehaviorSubject` exposé directement
**Pourquoi c'est un problème :**
Exposer le `BehaviorSubject` permet à n'importe qui d'appeler `todoService.todos$.next([])` depuis un composant et d'écraser l'état sans passer par le service. `.asObservable()` restreint le flux en lecture seule pour les consommateurs externes.

**Fix :**
```typescript
private todos$ = new BehaviorSubject<Todo[]>([]);

readonly todos$$ = this.todos$.asObservable();
```

### 4. `subscribe` + boucle pour transformer des données
**Pourquoi c'est un problème :**
Souscrire uniquement pour transformer des données est un anti-pattern RxJS. On perd la composabilité des opérateurs, et on s'expose à des memory leaks si la transformation évolue. `pipe` + `map` est plus lisible, testable et annulable.

**Fix :**
```typescript
import { map } from 'rxjs/operators';

this.http.get<Todo[]>('/api/todos').pipe(
  map(todos => todos.map(todo => ({ ...todo, label: todo.title.toUpperCase() })))
).subscribe(todos => {
  this._todos = todos;
  this.todos$.next(todos);
});
```

### 5. Couplage fort avec `LoggerService` concret
**Pourquoi c'est un problème :**
Importer et injecter directement `LoggerService` rend le service difficile à tester (il faut fournir un vrai `LoggerService`) et impossible à brancher sur un système de log externe sans modifier le code. Un token d'injection abstrait résout ça.

**Fix :**
```typescript
import { InjectionToken } from '@angular/core';

export interface Logger {
  log(message: string): void;
  error(message: string, error?: unknown): void;
}

export const LOGGER = new InjectionToken<Logger>('Logger');

// Dans le service
private logger = inject(LOGGER);
```

### 6. `any` utilisé partout
**Pourquoi c'est un problème :**
Typer en `any` désactive toutes les vérifications TypeScript. Une faute de frappe sur `item.titlee` passe silencieusement à la compilation. L'interface `Todo` est déjà définie dans le fichier — autant l'utiliser.

**Fix :**
```typescript
public todos: Todo[] = [];
public todos$ = new BehaviorSubject<Todo[]>([]);

this.http.get<Todo[]>('/api/todos').subscribe((todos: Todo[]) => { ... });
```

</details>
