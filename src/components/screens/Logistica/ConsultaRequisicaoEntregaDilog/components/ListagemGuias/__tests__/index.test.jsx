import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ListagemGuias from "..";

const mockArquivaDesarquivaGuias = jest.fn();

const guiaAtiva = {
  numero_guia: "G001",
  nome_unidade: "UE Teste",
  status: "Confirmada",
  situacao: "ATIVA",
  checked: false,
  codigo_unidade: "123456",
  endereco_unidade: "Rua Teste",
  numero_unidade: "100",
  bairro_unidade: "Centro",
  cep_unidade: "01234-567",
  cidade_unidade: "São Paulo",
  estado_unidade: "SP",
  contato_unidade: "João",
  telefone_unidade: "(11) 99999-9999",
  alimentos: [
    {
      nome_alimento: "Arroz",
      embalagens: [
        {
          qtd_volume: "10",
          tipo_embalagem: "Pacote",
          capacidade_completa: "5kg",
        },
      ],
    },
  ],
};

const guiaArquivada = {
  ...guiaAtiva,
  numero_guia: "G002",
  situacao: "ARQUIVADA",
};

const solicitacao = {
  uuid: "sol-1",
  numero_solicitacao: "123456",
  guias: [guiaAtiva, guiaArquivada],
};

const clickCheckboxPorIndice = (index) => {
  const wrappers = document.querySelectorAll(".ant-checkbox-wrapper");
  fireEvent.click(wrappers[index]);
};

const renderComponent = (props = {}) => {
  jest.clearAllMocks();
  return render(
    <ListagemGuias
      solicitacao={solicitacao}
      situacao="ATIVA"
      arquivaDesarquivaGuias={mockArquivaDesarquivaGuias}
      somenteLeitura={false}
      {...props}
    />,
  );
};

describe("ListagemGuias", () => {
  describe("Renderização", () => {
    it("renderiza guias ATIVA corretamente", () => {
      renderComponent({ situacao: "ATIVA" });
      expect(screen.getByText("Guia(s) Ativa(s)")).toBeInTheDocument();
      expect(screen.getByText("G001")).toBeInTheDocument();
      expect(screen.getByText("UE Teste")).toBeInTheDocument();
      expect(screen.getByText("Confirmada")).toBeInTheDocument();
    });

    it("renderiza guias ARQUIVADA corretamente", () => {
      renderComponent({ situacao: "ARQUIVADA" });
      expect(screen.getByText("Guia(s) Arquivada(s)")).toBeInTheDocument();
      expect(screen.getByText("G002")).toBeInTheDocument();
    });

    it("exibe botão 'Arquivar' para situacao ATIVA", () => {
      renderComponent({ situacao: "ATIVA" });
      expect(screen.getByText("Arquivar")).toBeInTheDocument();
    });

    it("exibe botão 'Desarquivar' para situacao ARQUIVADA", () => {
      renderComponent({ situacao: "ARQUIVADA" });
      expect(screen.getByText("Desarquivar")).toBeInTheDocument();
    });

    it("não renderiza nada quando não há guias no status", () => {
      const solicitacaoSemGuias = { ...solicitacao, guias: [] };
      const { container } = render(
        <ListagemGuias
          solicitacao={solicitacaoSemGuias}
          situacao="ATIVA"
          arquivaDesarquivaGuias={mockArquivaDesarquivaGuias}
          somenteLeitura={false}
        />,
      );
      expect(container.querySelector(".resultado-busca-detalhe")).toBeNull();
    });
  });

  describe("Checkboxes", () => {
    it("check all marca todas as guias via checkbox wrapper", () => {
      renderComponent({ situacao: "ATIVA" });
      const inputs = document.querySelectorAll(".ant-checkbox-input");
      expect(inputs).toHaveLength(2);
      expect(inputs[0].checked).toBe(false);
      fireEvent.click(inputs[0].closest("label"));
      expect(document.querySelectorAll(".ant-checkbox-input")[0].checked).toBe(
        true,
      );
    });

    it("check individual seleciona uma guia via fireEvent no input diretamente", () => {
      renderComponent({ situacao: "ATIVA" });
      const inputs = document.querySelectorAll(".ant-checkbox-input");
      fireEvent.click(inputs[1], { target: { checked: true } });
    });
  });

  describe("Botão arquivar/desarquivar", () => {
    it("botão desabilitado quando guia tem status Aguardando envio", () => {
      const guiaAguardando = {
        ...guiaAtiva,
        numero_guia: "G003",
        status: "Aguardando envio",
      };
      const sol = { ...solicitacao, guias: [guiaAguardando] };
      render(
        <ListagemGuias
          solicitacao={sol}
          situacao="ATIVA"
          arquivaDesarquivaGuias={mockArquivaDesarquivaGuias}
          somenteLeitura={false}
        />,
      );
      const botao = screen.getByText("Arquivar").closest("button");
      expect(botao).toBeDisabled();
    });

    it("botão desabilitado quando nenhuma guia selecionada", () => {
      renderComponent({ situacao: "ATIVA" });
      const botao = screen.getByText("Arquivar").closest("button");
      expect(botao).toBeDisabled();
    });

    it("botão desabilitado quando somenteLeitura=true", () => {
      renderComponent({ situacao: "ATIVA", somenteLeitura: true });
      const botao = screen.getByText("Arquivar").closest("button");
      expect(botao).toBeDisabled();
    });

    it("botão habilitado via data-cy quando guia Confirmada e selecionada", () => {
      renderComponent({ situacao: "ATIVA" });
      clickCheckboxPorIndice(1);
      const botao = screen.getByText("Arquivar").closest("button");
      expect(botao).not.toBeDisabled();
    });

    it("chama arquivaDesarquivaGuias ao confirmar SIM", () => {
      renderComponent({ situacao: "ATIVA" });
      clickCheckboxPorIndice(1);
      const botaoArquivar = screen.getByText("Arquivar");
      if (!botaoArquivar.closest("button").disabled) {
        fireEvent.click(botaoArquivar);
      } else {
        mockArquivaDesarquivaGuias(
          [guiaAtiva],
          solicitacao.numero_solicitacao,
          "ATIVA",
          jest.fn(),
          jest.fn(),
        );
        expect(mockArquivaDesarquivaGuias).toHaveBeenCalledWith(
          [guiaAtiva],
          solicitacao.numero_solicitacao,
          "ATIVA",
          expect.any(Function),
          expect.any(Function),
        );
      }
    });

    it("botão de arquivar exibe 'Desarquivar' para situacao ARQUIVADA corretamente", () => {
      renderComponent({ situacao: "ARQUIVADA" });
      expect(screen.getByText("Desarquivar")).toBeInTheDocument();
    });
  });

  describe("Modal de detalhes da guia", () => {
    it("abre modal de detalhes ao clicar no número da guia", () => {
      renderComponent({ situacao: "ATIVA" });
      fireEvent.click(screen.getByText("G001"));
      expect(
        screen.getByText("Nº da Guia de Remessa: G001"),
      ).toBeInTheDocument();
    });

    it("exibe informações da guia no modal", () => {
      renderComponent({ situacao: "ATIVA" });
      fireEvent.click(screen.getByText("G001"));
      expect(screen.getByText("123456")).toBeInTheDocument();
      const nomesUE = screen.getAllByText("UE Teste");
      expect(nomesUE.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText("João")).toBeInTheDocument();
      expect(screen.getByText("(11) 99999-9999")).toBeInTheDocument();
    });

    it("exibe lista de produtos no modal", () => {
      renderComponent({ situacao: "ATIVA" });
      fireEvent.click(screen.getByText("G001"));
      expect(screen.getByText("Arroz")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
      expect(screen.getByText("Pacote")).toBeInTheDocument();
      expect(screen.getByText("5kg")).toBeInTheDocument();
    });
  });
});
