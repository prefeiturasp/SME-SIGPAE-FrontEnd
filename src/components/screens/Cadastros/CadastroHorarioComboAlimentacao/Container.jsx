import React, { Component } from "react";
import { meusDados } from "../../../../services/perfil.service";
import {
  getHorariosCombosPorEscola,
  getVinculosTipoAlimentacaoPorEscola,
} from "../../../../services/cadastroTipoAlimentacao.service";
import { montaVinculosDeHorariosInicial } from "./helper";

import CadastroHorarioComboAlimentacao from ".";
import { getQuantidaDeAlunosPorPeriodoEEscola } from "../../../../services/escola.service";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meusDados: null,
      vinculosPeriodoEscolarUnidadeEscolar: null,
      horarioDosAlimentos: null,
      vinculosDeHorarios: null,
      uuidEscola: null,
      naoPermitido: false,
      periodosEQuantidadeAlunos: null,
    };
  }

  componentDidMount() {
    meusDados().then((response) => {
      this.setState({
        meusDados: response,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { meusDados } = this.state;
    let {
      vinculosPeriodoEscolarUnidadeEscolar,
      horarioDosAlimentos,
      uuidEscola,
      vinculosDeHorarios,
      periodosEQuantidadeAlunos,
    } = this.state;
    if (meusDados !== prevState.meusDados) {
      const TipoUnidadeEscolar =
        meusDados.vinculo_atual.instituicao.tipo_unidade_escolar;
      const uuidEscola = meusDados.vinculo_atual.instituicao.uuid;
      this.buscaHorariosDosCombos(meusDados.vinculo_atual.instituicao.uuid);
      if (TipoUnidadeEscolar !== null) {
        this.buscaQuantidadeDosAlunosPorPeriodoEscolar(uuidEscola);
        this.buscaVinculosTipoAlimentacaoPorUnidadeEscolar(uuidEscola);
      } else {
        this.setState({ naoPermitido: true });
      }

      this.setState({
        uuidEscola: meusDados.vinculo_atual.instituicao.uuid,
      });
    } else {
      if (
        !vinculosDeHorarios &&
        vinculosPeriodoEscolarUnidadeEscolar &&
        horarioDosAlimentos &&
        uuidEscola &&
        periodosEQuantidadeAlunos
      ) {
        vinculosDeHorarios = montaVinculosDeHorariosInicial(
          vinculosPeriodoEscolarUnidadeEscolar,
          horarioDosAlimentos,
          uuidEscola,
          periodosEQuantidadeAlunos
        );
        this.setState({ vinculosDeHorarios });
      }
    }
  }

  buscaQuantidadeDosAlunosPorPeriodoEscolar = (uuidEscola) => {
    getQuantidaDeAlunosPorPeriodoEEscola(uuidEscola).then((response) => {
      let { periodosEQuantidadeAlunos } = this.state;
      if (!periodosEQuantidadeAlunos) {
        this.setState({ periodosEQuantidadeAlunos: response.data.results });
      }
    });
  };

  buscaVinculosTipoAlimentacaoPorUnidadeEscolar = (uuidEscola) => {
    let vinculosPeriodoEscolarUnidadeEscolar =
      this.state.vinculosPeriodoEscolarUnidadeEscolar;
    getVinculosTipoAlimentacaoPorEscola(uuidEscola).then((response) => {
      vinculosPeriodoEscolarUnidadeEscolar = response.data.results;
      this.setState({ vinculosPeriodoEscolarUnidadeEscolar });
    });
  };

  buscaHorariosDosCombos = (escolaUuid) => {
    let horarioDosAlimentos = this.state.horarioDosAlimentos;
    getHorariosCombosPorEscola(escolaUuid).then((response) => {
      horarioDosAlimentos = response.results;
      this.setState({ horarioDosAlimentos });
    });
  };

  render() {
    return <CadastroHorarioComboAlimentacao {...this.state} />;
  }
}

export default Container;
