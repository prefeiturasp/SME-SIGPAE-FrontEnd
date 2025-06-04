import React from "react";
import { Menu, SubMenu, LeafItem } from "./shared";
import {
  PAINEL_GESTAO_PRODUTO,
  GESTAO_PRODUTO,
  PESQUISA_DESENVOLVIMENTO,
  RECLAMACAO_DE_PRODUTO,
  AVALIAR_RECLAMACAO_PRODUTO,
  ATIVACAO_DE_PRODUTO,
} from "src/configs/constants";
import { listarCardsPermitidos, CADASTROS } from "src/helpers/gestaoDeProdutos";
import {
  usuarioEhEscolaTerceirizadaDiretor,
  usuarioEhEscolaTerceirizada,
  usuarioEhEmpresaTerceirizada,
  usuarioEhCODAEGestaoProduto,
  usuarioEhNutricionistaSupervisao,
} from "src/helpers/utilities";

const MenuGestaoDeProduto = ({ activeMenu, onSubmenuClick }) => {
  const menuItems = listarCardsPermitidos();
  const cadastroItems = CADASTROS;
  const exibirBusca = true;
  const exibirCadastro = usuarioEhEmpresaTerceirizada();
  const exibirAvaliarReclamacao = usuarioEhCODAEGestaoProduto();
  const exibirReclamacao =
    usuarioEhNutricionistaSupervisao() ||
    usuarioEhEscolaTerceirizada() ||
    usuarioEhEscolaTerceirizadaDiretor();
  const exibirReclamacaoUE =
    usuarioEhEscolaTerceirizada() || usuarioEhEscolaTerceirizadaDiretor();
  const exibirReclamacaoNutrisupervisao = usuarioEhNutricionistaSupervisao();
  const exibirAtivacao = usuarioEhCODAEGestaoProduto();
  const exibirResponderReclamacao = usuarioEhEmpresaTerceirizada();
  const usuarioEhTerceirizadaOuGP =
    usuarioEhCODAEGestaoProduto() || usuarioEhEmpresaTerceirizada();

  return (
    <Menu
      id="GestaoProduto"
      icon="fa-shopping-basket"
      title={"Gestão de Produto"}
      dataTestId="gestao-de-produto"
    >
      <LeafItem to={`/${PAINEL_GESTAO_PRODUTO}`}>
        Painel de Solicitações
      </LeafItem>
      {exibirCadastro && (
        <LeafItem to={`/${PESQUISA_DESENVOLVIMENTO}/produto`}>
          Solicitar Homologação do Produto
        </LeafItem>
      )}
      {exibirBusca && (
        <LeafItem to={`/${PESQUISA_DESENVOLVIMENTO}/busca-produto`}>
          Consulta de Produto
        </LeafItem>
      )}
      {exibirCadastro && (
        <LeafItem
          to={`/${PESQUISA_DESENVOLVIMENTO}/busca-produto-analise-sensorial`}
        >
          Responder análise sensorial
        </LeafItem>
      )}
      {exibirReclamacao && (
        <LeafItem to={`/${GESTAO_PRODUTO}/${RECLAMACAO_DE_PRODUTO}`}>
          Reclamação de Produto
        </LeafItem>
      )}
      {exibirReclamacaoUE && (
        <LeafItem to={`/${GESTAO_PRODUTO}/responder-questionamento-ue`}>
          Responder Questionamento
          <br />
          da CODAE
        </LeafItem>
      )}
      {exibirReclamacaoNutrisupervisao && (
        <LeafItem
          to={`/${GESTAO_PRODUTO}/responder-questionamento-nutrisupervisor`}
        >
          Responder Questionamento
          <br />
          da CODAE
        </LeafItem>
      )}
      {exibirAvaliarReclamacao && (
        <LeafItem to={`/${GESTAO_PRODUTO}/${AVALIAR_RECLAMACAO_PRODUTO}`}>
          Avaliar Reclamação de Produto
        </LeafItem>
      )}
      {exibirAtivacao && (
        <LeafItem to={`/${GESTAO_PRODUTO}/${ATIVACAO_DE_PRODUTO}/consulta`}>
          Suspensão/Ativação do Produto
        </LeafItem>
      )}
      {exibirResponderReclamacao && (
        <LeafItem to={`/${GESTAO_PRODUTO}/responder-reclamacao/consulta`}>
          Responder Questionamento
          <br />
          da CODAE
        </LeafItem>
      )}
      <SubMenu
        icon="fa-chevron-down"
        path="consulta-solicitacoes-gp"
        onClick={onSubmenuClick}
        title="Consulta de Solicitações"
        activeMenu={activeMenu}
        dataTestId="consulta-solicitacoes-gp"
      >
        {menuItems.map((item, index) => (
          <LeafItem key={index} to={`/${GESTAO_PRODUTO}/${item.rota}`}>
            {item.titulo_menu || item.titulo}
          </LeafItem>
        ))}
      </SubMenu>
      {usuarioEhTerceirizadaOuGP && (
        <SubMenu
          icon="fa-chevron-down"
          path="cadastros-gp"
          onClick={onSubmenuClick}
          title="Cadastros"
          activeMenu={activeMenu}
        >
          {cadastroItems.map((item, index) => (
            <LeafItem key={index} to={`/${GESTAO_PRODUTO}/${item.rota}`}>
              <div className="quebra-titulos">{item.titulo}</div>
            </LeafItem>
          ))}
        </SubMenu>
      )}
    </Menu>
  );
};

export default MenuGestaoDeProduto;
