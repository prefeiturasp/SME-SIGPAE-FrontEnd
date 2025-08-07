export interface IFormValues {
  editais: Array<string>;
  nome_produto?: string;
  nome_marca?: string;
  nome_fabricante?: string;
  status_reclamacao?: Array<string>;
  lotes?: Array<string>;
  data_inicial_reclamacao?: string;
  data_final_reclamacao?: string;
  terceirizadas?: Array<string>;
}
