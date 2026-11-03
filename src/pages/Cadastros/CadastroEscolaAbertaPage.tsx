import React from "react";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import { CADASTROS, CONFIGURACOES, ESCOLA_ABERTA } from "src/configs/constants";
import { ENVIRONMENT } from "src/constants/config";
import { CadastrarEscolaAberta } from "../../components/screens/Cadastros/EscolaAberta/CadastrarEscolaAberta";
import { useParams } from "react-router-dom";

export const CadastroEscolaAbertaPage = () => {
  const { uuid } = useParams<{ uuid?: string }>();
  const isEdit = !!uuid;

  const atual = {
    href: `/${CONFIGURACOES}/${CADASTROS}/${ESCOLA_ABERTA}${isEdit ? `/${uuid}` : ""}`,
    titulo: isEdit ? "Editar Escola Aberta" : "Cadastrar Escola Aberta",
  };

  const anteriores = [
    { href: `/${CONFIGURACOES}/${CADASTROS}`, titulo: "Cadastros" },
  ];

  return (
    <Page titulo={atual.titulo} botaoVoltar>
      <Breadcrumb home={"/"} anteriores={anteriores} atual={atual} />
      {!ENVIRONMENT.includes("production") && (
        <CadastrarEscolaAberta uuid={uuid} />
      )}
    </Page>
  );
};
