export interface ParametrosCalendario {
  ano: number;
  mes: number;
  status?: string;
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
  tipo_calendario: string;
  tipo_calendario_display: string;
}
