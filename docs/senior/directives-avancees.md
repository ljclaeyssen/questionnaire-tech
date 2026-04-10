---
sidebar_position: 6
---

# Directives avancées

## Directive d'attribut vs structurelle ?

> Une directive d'attribut modifie le comportement ou l'apparence d'un élément existant sans toucher au DOM (highlight, tooltip, form validation visuelle). Une directive structurelle modifie la structure du DOM — elle ajoute ou supprime des noeuds (`*ngIf`, `*ngFor`, `@if`, `@for`).

```typescript
// Directive d'attribut — élément reste dans le DOM
<button appHighlight>Cliquez</button>

// Directive structurelle — élément potentiellement absent du DOM
<div *appIf="isVisible">Visible seulement si true</div>
// ou syntaxe moderne
@if (isVisible) { <div>Visible</div> }
```

**Piege entretien :** Les directives structurelles ont un `*` pour indiquer qu'elles travaillent avec un `<ng-template>` implicite. La syntaxe `*appIf="condition"` est du sucre syntaxique pour `<ng-template [appIf]="condition"><div>...</div></ng-template>`.

---

## Comment créer une directive d'attribut ?

> Déclarer `@Directive` avec un sélecteur d'attribut CSS entre crochets. `inject(ElementRef)` donne accès au noeud DOM natif. `@HostListener` écoute les events sur l'hôte sans avoir à manipuler `addEventListener` manuellement.

```typescript
@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onEnter()',
    '(mouseleave)': 'onLeave()',
  },
})
export class HighlightDirective {
  private el = inject(ElementRef<HTMLElement>);
  color = input<string>('yellow');

  onEnter() {
    this.el.nativeElement.style.backgroundColor = this.color();
  }

  onLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

**Piege entretien :** Préférer la propriété `host` du décorateur `@Directive` plutôt que `@HostBinding`/`@HostListener` (considérés legacy). Éviter l'accès direct à `ElementRef.nativeElement` — incompatible SSR car `document` n'existe pas côté serveur.

---

## C'est quoi HostDirective ?

> `hostDirectives` permet à un composant de composer du comportement depuis plusieurs directives sans que le consommateur ait à les appliquer lui-même. C'est de la composition de directives — l'alternative Angular à l'héritage de classes.

```typescript
@Component({
  selector: 'app-button',
  template: `<button><ng-content /></button>`,
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['tooltipText: appTooltip'], // exposer l'input sous un alias
    },
    {
      directive: RippleDirective, // pas d'input à exposer
    },
  ],
})
export class ButtonComponent {}

// Usage : l'utilisateur voit appTooltip, pas TooltipDirective
<app-button appTooltip="Enregistrer">Save</app-button>
```

**Piege entretien :** Les inputs et outputs des host directives ne sont PAS automatiquement exposés — ils doivent être listés explicitement dans `inputs` et `outputs`. Sans ça, le consommateur ne peut pas les passer et ils sont ignorés silencieusement.

---

## Directive structurelle custom ?

> `inject(TemplateRef)` donne accès au `<ng-template>` implicite. `inject(ViewContainerRef)` permet de créer ou détruire une vue depuis ce template. La logique ressemble à un `*ngIf` maison.

```typescript
@Directive({
  selector: '[appIf]',
})
export class AppIfDirective {
  private templateRef = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);
  private hasView = false;

  @Input() set appIf(condition: boolean) {
    if (condition && !this.hasView) {
      this.vcr.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!condition && this.hasView) {
      this.vcr.clear();
      this.hasView = false;
    }
  }
}
```

**Piege entretien :** Depuis Angular 17, `@if`, `@for` et `@switch` couvrent 95% des cas de directives structurelles custom — inutile d'en créer une pour une simple condition. Les directives structurelles custom restent pertinentes pour des comportements vraiment spécifiques : permission guards inline, lazy rendering conditionnel avec contexte enrichi.
