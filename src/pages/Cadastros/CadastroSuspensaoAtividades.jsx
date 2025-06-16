import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import {
  CADASTROS,
  CONFIGURACOES,
  SUSPENSAO_ATIVIDADES,
} from "src/configs/constants";
import { Calendario } from "src/components/Shareable/Calendario";
import {
  getDiasSuspensaoAtividades,
  setDiaSuspensaoAtividades,
  deleteDiaSuspensaoAtividades,
} from "src/services/cadastroDiasSuspensaoAtividades.service";
import {
  usuarioEhCODAEGestaoAlimentacao,
  usuarioEhMedicao,
} from "src/helpers/utilities";

const atual = {
  href: `/${CONFIGURACOES}/${CADASTROS}/${SUSPENSAO_ATIVIDADES}`,
  titulo: "Suspensão de Atividades",
};

const anteriores = [
  {
    href: `/${CONFIGURACOES}/${CADASTROS}`,
    titulo: "Cadastros",
  },
];

export const CadastroSuspensaoDeAtividadesPage = () => {
  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      <Calendario
        getObjetos={getDiasSuspensaoAtividades}
        nomeObjeto="Suspensão de Atividades"
        nomeObjetoMinusculo="suspensão de atividades"
        setObjeto={setDiaSuspensaoAtividades}
        deleteObjeto={deleteDiaSuspensaoAtividades}
        podeEditar={usuarioEhCODAEGestaoAlimentacao() || usuarioEhMedicao()}
      />
    </Page>
  );
};

export default CadastroSuspensaoDeAtividadesPage;
