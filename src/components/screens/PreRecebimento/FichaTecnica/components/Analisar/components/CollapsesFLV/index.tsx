import React from "react";
import { Field } from "react-final-form";
import InputText from "src/components/Shareable/Input/InputText";
import { TextArea } from "src/components/Shareable/TextArea/TextArea";
import Collapse, { CollapseControl } from "src/components/Shareable/Collapse";
import BotaoAnexo from "src/components/PreRecebimento/BotaoAnexo";
import FormAprovacao from "../FormAprovacao";
import BotaoCiente from "../BotaoCiente";
import FormProponente from "../../../Cadastrar/components/FormProponente";
import FormFabricante from "../../../Cadastrar/components/FormFabricante";
import FormPereciveisENaoPereciveis from "../../../Cadastrar/components/FormPereciveisENaoPereciveis";
import { FichaTecnicaDetalhadaComAnalise } from "src/interfaces/pre_recebimento.interface";
import { StateConferidosAnalise } from "../../../../interfaces";
import { TerceirizadaComEnderecoInterface } from "src/interfaces/terceirizada.interface";

interface CollapsesPadraoProps {
  idCollapse: string;
  collapse: CollapseControl;
  setCollapse: any;
  collapseConfigs: { [key: string]: {} }[];
  conferidos: StateConferidosAnalise;
  ficha: FichaTecnicaDetalhadaComAnalise;
  values: any;
  somenteLeitura: boolean;
  proponente: TerceirizadaComEnderecoInterface;
  aprovaCollapse: () => void;
  reprovaCollapse: () => void;
}

export default ({
  idCollapse,
  collapse,
  setCollapse,
  collapseConfigs,
  conferidos,
  ficha,
  values,
  somenteLeitura,
  proponente,
  aprovaCollapse,
  reprovaCollapse,
}: CollapsesPadraoProps) => {
  return (
    <Collapse
      collapse={collapse}
      setCollapse={setCollapse}
      collapseConfigs={collapseConfigs}
      id={idCollapse}
      state={conferidos}
    >
      <section id="proponente">
        <div className="row">
          <div className="subtitulo">Proponente</div>
        </div>
        <FormProponente proponente={proponente} />
      </section>

      <section id="fabricante_envasador">
        {!conferidos.fabricante_envasador && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.fabricante_envasador_correcoes}
                disabled={true}
              />
            </div>
          </div>
        )}
        <FormFabricante
          fabricantesCount={
            [values[`fabricante_0`], values[`fabricante_1`]].filter(
              (fabricante) => fabricante,
            ).length
          }
          values={values}
          somenteLeitura={true}
        />
        {!somenteLeitura && (
          <FormAprovacao
            name={"fabricante_envasador"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="detalhes_produto">
        {!conferidos.detalhes_produto && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.detalhes_produto_correcoes}
                disabled={true}
              />
            </div>
          </div>
        )}
        <FormPereciveisENaoPereciveis values={values} desabilitar={true} />
        {!somenteLeitura && (
          <FormAprovacao
            name={"detalhes_produto"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="responsavel_tecnico">
        {!conferidos.responsavel_tecnico && (
          <div className="row campo-correcao mb-4">
            <div className="col-12">
              <TextArea
                label="Indicações de Correções CODAE"
                valorInicial={ficha?.analise?.responsavel_tecnico_correcoes}
                disabled={true}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col">
            <Field
              component={InputText}
              label="Nome completo do Responsável Técnico:"
              name={`nome_responsavel_tecnico`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-6">
            <Field
              component={InputText}
              label="Habilitação:"
              name={`habilitacao`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
          <div className="col-6">
            <Field
              component={InputText}
              label="Nº do Registro em Órgão Competente:"
              name={`numero_registro_orgao`}
              className="input-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4">
            <BotaoAnexo urlAnexo={ficha.arquivo} />
          </div>
        </div>
        {!somenteLeitura && (
          <FormAprovacao
            name={"responsavel_tecnico"}
            aprovaCollapse={aprovaCollapse}
            values={values}
            reprovaCollapse={reprovaCollapse}
          />
        )}
      </section>

      <section id="outras_informacoes">
        <div className="row">
          <div className="col">
            <Field
              component={TextArea}
              label="Informações Adicionais:"
              name={`informacoes_adicionais`}
              className="textarea-ficha-tecnica"
              disabled
            />
          </div>
        </div>
        {!somenteLeitura && (
          <BotaoCiente
            name={"outras_informacoes"}
            aprovaCollapse={aprovaCollapse}
            desabilitar={conferidos.outras_informacoes}
          />
        )}
      </section>
    </Collapse>
  );
};
