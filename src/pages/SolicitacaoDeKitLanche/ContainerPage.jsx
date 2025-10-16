import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumb from "src/components/Shareable/Breadcrumb";
import Page from "src/components/Shareable/Page/Page";
import PainelPedidosKitLancheCODAE from "src/components/SolicitacaoDeKitLanche/CODAE/PainelPedidos/Container";
import { Container } from "src/components/SolicitacaoDeKitLanche/Container";
import PainelPedidosKitLancheDRE from "src/components/SolicitacaoDeKitLanche/DRE/PainelPedidos/Container";
import { Container as ContainerCEMEI } from "src/components/SolicitacaoKitLancheCEMEI/componentes/Container";
import { HOME } from "src/constants/config";
import { escolaEhCEMEI } from "src/helpers/utilities";
import { meusDados } from "src/services/perfil.service";
import {
  CODAE,
  DRE,
  ESCOLA,
  SOLICITACAO_KIT_LANCHE,
} from "../../configs/constants";

export class PainelPedidosBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      quantidade_alunos: 0,
    };
  }

  componentDidMount() {
    meusDados().then((response) => {
      let meusDados = response;

      switch (this.props.VISAO) {
        case ESCOLA:
          meusDados["quantidade_alunos"] =
            response.vinculo_atual.instituicao.quantidade_alunos;
          break;
        case DRE:
          meusDados["quantidade_alunos"] =
            response.vinculo_atual.instituicao.quantidade_alunos;
          break;
        default:
          return "";
      }
      this.setState({
        meusDados,
      });
    });
  }

  render() {
    const { meusDados } = this.state;
    const atual = {
      href: `/${this.props.VISAO}/${SOLICITACAO_KIT_LANCHE}`,
      titulo: "Kit Lanche Passeio",
    };
    return (
      <Page titulo={atual.titulo} botaoVoltar>
        <Breadcrumb home={HOME} atual={atual} />
        {this.props.VISAO === ESCOLA && !escolaEhCEMEI() && meusDados && (
          <Container meusDados={meusDados} />
        )}
        {this.props.VISAO === ESCOLA && escolaEhCEMEI() && meusDados && (
          <ContainerCEMEI meusDados={meusDados} />
        )}
        {this.props.VISAO === DRE && (
          <PainelPedidosKitLancheDRE filtros={this.props.filtros} />
        )}
        {this.props.VISAO === CODAE && (
          <PainelPedidosKitLancheCODAE filtros={this.props.filtros} />
        )}
      </Page>
    );
  }
}

// Escola
export const PainelPedidosEscola = () => <PainelPedidosBase VISAO={ESCOLA} />;
// DRE
export const PainelPedidosDRE = () => {
  const location = useLocation();
  const filtros = location.state && location.state.filtros;
  return <PainelPedidosBase VISAO={DRE} filtros={filtros} />;
};
// CODAE
export const PainelPedidosCODAE = () => {
  const location = useLocation();
  const filtros = location.state && location.state.filtros;
  return <PainelPedidosBase VISAO={CODAE} filtros={filtros} />;
};
