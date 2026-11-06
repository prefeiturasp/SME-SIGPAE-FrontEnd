import React from "react";
import { Menu, LeafItem } from "./shared";
import {
  MEMORANDO_OCORRENCIAS,
  POS_RECEBIMENTO,
  TERMO_RECEBIMENTO_PROVISORIO,
  TERMO_RECEBIMENTO_PROVISORIO_FORNECEDOR,
  PAINEL_ASSINATURA_TERMOS_RECEBIMENTO,
} from "src/configs/constants";
import {
  usuarioEhEmpresaFornecedor,
  usuarioEhEscola,
} from "src/helpers/utilities";

const MenuPosRecebimento = () => {
  return (
    <Menu
      id="PosRecebimento"
      icon="fa-clipboard-check"
      title="Pós-Recebimento"
      dataTestId="pos-recebimento"
    >
      {usuarioEhEmpresaFornecedor() ? (
        <LeafItem
          to={`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO_FORNECEDOR}`}
          dataTestId="termo-recebimento-provisorio-fornecedor"
        >
          Termo de Recebimento Provisório
        </LeafItem>
      ) : usuarioEhEscola() ? (
        <LeafItem
          to={`/${POS_RECEBIMENTO}/${MEMORANDO_OCORRENCIAS}`}
          dataTestId="memorando-ocorrencias"
        >
          Memorando de Ocorrências
        </LeafItem>
      ) : (
        <>
          <LeafItem
            to={`/${POS_RECEBIMENTO}/${PAINEL_ASSINATURA_TERMOS_RECEBIMENTO}`}
            dataTestId="painel-assinatura-termos-recebimento"
          >
            Painel de Assinaturas
          </LeafItem>
          <LeafItem
            to={`/${POS_RECEBIMENTO}/${TERMO_RECEBIMENTO_PROVISORIO}`}
            dataTestId="termo-recebimento-provisorio"
          >
            Termo de Recebimento Provisório
          </LeafItem>
        </>
      )}
    </Menu>
  );
};

export default MenuPosRecebimento;
