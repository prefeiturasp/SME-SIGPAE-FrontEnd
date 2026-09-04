import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import {
  toastError,
  toastSuccess,
} from "src/components/Shareable/Toast/dialogs";
import {
  AJUDA,
  CADASTRO_DUVIDAS_FREQUENTES,
  EDITAR_DUVIDA_FREQUENTE,
} from "src/configs/constants";
import {
  excluirPerguntaFrequente,
  listarPerguntasFrequentes,
} from "src/services/faq.service";
import BotaoCadastrarDuvidasFrequentes from "../components/BotaoCadastroDuvidasFrequentes";
import TabelaDuvidasFrequentes from "../components/TabelaDuvidasFrequentes";
import { formatarDuvidasParaTabela } from "../components/TabelaDuvidasFrequentes/helpers";
import ModalGenerico from "src/components/Shareable/ModalGenerico";
import "./style.scss";

const ITENS_POR_PAGINA = 10;

const ListagemDuvidasFrequentes = () => {
  const [duvidas, setDuvidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalDuvidas, setTotalDuvidas] = useState(0);
  const [duvidaSelecionada, setDuvidaSelecionada] = useState(null);
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const navegar = useNavigate();

  const buscarDuvidas = useCallback(async () => {
    setCarregando(true);

    const parametros = {
      page: paginaAtual,
      page_size: ITENS_POR_PAGINA,
      ordering: "-criado_em",
    };

    try {
      const resposta = await listarPerguntasFrequentes(parametros);
      const dados = resposta.data;

      setDuvidas(formatarDuvidasParaTabela(dados.results || dados));
      setTotalDuvidas(dados.count ?? dados.length);
    } catch {
      setDuvidas([]);
      setTotalDuvidas(0);
      toastError("Não foi possível carregar as dúvidas frequentes.");
    } finally {
      setCarregando(false);
    }
  }, [paginaAtual]);

  const abrirModalExclusao = (duvida) => {
    setDuvidaSelecionada(duvida);
    setExibirModalExclusao(true);
  };

  useEffect(() => {
    buscarDuvidas();
  }, [buscarDuvidas]);

  const editarDuvida = (duvida) => {
    navegar(
      `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}/${duvida.uuid}/${EDITAR_DUVIDA_FREQUENTE}`,
    );
  };

  const confirmarExclusao = async () => {
    if (!duvidaSelecionada || excluindo) {
      return;
    }

    setExcluindo(true);

    try {
      await excluirPerguntaFrequente(duvidaSelecionada.uuid);

      setExibirModalExclusao(false);
      setDuvidaSelecionada(null);

      toastSuccess("Dúvida Excluída com Sucesso!");

      if (duvidas.length === 1 && paginaAtual > 1) {
        setPaginaAtual((pagina) => pagina - 1);
        return;
      }

      await buscarDuvidas();
    } catch {
      toastError("Houve um erro ao excluir a dúvida");
    } finally {
      setExcluindo(false);
    }
  };

  const fecharModalExclusao = () => {
    setExibirModalExclusao(false);
    setDuvidaSelecionada(null);
  };

  return (
    <>
      <div className="pagina-listagem-duvidas-frequentes">
        <div className="acao-cadastro-duvida">
          <BotaoCadastrarDuvidasFrequentes />
        </div>

        <h2 className="titulo-listagem-duvidas">
          Dúvidas Frequentes Cadastradas
        </h2>

        {carregando ? (
          <div className="carregamento-listagem-duvidas">
            <SigpaeLogoLoader />
          </div>
        ) : duvidas.length > 0 ? (
          <>
            <TabelaDuvidasFrequentes
              duvidas={duvidas}
              aoEditar={editarDuvida}
              aoExcluir={abrirModalExclusao}
            />

            {totalDuvidas > ITENS_POR_PAGINA && (
              <Paginacao
                current={paginaAtual}
                pageSize={ITENS_POR_PAGINA}
                total={totalDuvidas}
                onChange={setPaginaAtual}
              />
            )}
          </>
        ) : (
          <>
            <p className="sem-duvidas-cadastradas">
              Ainda não há dúvidas frequentes cadastradas. Utilize o botão
              &quot;Cadastrar Dúvidas Frequentes&quot; para realizar o primeiro
              cadastro.
            </p>
            <TabelaDuvidasFrequentes
              duvidas={duvidas}
              aoEditar={editarDuvida}
              aoExcluir={abrirModalExclusao}
            />
          </>
        )}
      </div>
      <ModalGenerico
        show={exibirModalExclusao}
        titulo="Excluir Dúvida"
        texto={
          <>
            <span className="d-block">
              Ao excluir a Dúvida, todas as questões vinculadas serão removidas.
            </span>
            <span className="d-block">Deseja realmente excluir a Dúvida?</span>
          </>
        }
        handleClose={fecharModalExclusao}
        handleSim={confirmarExclusao}
        loading={excluindo}
      />
    </>
  );
};

export default ListagemDuvidasFrequentes;
