import {
  usuarioEhAdministradorNutriCODAE,
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhCODAEGestaoProduto,
  usuarioEhCODAENutriManifestacao,
  usuarioEhCogestorDRE,
  usuarioEhCoordenadorNutriCODAE,
  usuarioEhEmpresaTerceirizada,
  usuarioEhEscola,
  usuarioEhNutricionistaSupervisao,
} from "src/helpers/utilities";

export const labelSidebar = (nomeEscolaOuTerceirizada) => {
  if (usuarioEhCODAEGestaoProduto()) {
    return "Núcleo de Pesquisa e Desenvolvimento";
  } else if (
    usuarioEhCoordenadorNutriCODAE() ||
    usuarioEhAdministradorNutriCODAE()
  ) {
    return "Núcleo de Necessidades Nutricionais Específicas";
  } else if (usuarioEhCODAEGestaoAlimentacao()) {
    return "Núcleo de Gestão de Terceirizadas";
  } else if (usuarioEhCODAENutriManifestacao()) {
    return "Núcleo de Assessoria";
  } else if (usuarioEhNutricionistaSupervisao()) {
    return "Núcleo de Supervisão da Alimentação Escolar";
  } else if (usuarioEhCogestorDRE()) {
    return "Cogestor de Alimentação Escolar";
  } else if (usuarioEhEscola() || usuarioEhEmpresaTerceirizada()) {
    return nomeEscolaOuTerceirizada;
  }
};
