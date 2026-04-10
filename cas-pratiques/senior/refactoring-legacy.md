---
sidebar_position: 2
---

# Refactoring d'un composant Angular legacy

**Niveau** : Senior
**Durée** : 60 min
**Concepts évalués** : Migration standalone, Signals (input/output), Control flow moderne (@if/@for), toSignal(), OnPush, Cleanup d'observables

## Énoncé

On vous fournit un composant Angular legacy ci-dessous. Votre mission est de le migrer vers les patterns modernes d'Angular 17+, sans régression fonctionnelle. Le composant reçoit une catégorie en entrée, charge une liste de produits via HTTP au démarrage, permet de filtrer par nom via un champ texte, et émet un événement quand l'utilisateur sélectionne un produit. Chaque API "ancienne" doit être remplacée par son équivalent moderne. Le composant migré doit être `standalone`, utiliser `OnPush`, et ne contenir aucun `subscribe()` manuel.

**Code legacy à migrer :**

```ts
// product-list.component.ts (legacy)
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProductService } from './product.service';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  template: `
    <input [formControl]="searchControl" placeholder="Rechercher..." />
    <ul>
      <li
        *ngFor="let product of filteredProducts; trackBy: trackById"
        (click)="onSelect(product)"
      >
        {{ product.name }} — {{ product.price | currency }}
      </li>
    </ul>
    <p *ngIf="filteredProducts.length === 0">Aucun produit trouvé.</p>
  `,
})
export class ProductListComponent implements OnInit, OnDestroy {
  @Input() category!: string;
  @Output() productSelected = new EventEmitter<Product>();

  filteredProducts: Product[] = [];
  searchControl = this.fb.control('');
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
  ) {}

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        startWith(''),
        switchMap(query =>
          this.productService.getProducts(this.category, query ?? '')
        ),
        takeUntil(this.destroy$),
      )
      .subscribe(products => {
        this.filteredProducts = products;
      });
  }

  onSelect(product: Product) {
    this.productSelected.emit(product);
  }

  trackById(index: number, product: Product) {
    return product.id;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Critères d'évaluation

- `NgModule` supprimé : le composant est `standalone: true` avec ses imports déclarés localement
- `@Input()` / `@Output()` remplacés par `input()` / `output()` (API signals)
- `*ngIf` / `*ngFor` remplacés par `@if` / `@for` (avec `track` obligatoire)
- `subscribe()` manuel supprimé : le flux est converti en signal via `toSignal()` ou consommé avec `async` pipe
- `FormBuilder` remplacé par `new FormControl()` direct ou `FormGroup` direct
- `OnDestroy` + `Subject` + `takeUntil` supprimés — le cleanup est géré automatiquement
- `ChangeDetectionStrategy.OnPush` activé

<details>
<summary>Indice 1 — Structure standalone et inputs signals</summary>

```ts
@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CurrencyPipe],
  template: `...`,
})
export class ProductListComponent {
  // Remplace @Input() category!: string
  category = input.required<string>();

  // Remplace @Output() productSelected = new EventEmitter<Product>()
  productSelected = output<Product>();

  onSelect(product: Product) {
    this.productSelected.emit(product);
  }
}
```

Avec `input()`, la valeur est disponible via `this.category()` dans le template et le code TS — c'est un signal en lecture seule.
</details>

<details>
<summary>Indice 2 — Remplacer subscribe() par toSignal()</summary>

```ts
private productService = inject(ProductService);

searchControl = new FormControl('');

private products$ = toObservable(this.category).pipe(
  switchMap(category =>
    this.searchControl.valueChanges.pipe(
      startWith(this.searchControl.value),
      switchMap(query =>
        this.productService.getProducts(category, query ?? '')
      ),
    )
  ),
);

filteredProducts = toSignal(this.products$, { initialValue: [] });
```

`toSignal()` souscrit automatiquement et se désabonne quand le composant est détruit — plus besoin de `takeUntil` ni de `ngOnDestroy`.
</details>

<details>
<summary>Indice 3 — Template avec @if et @for</summary>

```html
<input [formControl]="searchControl" placeholder="Rechercher..." />

@for (product of filteredProducts(); track product.id) {
  <li (click)="onSelect(product)">
    {{ product.name }} — {{ product.price | currency }}
  </li>
}

@if (filteredProducts().length === 0) {
  <p>Aucun produit trouvé.</p>
}
```

`track` dans `@for` remplace la `trackBy` function — il prend directement une expression sur l'item. `filteredProducts()` est appelé comme un signal dans le template.
</details>
