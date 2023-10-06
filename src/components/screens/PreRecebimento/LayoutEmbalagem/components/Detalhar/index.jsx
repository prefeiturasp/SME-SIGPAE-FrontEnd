import React, { useEffect, useState, useContext } from "react";
import { Spin } from "antd";
import "./styles.scss";
import { LAYOUT_EMBALAGEM, PRE_RECEBIMENTO } from "configs/constants";
import { useHistory } from "react-router-dom";
import BotaoVoltar from "components/Shareable/Page/BotaoVoltar";
import { detalharLayoutEmabalagem } from "services/layoutEmbalagem.service";
import { TextArea } from "components/Shareable/TextArea/TextArea";
import BotaoAnexo from "./components/BotaoAnexo";
import Botao from "components/Shareable/Botao";
import {
  BUTTON_TYPE,
  BUTTON_STYLE,
} from "components/Shareable/Botao/constants";
import { Field, Form } from "react-final-form";
import MeusDadosContext from "context/MeusDadosContext";
import moment from "moment";
import { textAreaRequired } from "helpers/fieldValidators";
import ModalCancelarCorrecao from "./components/ModalCancelarCorrecao";

export default ({ analise }) => {
  const history = useHistory();
  const { meusDados } = useContext(MeusDadosContext);
  const [carregando, setCarregando] = useState(true);
  const [objeto, setObjeto] = useState({});
  const [embalagemPrimaria, setEmbalagemPrimaria] = useState([]);
  const [embalagemSecundaria, setEmbalagemSecundaria] = useState([]);
  const [embalagemTerciaria, setEmbalagemTerciaria] = useState([]);
  const [aprovacoes, setAprovacoes] = useState([]);
  const [modais, setModais] = useState([]);

  const voltarPagina = () =>
    history.push(`/${PRE_RECEBIMENTO}/${LAYOUT_EMBALAGEM}`);

  const carregarDados = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const response = await detalharLayoutEmabalagem(uuid);

    setObjeto(response.data);
    setEmbalagemPrimaria(obterImagensEmbalagem(response, "PRIMARIA"));
    setEmbalagemSecundaria(obterImagensEmbalagem(response, "SECUNDARIA"));
    setEmbalagemTerciaria(obterImagensEmbalagem(response, "TERCIARIA"));
  };

  const obterImagensEmbalagem = (response, tipo_embalagem) => {
    return response.data.tipos_de_embalagens
      .filter((e) => e.tipo_embalagem === tipo_embalagem)
      .map((e) => e.imagens)
      .flat();
  };

  const changeModal = (index, value) => {
    let newModais = [...modais];
    newModais[index] = value;
    setModais(newModais);
  };

  const changeAprovacoes = (index, value) => {
    let newAprovacoes = [...aprovacoes];
    newAprovacoes[index] = value;
    setAprovacoes(newAprovacoes);
  };

  const retornaTextoAprovacao = (index, values) => {
    if (aprovacoes[index] === true) {
      let texto = values[`justificativa_${index}`].split("|");
      return (
        <div className="col-7">
          <div className="subtitulo row ml-5">
            <div className="w-5">
              <i className="fas fa-check mr-2" />
            </div>
            <div className="w-95">
              <div>{texto[0]}</div>
              <div>{texto[1]}</div>
            </div>
          </div>
        </div>
      );
    } else if (aprovacoes[index] === false) {
      return (
        <div className="col-7">
          <Field
            component={TextArea}
            label="Correções Necessárias"
            name={`justificativa_${index}`}
            placeholder="Qual a sua observação para essa decisão?"
            required
            validate={textAreaRequired}
          />
          <Botao
            texto="Salvar Considerações"
            type={BUTTON_TYPE.SUBMIT}
            style={BUTTON_STYLE.GREEN}
            className="float-right ml-3"
          />

          <Botao
            texto="Cancelar"
            type={BUTTON_TYPE.BUTTON}
            style={BUTTON_STYLE.GREEN_OUTLINE}
            className="float-right ml-3"
            onClick={() => {
              changeModal(index, true);
            }}
          />

          <ModalCancelarCorrecao
            show={modais[index]}
            handleClose={() => {
              changeModal(index, false);
            }}
            cancelar={() => {
              aprovacoes[index] = undefined;
              values[`justificativa_${index}`] = "";
            }}
          />
        </div>
      );
    }
  };

  const retornaBotoesAprovacao = (index, values) => {
    return (
      <div className="mt-4">
        <Botao
          texto="Aprovar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN}
          icon="fas fa-check"
          onClick={() => {
            changeAprovacoes(index, true);
            values[
              `justificativa_${index}`
            ] = `Embalagem Aprovada em ${moment().format(
              "DD/MM/YYYY - HH:mm"
            )}\n|Por: ${meusDados.nome}`;
          }}
          disabled={aprovacoes[index] !== undefined}
        />

        <Botao
          texto="Reprovar"
          type={BUTTON_TYPE.BUTTON}
          style={BUTTON_STYLE.GREEN_OUTLINE}
          icon="fas fa-times"
          className="ml-4"
          onClick={() => {
            changeAprovacoes(index, false);
            values[`justificativa_${index}`] = "";
          }}
          disabled={aprovacoes[index] === false}
        />
      </div>
    );
  };

  useEffect(() => {
    setCarregando(true);

    carregarDados();

    setCarregando(false);
  }, []);

  return (
    <Spin tip="Carregando..." spinning={carregando}>
      <div className="card mt-3 card-detalhar-layout-embalagem">
        <div className="card-body">
          <div className="subtitulo mb-3">Dados do Produto</div>
          <div className="row mt-3">
            <div className="col-4">
              <label className="label-dados-produto">Nº do Cronograma</label>
            </div>
            <div className="col-4">
              <label className="label-dados-produto">
                Nº do Pregão/Chamada Pública
              </label>
            </div>
            <div className="col-4">
              <label className="label-dados-produto">
                {analise ? "Data do Cadastro" : "Nome do Produto"}
              </label>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-4">
              <span className="valor-dados-produto">
                {objeto.numero_cronograma}
              </span>
            </div>
            <div className="col-4">
              <span className="valor-dados-produto">
                {objeto.pregao_chamada_publica}
              </span>
            </div>
            <div className="col-4">
              <span className="valor-dados-produto">
                {analise && objeto.criado_em
                  ? objeto.criado_em.split(" ")[0]
                  : objeto.nome_produto}
              </span>
            </div>
          </div>

          {analise && (
            <>
              <hr />
              <p>Empresa:</p>
              <p className="font-weight-bold">{objeto.nome_empresa}</p>
              <p>Produto:</p>
              <p className="font-weight-bold">{objeto.nome_produto}</p>

              {objeto.observacoes && (
                <>
                  <hr />
                  <div className="row mb-3">
                    <div className="col-12">
                      <TextArea
                        label="Observações do Fornecedor"
                        input={{ value: objeto.observacoes }}
                        disabled
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          <hr />

          <Form
            onSubmit={() => {}}
            initialValues={{}}
            render={({ handleSubmit, values }) => (
              <form onSubmit={handleSubmit}>
                <div className="subtitulo mb-3">Embalagem Primária</div>
                <div className="row">
                  <div className="col-5">
                    {embalagemPrimaria.map((e) => (
                      <div className="w-75" key={e.arquivo}>
                        <BotaoAnexo urlAnexo={e.arquivo} />
                      </div>
                    ))}
                    {retornaBotoesAprovacao(0, values)}
                  </div>
                  {retornaTextoAprovacao(0, values)}
                </div>

                <hr />

                <div className="subtitulo mb-3">Embalagem Secundária</div>
                <div className="row">
                  <div className="col-5">
                    {embalagemSecundaria.map((e) => (
                      <div className="w-75" key={e.arquivo}>
                        <BotaoAnexo urlAnexo={e.arquivo} />
                      </div>
                    ))}
                    {retornaBotoesAprovacao(1, values)}
                  </div>
                  {retornaTextoAprovacao(1, values)}
                </div>

                {embalagemTerciaria.length > 0 && (
                  <>
                    <hr />

                    <div className="subtitulo mb-3">Embalagem Terciária</div>
                    <div className="row">
                      <div className="col-5">
                        {embalagemTerciaria.map((e) => (
                          <div className="w-75" key={e.arquivo}>
                            <BotaoAnexo urlAnexo={e.arquivo} />
                          </div>
                        ))}
                        {retornaBotoesAprovacao(2, values)}
                      </div>
                      {retornaTextoAprovacao(2, values)}
                    </div>
                  </>
                )}

                {!analise && objeto.observacoes && (
                  <>
                    <hr />
                    <div className="row mb-3">
                      <div className="col-12">
                        <TextArea
                          label="Observações"
                          input={{ value: objeto.observacoes }}
                          disabled
                        />
                      </div>
                    </div>
                  </>
                )}

                <hr />

                <BotaoVoltar onClick={voltarPagina} />
              </form>
            )}
          />
        </div>
      </div>
    </Spin>
  );
};
