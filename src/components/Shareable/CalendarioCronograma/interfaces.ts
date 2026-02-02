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

export interface ItemCalendarioInterrupcao {
  uuid: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  isInterrupcao: true;
  motivo_display: string;
  descricao_motivo: string;
}
