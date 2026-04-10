---
sidebar_position: 4
---

# Code Review : ContactFormComponent

Identifiez les problèmes dans le code suivant.

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact-form',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Nom" />
      <div *ngIf="form.get('name')!.errors!['required']">Le nom est requis</div>

      <input formControlName="email" placeholder="Email" />
      <div *ngIf="form.get('email')!.errors!['required']">L'email est requis</div>

      <select formControlName="category">
        <option value="support">Support</option>
        <option value="sales">Ventes</option>
      </select>

      <textarea formControlName="message" placeholder="Message"></textarea>

      <button type="submit">Envoyer</button>
    </form>
  `,
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [''],
      email: [''],
      category: ['support'],
      message: [''],
    });

    this.form.get('email')!.valueChanges.subscribe(value => {
      if (value && !value.includes('@')) {
        this.form.get('email')!.setErrors({ invalidEmail: true });
      } else {
        this.form.get('email')!.setErrors(null);
      }
    });
  }

  onSubmit() {
    if (this.form.value.name === '') {
      alert('Le nom est requis');
      return;
    }
    if (this.form.value.email === '') {
      alert('L\'email est requis');
      return;
    }

    this.contactService.send(this.form.value).subscribe(result => {
      this.contactService.notify(result.id).subscribe(notification => {
        console.log('Notification envoyée', notification);
        this.form.reset();
      });
    });
  }
}
```

<details>
<summary>Voir l'analyse</summary>

| # | Problème | Sévérité | Ligne |
|---|----------|----------|-------|
| 1 | `subscribe` sur `valueChanges` sans `unsubscribe` | Critique | ~42 |
| 2 | `subscribe` imbriqué dans `onSubmit` | Critique | ~57 |
| 3 | Logique de validation dans le composant au lieu de `Validators` | Important | ~42–49, ~53–58 |
| 4 | `FormGroup` non typé, pas de `Validators` dans `fb.group` | Important | ~36–41 |
| 5 | Bouton submit non désactivé pendant la requête | Moyen | ~23 |
| 6 | Accès aux erreurs sans vérification null (`errors!['required']`) | Moyen | ~11, ~14 |

### 1. `subscribe` sur `valueChanges` sans `unsubscribe`
**Pourquoi c'est un problème :**
`valueChanges` est un observable infini. Sans résiliation, la souscription reste active même après la destruction du composant. Si le composant est recréé (ex : modal, `*ngIf`), une nouvelle souscription s'accumule à chaque fois, causant des memory leaks et des effets de bord imprévisibles.

**Fix :**
```typescript
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, inject } from '@angular/core';

private destroyRef = inject(DestroyRef);

ngOnInit() {
  this.form.get('email')!.valueChanges.pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(value => { ... });
}
```

### 2. `subscribe` imbriqué dans `onSubmit`
**Pourquoi c'est un problème :**
Comme pour les composants, un `subscribe` dans un `subscribe` empêche toute annulation si l'utilisateur quitte la page pendant l'envoi. Si `send` émet plusieurs fois, autant de souscriptions à `notify` sont créées. `switchMap` est le bon outil ici.

**Fix :**
```typescript
import { switchMap } from 'rxjs/operators';

onSubmit() {
  if (this.form.invalid) return;

  this.isLoading = true;
  this.contactService.send(this.form.value).pipe(
    switchMap(result => this.contactService.notify(result.id))
  ).subscribe({
    next: notification => {
      console.log('Notification envoyée', notification);
      this.form.reset();
      this.isLoading = false;
    },
    error: () => { this.isLoading = false; }
  });
}
```

### 3. Logique de validation dans le composant
**Pourquoi c'est un problème :**
Vérifier les valeurs du formulaire dans `onSubmit` avec des `if` et des `alert` est fragile et non testable. La validation avec `setErrors` dans `valueChanges` duplique ce que `Validators` fait nativement. Le formulaire devient la source de vérité, pas le composant.

**Fix :**
```typescript
import { Validators } from '@angular/forms';

// Validator custom pour l'email
function emailValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  if (value && !value.includes('@')) {
    return { invalidEmail: true };
  }
  return null;
}

// Dans ngOnInit
this.form = this.fb.group({
  name: ['', Validators.required],
  email: ['', [Validators.required, emailValidator]],
  category: ['support', Validators.required],
  message: ['', Validators.required],
});

// Dans onSubmit
onSubmit() {
  if (this.form.invalid) return;
  // ...
}
```

### 4. `FormGroup` non typé, pas de `Validators`
**Pourquoi c'est un problème :**
Un `FormGroup` sans type générique perd toute inférence TypeScript. `form.value.naame` passe silencieusement à la compil. Depuis Angular 14, `FormGroup<T>` permet un typage strict. L'absence de `Validators` signifie que `form.invalid` ne reflète jamais rien d'utile.

**Fix :**
```typescript
import { FormControl, FormGroup, Validators } from '@angular/forms';

form = new FormGroup({
  name: new FormControl('', { nonNullable: true, validators: Validators.required }),
  email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
  category: new FormControl<'support' | 'sales'>('support', { nonNullable: true }),
  message: new FormControl('', { nonNullable: true, validators: Validators.required }),
});
```

### 5. Bouton submit non désactivé pendant la requête
**Pourquoi c'est un problème :**
Sans désactivation, l'utilisateur peut cliquer plusieurs fois sur "Envoyer" et déclencher plusieurs appels HTTP en parallèle. Cela peut créer des doublons en base de données et donne une mauvaise expérience utilisateur.

**Fix :**
```typescript
// Dans le composant
isLoading = false;
```
```html
<button type="submit" [disabled]="form.invalid || isLoading">
  {{ isLoading ? 'Envoi...' : 'Envoyer' }}
</button>
```

### 6. Accès aux erreurs sans vérification null
**Pourquoi c'est un problème :**
`form.get('name')!.errors!['required']` plante si le champ n'a pas encore été touché (errors vaut `null` au démarrage). Le `!` sur `errors` force TypeScript à ignorer ce cas, ce qui peut causer des `TypeError: Cannot read properties of null` à l'exécution.

**Fix :**
```html
<!-- Vérifier touched + invalid avant d'accéder aux erreurs -->
<div *ngIf="form.get('name')?.touched && form.get('name')?.hasError('required')">
  Le nom est requis
</div>
```

</details>
