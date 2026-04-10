---
sidebar_position: 6
---

# HttpClient

## Comment configurer HttpClient ?
> `provideHttpClient()` dans `app.config.ts` remplace `HttpClientModule`. On peut y brancher des options comme `withInterceptors()` ou `withFetch()` pour utiliser l'API Fetch native.

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    )
  ]
};
```

**Piège entretien :** Importer `HttpClientModule` dans une app standalone ne casse rien mais est déprécié. `provideHttpClient()` est la voie moderne et composable.

---

## Comment créer un interceptor fonctionnel ?
> Une fonction `HttpInterceptorFn` qui reçoit `(req, next)` et retourne `next(req)`. On modifie la requête en la clonant avec `.clone()` — les requêtes HTTP sont immuables.

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(authReq);
};
```

**Piège entretien :** L'ordre des interceptors dans `withInterceptors([a, b, c])` est important — ils s'exécutent dans l'ordre du tableau pour la requête, et en sens inverse pour la réponse (comme un middleware stack).

---

## Comment gérer les erreurs HTTP ?
> Avec `catchError` dans un `pipe()` RxJS. On relance une erreur typée ou on retourne une valeur par défaut. `retry()` permet de rejouer la requête automatiquement.

```typescript
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('/api/users').pipe(
    retry(1),
    catchError((err: HttpErrorResponse) => {
      console.error(err.status);
      return throwError(() => new Error('Fetch failed'));
    })
  );
}
```

**Piège entretien :** `catchError` doit toujours retourner un `Observable` — soit `throwError(() => err)`, soit `of(valeurParDefaut)`. Retourner `void` ou rien fait planter le stream silencieusement.

---

## Typed responses ?
> `this.http.get<User[]>('/api/users')` type la réponse côté TypeScript, mais c'est un simple cast — Angular ne valide pas la shape à l'exécution. Les données reçues peuvent ne pas matcher le type.

```typescript
// TS est content, mais pas de validation runtime
this.http.get<User[]>('/api/users').subscribe(users => {
  console.log(users[0].name); // peut exploser si l'API renvoie autre chose
});

// Avec validation runtime (zod)
const schema = z.array(UserSchema);
this.http.get('/api/users').pipe(
  map(data => schema.parse(data))
);
```

**Piège entretien :** Le typage générique de `HttpClient` est une promesse TypeScript, pas un contrat runtime. Pour valider réellement la shape, il faut un validateur comme `zod` ou `io-ts`.

---

## httpResource vs HttpClient ?
> `httpResource` (Angular 20+, **experimental**) est déclaratif et signal-based — la requête se relance automatiquement quand le signal source change. `HttpClient` reste l'API stable et recommandée en production.

```typescript
// HttpClient (stable, recommandé)
getUser(id: number): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`);
}

// httpResource (preview, signal-based)
userId = signal(1);
user = httpResource<User>(() => `/api/users/${this.userId()}`);
// user.value(), user.isLoading(), user.error() sont des signals
```

**Piège entretien :** `httpResource` est encore **experimental** — l'API peut changer à tout moment. Ne pas l'utiliser en production sans accepter les breaking changes. `HttpClient` reste la référence stable.
