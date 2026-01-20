import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputErroMensagemCKEditor from "src/components/Shareable/Input/InputErroMensagemCKEditor";

// Mock do arquivo SCSS
jest.mock(
  "src/components/Shareable/Input/InputErroMensagemCKEditor/style.scss",
  () => ({}),
);

describe("Teste do componente InputErroMensagemCKEditor", () => {
  describe("Quando touched é false", () => {
    it("não deve renderizar mensagem alguma", () => {
      const props = {
        meta: { error: "Erro de teste", warning: "Aviso de teste" },
        touched: false,
      };

      const { container } = render(<InputErroMensagemCKEditor {...props} />);

      expect(container.firstChild).toBeEmptyDOMElement();
      expect(screen.queryByText("Erro de teste")).not.toBeInTheDocument();
      expect(screen.queryByText("Aviso de teste")).not.toBeInTheDocument();
    });

    it("não deve renderizar mesmo com meta vazia", () => {
      const props = {
        meta: {},
        touched: false,
      };

      const { container } = render(<InputErroMensagemCKEditor {...props} />);
      expect(container.firstChild).toBeEmptyDOMElement();
    });
  });

  describe("Quando touched é true", () => {
    describe("Com erro", () => {
      it("deve renderizar mensagem de erro quando há erro", () => {
        const errorMessage = "Campo obrigatório";
        const props = {
          meta: { error: errorMessage },
          touched: true,
        };

        render(<InputErroMensagemCKEditor {...props} />);

        const errorElement = screen.getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveClass("error-message");
      });

      it("deve ter a estrutura correta para mensagem de erro", () => {
        const errorMessage = "Email inválido";
        const props = {
          meta: { error: errorMessage },
          touched: true,
        };

        const { container } = render(<InputErroMensagemCKEditor {...props} />);

        const containerDiv = container.querySelector(
          ".error-or-warning-message",
        );
        expect(containerDiv).toBeInTheDocument();

        const errorDiv = containerDiv.querySelector(".error-message");
        expect(errorDiv).toBeInTheDocument();
        expect(errorDiv).toHaveTextContent(errorMessage);
      });

      it("deve priorizar erro sobre warning quando ambos existem", () => {
        const props = {
          meta: {
            error: "Erro prioritário",
            warning: "Este aviso não deve aparecer",
          },
          touched: true,
        };

        render(<InputErroMensagemCKEditor {...props} />);

        expect(screen.getByText("Erro prioritário")).toBeInTheDocument();
        expect(
          screen.queryByText("Este aviso não deve aparecer"),
        ).not.toBeInTheDocument();
      });
    });

    describe("Com warning (sem erro)", () => {
      it("deve renderizar mensagem de warning quando há warning mas não há erro", () => {
        const warningMessage = "Preencha com cuidado";
        const props = {
          meta: { warning: warningMessage },
          touched: true,
        };

        render(<InputErroMensagemCKEditor {...props} />);

        const warningElement = screen.getByText(warningMessage);
        expect(warningElement).toBeInTheDocument();
        expect(warningElement).toHaveClass("warning-message");
      });

      it("deve ter a estrutura correta para mensagem de warning", () => {
        const warningMessage = "Campo opcional";
        const props = {
          meta: { warning: warningMessage },
          touched: true,
        };

        const { container } = render(<InputErroMensagemCKEditor {...props} />);

        const containerDiv = container.querySelector(
          ".error-or-warning-message",
        );
        expect(containerDiv).toBeInTheDocument();

        const warningDiv = containerDiv.querySelector(".warning-message");
        expect(warningDiv).toBeInTheDocument();
        expect(warningDiv).toHaveTextContent(warningMessage);
      });
    });

    describe("Sem erro nem warning", () => {
      it("não deve renderizar mensagem quando meta está vazia", () => {
        const props = {
          meta: {},
          touched: true,
        };

        const { container } = render(<InputErroMensagemCKEditor {...props} />);
        expect(container.firstChild).toBeEmptyDOMElement();
      });

      it("não deve renderizar mensagem quando meta é null", () => {
        const props = {
          meta: null,
          touched: true,
        };

        const { container } = render(<InputErroMensagemCKEditor {...props} />);
        expect(container.firstChild).toBeEmptyDOMElement();
      });

      it("não deve renderizar mensagem quando meta é undefined", () => {
        const props = {
          touched: true,
        };

        const { container } = render(<InputErroMensagemCKEditor {...props} />);
        expect(container.firstChild).toBeEmptyDOMElement();
      });
    });
  });

  describe("Tratamento de casos especiais", () => {
    it("deve lidar com strings vazias como mensagens", () => {
      const props = {
        meta: { error: "", warning: "" },
        touched: true,
      };

      const { container } = render(<InputErroMensagemCKEditor {...props} />);

      const errorDiv = container.querySelector(".error-message");
      const warningDiv = container.querySelector(".warning-message");

      expect(errorDiv).not.toBeInTheDocument();
      expect(warningDiv).not.toBeInTheDocument();
      expect(container.firstChild).toBeEmptyDOMElement();
    });

    it("deve lidar com mensagens complexas (HTML, caracteres especiais)", () => {
      const complexMessage = 'Erro: campo <obrigatório> & "importante"';
      const props = {
        meta: { error: complexMessage },
        touched: true,
      };

      render(<InputErroMensagemCKEditor {...props} />);

      const errorElement = screen.getByText(complexMessage);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toBe(complexMessage);
    });

    it("deve lidar com mensagens longas", () => {
      const longMessage =
        "Este é um erro muito longo que ocupa várias linhas e precisa ser tratado corretamente pelo componente sem quebrar o layout da página.";
      const props = {
        meta: { error: longMessage },
        touched: true,
      };

      render(<InputErroMensagemCKEditor {...props} />);

      const errorElement = screen.getByText(longMessage);
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toBe(longMessage);
    });
  });

  describe("Testes de acessibilidade", () => {
    it("deve usar classes CSS apropriadas para diferenciação visual", () => {
      const props = {
        meta: { error: "Erro", warning: "Aviso" },
        touched: true,
      };

      const { container } = render(<InputErroMensagemCKEditor {...props} />);

      const errorDiv = container.querySelector(".error-message");
      expect(errorDiv).toBeInTheDocument();
      expect(errorDiv).toHaveClass("error-message");
    });

    it("deve ter contêiner com classe semântica", () => {
      const props = {
        meta: { error: "Erro" },
        touched: true,
      };

      const { container } = render(<InputErroMensagemCKEditor {...props} />);

      const containerDiv = container.querySelector(".error-or-warning-message");
      expect(containerDiv).toBeInTheDocument();
    });
  });
});
