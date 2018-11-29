export enum Cat {HAUS_GARTEN, UNI, FREIZEIT, ADMIN, SONSTIGES}  // §§§§§§ Kategorie des BacklogItems ... ERWEITERBAR
export enum DatTyp {FIX, SCHED}  // Harter termin oder locker geplant
export enum ItemStatus {LOGGED, TODO, DONE}
export enum ItemWeight {EASY, NORMAL, HEAVY}

export class CatString { // für die anzeige in Views .. weil der user so schlecht mit nummern umgeht
  0: String = "HAUS"
  1: String = "UNI"
  2: String = "FREIZEIT"
  3: String = "ADMIN"
  4: String = "SONSTIG"
}
export interface BacklogItem {  //statt interface könnte man auch class schreiben
    id: number;
    title: string;
    description: string;
    category: Cat;
    dateDue: Date;
    dateType: DatTyp;
    priority: number;
    status: ItemStatus;
    weight: ItemWeight;
    dateDone: Date;
}
