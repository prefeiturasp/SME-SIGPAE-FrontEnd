export interface ItemCalendario<T> {
  title: string;
  data: string;
  start: Date;
  end: Date;
  allDay: boolean;
  programa_leve_leite?: boolean;
  objeto: T;
}

export interface ParametrosCalendario {
  ano: number;
  mes: number;
}
