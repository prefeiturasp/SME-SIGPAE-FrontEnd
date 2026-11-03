import React from "react";
import { useSearchParams } from "react-router-dom";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { RegistrarNovaOcorrencia } from "src/components/screens/IMR/RegistrarNovaOcorrencia";
import {
  EDITAR_OCORRENCIA,
  LANCAMENTO_INICIAL,
  LANCAMENTO_MEDICAO_INICIAL,
  REGISTRAR_OCORRENCIAS,
} from "src/configs/constants";
import { HOME } from "src/constants/config";

const atual = {
  href: `/${LANCAMENTO_INICIAL}/${LANCAMENTO_MEDICAO_INICIAL}/${REGISTRAR_OCORRENCIAS}/${EDITAR_OCORRENCIA}`,
  titulo: "Editar Ocorrência",
};

const anteriores = [
  {
    href: `/`,
    titulo: "Medição Inicial",
  },
  {
    navigate_to: -2,
    titulo: "Lançamento Medição Inicial",
  },
  {
    navigate_to: -1,
    titulo: "Registrar Ocorrências",
  },
];

export const EditarOcorrenciaPage = () => {
  const [searchParams] = useSearchParams();
  const grupo = searchParams.get("grupo");

  return (
    <Page botaoVoltar titulo={atual.titulo}>
      <Breadcrumb home={HOME} atual={atual} anteriores={anteriores} />
      <RegistrarNovaOcorrencia
        modoEdicao
        ocorrenciaUuid={searchParams.get("ocorrenciaUuid") || undefined}
        tipoOcorrenciaUuid={searchParams.get("tipoOcorrenciaUuid") || undefined}
        grupo={grupo ? Number(grupo) : undefined}
        editalUuid={searchParams.get("editalUuid") || undefined}
        solicitacaoMedicaoInicialUuid={
          searchParams.get("solicitacaoMedicaoInicialUuid") || undefined
        }
        mes={searchParams.get("mes") || undefined}
        ano={searchParams.get("ano") || undefined}
      />
    </Page>
  );
};
