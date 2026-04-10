---
sidebar_position: 5
---

# Testing

## Comment tester un composant Angular ?

> `TestBed.configureTestingModule()` crée un environnement de test isolé. `fixture.detectChanges()` déclenche la change detection — obligatoire avant toute assertion sur le DOM. Depuis Angular 21, Vitest est le runner par défaut (`ng test`).

```typescript
it('should display the user name', () => {
  TestBed.configureTestingModule({
    imports: [UserCardComponent],
  });

  const fixture = TestBed.createComponent(UserCardComponent);
  fixture.componentInstance.name = signal('Alice');
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('[data-testid="name"]').textContent)
    .toContain('Alice');
});
```

**Piege entretien :** `fixture.detectChanges()` est OBLIGATOIRE avant toute assertion DOM. Oublier ce premier appel est l'erreur n°1 — le composant est créé mais le template n'a jamais été rendu.

---

## Comment tester un service avec HttpClient ?

> `provideHttpClientTesting()` remplace les vrais appels HTTP par un mock contrôlable via `HttpTestingController`. On flush les réponses manuellement et on vérifie qu'il ne reste pas de requêtes inattendues.

```typescript
it('should fetch users', () => {
  TestBed.configureTestingModule({
    providers: [UserService, provideHttpClient(), provideHttpClientTesting()],
  });

  const service = TestBed.inject(UserService);
  const http = TestBed.inject(HttpTestingController);

  let result: User[] = [];
  service.getAll().subscribe(users => (result = users));

  http.expectOne('/api/users').flush([{ id: 1, name: 'Alice' }]);
  expect(result).toHaveLength(1);
  http.verify();
});
```

**Piege entretien :** `provideHttpClientTesting()` remplace `HttpClientTestingModule` (déprécié). `http.verify()` en fin de test révèle les requêtes HTTP inattendues — ne pas l'oublier.

---

## Comment mocker une dépendance ?

> Avec Vitest : `vi.fn()` pour une fonction mock, `vi.spyOn()` pour espionner un appel existant. On injecte le mock via `useValue` dans les providers du TestBed.

```typescript
it('should show logout when authenticated', () => {
  const authMock = { isLoggedIn: vi.fn(() => true), logout: vi.fn() };

  TestBed.configureTestingModule({
    imports: [NavbarComponent],
    providers: [{ provide: AuthService, useValue: authMock }],
  });

  const fixture = TestBed.createComponent(NavbarComponent);
  fixture.detectChanges();

  expect(authMock.isLoggedIn).toHaveBeenCalled();
});
```

**Piege entretien :** Mocker au niveau le plus bas possible. Pour tester un service HTTP, utiliser `HttpTestingController` — pas un mock de `HttpClient`. Mocker `HttpClient` masque les bugs de construction de requêtes.

---

## Comment tester avec des signals ?

> Les signals sont synchrones — pas besoin de `fakeAsync`/`tick`. Un `fixture.detectChanges()` après `signal.set()` suffit. Les `computed()` se recalculent aussi de façon synchrone.

```typescript
it('should update count display', () => {
  const fixture = TestBed.createComponent(CounterComponent);
  fixture.detectChanges();

  fixture.componentInstance.count.set(42);
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('[data-testid="count"]').textContent)
    .toBe('42');
});
```

**Piege entretien :** Les `effect()` sont planifiés de façon asynchrone et nécessitent `TestBed.flushEffects()` pour forcer leur exécution dans les tests. Les `computed()` et `signal()` sont synchrones — testables directement. En zoneless (Angular 21+), préférer `await fixture.whenStable()` plutôt que `fixture.detectChanges()`.

---

## Component harness (CDK) ?

> Abstraction pour interagir avec les composants Material sans dépendre du DOM interne. Fini les sélecteurs CSS fragiles qui cassent à chaque mise à jour de Material.

```typescript
it('should click the submit button', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const button = await loader.getHarness(
    MatButtonHarness.with({ text: 'Soumettre' })
  );

  await button.click();

  expect(component.submitted()).toBe(true);
});
```

**Piege entretien :** Les méthodes des harnesses sont TOUTES async — toujours `await`. Oublier le `await` ne cause pas d'erreur immédiate mais le test passe pour de mauvaises raisons (faux positif silencieux).

---

## Vitest vs Karma vs Jest ?

> Vitest est le runner par défaut depuis Angular 21. Il utilise le même environnement Vite que le `ng serve`, donc les tests tournent plus vite. Karma reste supporté pour les projets existants. Jest n'a jamais été officiellement supporté par le CLI.

| Runner | Statut Angular 21+ | Vitesse | Config |
|--------|-------------------|---------|--------|
| **Vitest** | Defaut | Rapide (Vite) | Zero config via CLI |
| Karma | Supporté (legacy) | Lent | karma.conf.js |
| Jest | Communautaire | Moyen | Config manuelle |

```bash
ng new mon-app    # Vitest par défaut
ng test           # Lance Vitest
ng test --watch   # Mode watch
```

**Piege entretien :** Si on te demande "pourquoi Vitest ?", la réponse est : même pipeline Vite que le dev server, ESM natif, pas de compilation séparée. Les tests utilisent le même build que l'app — plus de divergence entre dev et test.
