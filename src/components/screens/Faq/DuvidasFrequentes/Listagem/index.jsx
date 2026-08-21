import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paginacao } from "src/components/Shareable/Paginacao";
import { SigpaeLogoLoader } from "src/components/Shareable/SigpaeLogoLoader";
import { toastError } from "src/components/Shareable/Toast/dialogs";
import {
  AJUDA,
  CADASTRO_DUVIDAS_FREQUENTES,
  EDITAR_DUVIDA_FREQUENTE,
} from "src/configs/constants";
import { listarPerguntasFrequentes } from "src/services/faq.service";
import BotaoCadastrarDuvidasFrequentes from "../components/BotaoCadastroDuvidasFrequentes";
import TabelaDuvidasFrequentes from "../components/TabelaDuvidasFrequentes";
import { formatarDuvidasParaTabela } from "../components/TabelaDuvidasFrequentes/helpers";
import "./style.scss";

const ITENS_POR_PAGINA = 10;

const ListagemDuvidasFrequentes = () => {
  const [duvidas, setDuvidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalDuvidas, setTotalDuvidas] = useState(0);
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

  useEffect(() => {
    buscarDuvidas();
  }, [buscarDuvidas]);

  const editarDuvida = (duvida) => {
    navegar(
      `/${AJUDA}/${CADASTRO_DUVIDAS_FREQUENTES}/${duvida.uuid}/${EDITAR_DUVIDA_FREQUENTE}`,
    );
  };

  return (
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
          <TabelaDuvidasFrequentes duvidas={duvidas} aoEditar={editarDuvida} />

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
          <TabelaDuvidasFrequentes duvidas={duvidas} aoEditar={editarDuvida} />
        </>
      )}
    </div>
  );
};

export default ListagemDuvidasFrequentes;
