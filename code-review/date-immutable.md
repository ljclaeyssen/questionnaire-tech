---
sidebar_position: 2
---

# Code Review : Classe Date

## 🔍 Exercice

Examinez cette classe `CustomDate` et identifiez les problèmes.

```typescript
export class CustomDate {
  day: number;
  month: number;
  year: number;

  constructor(day: number, month: number, year: number) {
    this.day = day;
    this.month = month;
    this.year = year;
  }

  addDays(days: number) {
    this.day += days;

    const daysInMonth = this.getDaysInMonth();

    while (this.day > daysInMonth) {
      this.day -= daysInMonth;
      this.month++;

      if (this.month > 12) {
        this.month = 1;
        this.year++;
      }
    }
  }

  addMonths(months: number) {
    this.month += months;

    while (this.month > 12) {
      this.month -= 12;
      this.year++;
    }
  }

  getDaysInMonth(): number {
    const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysPerMonth[this.month - 1];
  }

  toString(): string {
    return `${this.day}/${this.month}/${this.year}`;
  }

  isSameDay(other: CustomDate): boolean {
    return this.day === other.day &&
           this.month === other.month &&
           this.year === other.year;
  }
}

// Usage
const date = new CustomDate(28, 2, 2024);
date.addDays(1); // 29/2/2024
date.addDays(1); // 30/2/2024 ❌ Problème !
console.log(date.toString());
```

## ❓ Questions pour l'examinateur

1.  **Quel est le problème majeur d'architecture ?**
2. **Que se passe-t-il avec les années bissextiles ?**
3. **Que se passe-t-il si on crée `new CustomDate(31, 2, 2024)` ?**
4. **Pourquoi `addDays()` est problématique ?**
5. **Comment améliorer la testabilité ?**

---

## ✅ Solution

<details>
<summary>Cliquez pour voir les problèmes identifiés</summary>

### ❌ Problème 1 : Mutation (pas immutable)

```typescript
// ❌ Mauvais - Modifie l'objet existant
const date = new CustomDate(28, 2, 2024);
date.addDays(1); // Modifie date !
console.log(date); // 29/2/2024

// ✅ Bon - Retourne nouvelle instance
const date = new CustomDate(28, 2, 2024);
const nextDay = date.addDays(1); // Nouvelle instance
console.log(date);    // 28/2/2024 (inchangé)
console.log(nextDay); // 29/2/2024
```

### ❌ Problème 2 : Années bissextiles ignorées

```typescript
// ❌ Mauvais
getDaysInMonth(): number {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return daysPerMonth[this.month - 1]; // Toujours 28 pour février
}

// ✅ Bon
getDaysInMonth(): number {
  const daysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let days = daysPerMonth[this.month - 1];

  // Année bissextile
  if (this.month === 2 && this.isLeapYear()) {
    days = 29;
  }

  return days;
}

private isLeapYear(): boolean {
  return (this.year % 4 === 0 && this.year % 100 !== 0) ||
         (this.year % 400 === 0);
}
```

### ❌ Problème 3 : Pas de validation

```typescript
// ❌ Permet des dates invalides
const invalid = new CustomDate(31, 2, 2024); // 31 février !
const invalid2 = new CustomDate(40, 15, -2000); // Accepté !

// ✅ Bon - Validation
constructor(day: number, month: number, year: number) {
  if (month < 1 || month > 12) {
    throw new Error(`Mois invalide: ${month}`);
  }

  if (year < 0) {
    throw new Error(`Année invalide: ${year}`);
  }

  this.month = month;
  this.year = year;

  const maxDays = this.getDaysInMonth();
  if (day < 1 || day > maxDays) {
    throw new Error(`Jour invalide: ${day} (max ${maxDays} pour mois ${month})`);
  }

  this.day = day;
}
```

### ❌ Problème 4 : addMonths ne vérifie pas les jours

```typescript
// ❌ Mauvais
const date = new CustomDate(31, 1, 2024); // 31 janvier
date.addMonths(1); // 31/2/2024 ❌ Invalide !

// ✅ Bon
addMonths(months: number): CustomDate {
  let newMonth = this.month + months;
  let newYear = this.year;

  while (newMonth > 12) {
    newMonth -= 12;
    newYear++;
  }

  // Ajuster le jour si nécessaire
  const maxDays = new CustomDate(1, newMonth, newYear).getDaysInMonth();
  const newDay = Math.min(this.day, maxDays);

  return new CustomDate(newDay, newMonth, newYear);
}
```

### ❌ Problème 5 : Types non readonly

```typescript
// ❌ Mauvais - Propriétés mutables
export class CustomDate {
  day: number;
  month: number;
  year: number;
}

const date = new CustomDate(1, 1, 2024);
date.day = 999; // Modifiable !

// ✅ Bon - Propriétés readonly
export class CustomDate {
  readonly day: number;
  readonly month: number;
  readonly year: number;
}
```

## 📝 Résumé des problèmes

| Problème | Impact | Gravité |
|----------|--------|---------|
| ❌ Mutation (pas immutable) | Effets de bord, bugs difficiles à tracer | 🔴 Critique |
| ❌ Années bissextiles ignorées | Calculs incorrects en février | 🔴 Critique |
| ❌ Pas de validation | Dates invalides acceptées | 🟠 Important |
| ❌ addMonths ne vérifie pas les jours | 31 jan + 1 mois = 31 fév invalide | 🟠 Important |
| ❌ Propriétés mutables | Permet modification directe | 🟡 Moyen |
| ❌ Pas de comparaison | Difficile de trier des dates | 🟡 Moyen |
| ❌ toString pas formaté | 1/1/2024 au lieu de 01/01/2024 | 🟢 Mineur |

</details>



## 💡 Concepts clés

- **Immutabilité** : Les objets ne doivent pas être modifiés après création
- **Validation** : Toujours valider les entrées constructeur
- **Readonly** : Propriétés en lecture seule pour forcer l'immutabilité
- **Edge cases** : Années bissextiles, mois avec 28/29/30/31 jours
- **API claire** : Méthodes qui retournent de nouvelles instances
