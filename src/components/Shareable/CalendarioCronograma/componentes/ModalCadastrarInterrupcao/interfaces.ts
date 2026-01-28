import {
  MotivoInterrupcaoChoices,
  TipoCalendarioInterrupcaoChoices,
} from "interfaces/pre_recebimento.interface";

export interface ModalCadastrarInterrupcaoProps {
  showModal: boolean;
  closeModal: () => void;
  dataSelecionada: Date;
  onSave: () => void;
}

export interface FormInterrupcaoValues {
  motivo: MotivoInterrupcaoChoices | "";
  descricao_motivo: string;
  tipo_calendario: TipoCalendarioInterrupcaoChoices;
}

export const TIPO_CALENDARIO_OPTIONS = [
  { uuid: "", nome: "Selecione o tipo de calendário" },
  { uuid: "ARMAZENAVEL", nome: "Armazenável" },
  { uuid: "PONTO_A_PONTO", nome: "Ponto a Ponto" },
];

export const initialValues: FormInterrupcaoValues = {
  motivo: "",
  descricao_motivo: "",
  tipo_calendario: "ARMAZENAVEL",
};
