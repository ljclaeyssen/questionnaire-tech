---
sidebar_position: 7
---

# Reactive Forms

## Template-driven vs Reactive Forms ?
> Template-driven = directives dans le HTML (`ngModel`), simple pour petits formulaires. Reactive Forms = logique dans le TS (`FormGroup`/`FormControl`), testable et scalable. En entretien, toujours recommander Reactive Forms.

```typescript
// Template-driven
<input [(ngModel)]="name" />

// Reactive
form = new FormGroup({ name: new FormControl('') });
<input [formControl]="form.controls.name" />
```

**Piège entretien :** On peut importer les deux dans le même composant, mais ne jamais appliquer `ngModel` et `formControlName` sur le même élément de formulaire — ça crée un conflit de binding.

---

## Comment créer un formulaire réactif ?
> `FormGroup` contient des `FormControl`. On déclare tout dans le TS, on branche dans le template avec `formGroup` et `formControlName`.

```typescript
form = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});

onSubmit() {
  console.log(this.form.value);
}
```

**Piège entretien :** Ne pas utiliser `FormBuilder` pour montrer qu'on comprend la structure. `FormBuilder` est du sucre syntaxique — les recruteurs veulent voir `new FormGroup(...)`.

---

## FormArray : quand et comment ?
> Pour les listes dynamiques (ajouter/supprimer des champs). Indispensable pour des items répétables comme des adresses ou des compétences.

```typescript
form = new FormGroup({
  skills: new FormArray([new FormControl('Angular')]),
});

get skills() { return this.form.get('skills') as FormArray; }

addSkill() { this.skills.push(new FormControl('')); }
removeSkill(i: number) { this.skills.removeAt(i); }
```

**Piège entretien :** Les indices de `FormArray` peuvent créer des bugs si on itère mal. Toujours utiliser `track` avec `@for` pour éviter les re-renders erratiques.

---

## Validators built-in et custom ?
> Built-in : `Validators.required`, `.minLength()`, `.email`, `.pattern()`. Custom : fonction qui retourne `null` (valide) ou `{ errorKey: true }` (invalide).

```typescript
function noSpaceValidator(control: AbstractControl) {
  const hasSpace = (control.value as string)?.includes(' ');
  return hasSpace ? { noSpace: true } : null;
}

name = new FormControl('', [Validators.required, noSpaceValidator]);
```

**Piège entretien :** Un custom validator doit retourner `null` en cas de succès, pas `false` ou `undefined` — sinon Angular considère le champ invalide.

---

## Validation cross-field ?
> Validator au niveau du `FormGroup` (pas du `FormControl`). Il reçoit le group entier et compare les controls entre eux.

```typescript
function passwordMatch(group: AbstractControl) {
  const pwd = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return pwd === confirm ? null : { passwordMismatch: true };
}

form = new FormGroup(
  { password: new FormControl(''), confirm: new FormControl('') },
  { validators: passwordMatch }
);
```

**Piège entretien :** L'erreur est sur le `FormGroup`, pas sur les controls individuels. Dans le template : `form.errors?.['passwordMismatch']`, pas `form.controls.confirm.errors`.

---

## Comment réagir aux changements ?
> `valueChanges` est un Observable qui émet à chaque modification. En moderne, préférer `toSignal(form.valueChanges)` pour intégration avec les signals.

```typescript
// Classique
this.form.get('search')?.valueChanges
  .pipe(debounceTime(300))
  .subscribe(val => this.search(val));

// Moderne avec signals
searchValue = toSignal(
  this.form.controls.search.valueChanges.pipe(debounceTime(300))
);
```

**Piège entretien :** `valueChanges` émet à chaque keystroke. Sans `debounceTime`, une recherche HTTP se déclenche à chaque lettre tapée — mauvaise perf et mauvaise pratique.
