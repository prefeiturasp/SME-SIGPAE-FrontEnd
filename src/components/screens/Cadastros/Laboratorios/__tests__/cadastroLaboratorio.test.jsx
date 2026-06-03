import React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CadastroLaboratorio from "src/components/screens/Cadastros/Laboratorios/components/CadastroLaboratorio";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";
import {
  cadastraLaboratorio,
  getLaboratorio,
  getListaLaboratorios,
} from "src/services/laboratorio.service";
import { getEnderecoPorCEP } from "src/services/cep.service";
import preview from "jest-preview";
jest.mock("src/services/laboratorio.service");
jest.mock("src/services/cep.service");

describe("Testa o componente CadastroLaboratorio", () => {
  describe("Cadastro de laboratório", () => {
    beforeEach(async () => {
      jest.clearAllMocks();

      getListaLaboratorios.mockResolvedValue({
        data: {
          results: [
            {
              nome: "Laboratorio São Paulo",
              cnpj: "22345678000199",
            },
            {
              nome: "Laboratorio Rio de Janeiro",
              cnpj: "12345678000199",
            },
          ],
        },
        status: 200,
      });

      getEnderecoPorCEP.mockResolvedValue({
        status: 200,
        data: {
          cep: "20931-900",
          logradouro: "Rua General Gurjão",
          complemento: "2",
          unidade: "Ishikawagima do Brasil Estaleiros S/A",
          bairro: "Caju",
          localidade: "Rio de Janeiro",
          uf: "RJ",
          estado: "Rio de Janeiro",
          regiao: "Sudeste",
          ibge: "3304557",
          gia: "",
          ddd: "21",
          siafi: "6001",
        },
      });

      cadastraLaboratorio.mockResolvedValue({
        status: 201,
      });

      await act(async () => {
        render(
          <MemoryRouter>
            <CadastroLaboratorio />
            <ToastContainer />
          </MemoryRouter>,
        );
      });
    });

    it("deve renderizar os títulos principais", async () => {
      expect(
        await screen.findByText("Dados do Laboratório"),
      ).toBeInTheDocument();

      expect(screen.getByText("Endereço do Laboratório")).toBeInTheDocument();

      expect(screen.getByText("Contatos")).toBeInTheDocument();

      expect(screen.getByText("Laboratórios Credenciados")).toBeInTheDocument();
    });

    it("deve exibir os dados da secção Dados do Laboratório", async () => {
      expect(screen.getByText("Nome do Laboratório")).toBeInTheDocument();

      expect(screen.getByText("CNPJ do Laboratório")).toBeInTheDocument();

      expect(screen.getByText("Data de Cadastro")).toBeInTheDocument();
    });

    it("deve exibir os dados da secção Endereço do Laboratório", async () => {
      expect(screen.getByText("CEP")).toBeInTheDocument();

      expect(screen.getByText("Logradouro")).toBeInTheDocument();

      expect(screen.getByText("Número")).toBeInTheDocument();
      expect(screen.getByText("Complemento")).toBeInTheDocument();

      expect(screen.getByText("Bairro")).toBeInTheDocument();

      expect(screen.getByText("Cidade")).toBeInTheDocument();
      expect(screen.getByText("Estado")).toBeInTheDocument();
    });

    it("deve exibir os dados da secção Contatos", async () => {
      expect(screen.getByText("Nome")).toBeInTheDocument();

      expect(screen.getByText("Telefone")).toBeInTheDocument();

      expect(screen.getByText("E-mail")).toBeInTheDocument();
    });

    it("deve exibir os dados da secção Laboratórios Credenciados", async () => {
      expect(
        screen.getByText("Esse Laboratório está Credenciado?"),
      ).toBeInTheDocument();
      expect(screen.getByText("SIM")).toBeInTheDocument();
      expect(screen.getByText("NÃO")).toBeInTheDocument();
    });

    it("deve exibir mensagem quando selecionar não credenciado", async () => {
      const radioNao = await screen.findByText("NÃO");

      fireEvent.click(radioNao);

      expect(
        screen.getByText(/não poderá ser utilizado no cadastro de Laudos/i),
      ).toBeInTheDocument();
    });

    it("deve abrir modal de cancelamento", async () => {
      const botaoCancelar = await screen.findByRole("button", {
        name: "Cancelar",
      });

      fireEvent.click(botaoCancelar);

      expect(
        screen.getByText(/Cancelar Cadastro do Laboratório/i),
      ).toBeInTheDocument();
    });

    it("deve preencher endereço automaticamente ao informar CEP válido", async () => {
      const campoCep = screen.getByPlaceholderText("Digite o CEP");

      fireEvent.change(campoCep, {
        target: { value: "20931-900" },
      });

      await waitFor(() => {
        expect(getEnderecoPorCEP).toHaveBeenCalledWith("20931-900");
      });
    });

    it("deve habilitar edição manual quando CEP não for encontrado", async () => {
      getEnderecoPorCEP.mockResolvedValueOnce({
        status: 200,
        data: {
          erro: true,
        },
      });

      const campoCep = screen.getByPlaceholderText("Digite o CEP");

      fireEvent.change(campoCep, {
        target: { value: "99999-999" },
      });

      await waitFor(() => {
        expect(getEnderecoPorCEP).toHaveBeenCalled();
      });

      const logradouro = screen.getByPlaceholderText("Nome do Logradouro");

      await waitFor(() => {
        expect(logradouro).not.toBeDisabled();
      });
    });

    it("deve remover contato adicional", async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "+",
        }),
      );

      expect(screen.getAllByPlaceholderText("Nome do Contato")).toHaveLength(2);

      const botoes = screen.getAllByRole("button");
      const botaoExcluir = botoes.find((btn) => btn.querySelector(".fa-trash"));

      expect(botaoExcluir).toBeTruthy();
      fireEvent.click(botaoExcluir);
      await waitFor(() => {
        expect(screen.getAllByPlaceholderText("Nome do Contato")).toHaveLength(
          1,
        );
      });
    });

    it("deve fechar modal de cancelamento ao clicar em Não", async () => {
      fireEvent.click(
        screen.getByRole("button", {
          name: "Cancelar",
        }),
      );

      expect(
        screen.getByText(/Cancelar Cadastro do Laboratório/i),
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole("button", {
          name: "Não",
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/Cancelar Cadastro do Laboratório/i),
        ).not.toBeInTheDocument();
      });
    });

    it("deve abrir modal de confirmação ao salvar", async () => {
      fireEvent.change(
        screen.getByPlaceholderText("Digite o Nome do Laboratório"),
        { target: { value: "LAB TESTE" } },
      );

      fireEvent.change(
        screen.getByPlaceholderText("Digite o CNPJ do Laboratório"),
        { target: { value: "12.345.678/0001-99" } },
      );

      fireEvent.change(screen.getByPlaceholderText("Digite o CEP"), {
        target: { value: "20931-900" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Logradouro"), {
        target: { value: "Rua da Central" },
      });

      fireEvent.change(screen.getByPlaceholderText("Digite o número"), {
        target: { value: "123" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Bairro"), {
        target: { value: "Bairro da Central" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome da Cidade"), {
        target: { value: "Rio de Janeiro" },
      });
      fireEvent.change(screen.getByPlaceholderText("Nome do Estado"), {
        target: { value: "Rio de Janeiro" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Contato"), {
        target: { value: "João" },
      });

      fireEvent.change(screen.getByPlaceholderText("(00) 0000-00000"), {
        target: { value: "(11) 99999-9999" },
      });

      fireEvent.change(
        screen.getByPlaceholderText("Digite o E-mail do Contato"),
        { target: { value: "joao@email.com" } },
      );

      fireEvent.click(screen.getByText("SIM"));

      fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

      expect(
        screen.getByText(/Salvar Cadastro do Laboratório/i),
      ).toBeInTheDocument();
    });

    it("deve chamar cadastraLaboratorio ao confirmar", async () => {
      fireEvent.change(
        screen.getByPlaceholderText("Digite o Nome do Laboratório"),
        { target: { value: "LAB TESTE" } },
      );

      fireEvent.change(
        screen.getByPlaceholderText("Digite o CNPJ do Laboratório"),
        { target: { value: "12.345.678/0001-99" } },
      );

      fireEvent.change(screen.getByPlaceholderText("Digite o CEP"), {
        target: { value: "20931-900" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Logradouro"), {
        target: { value: "Rua da Central" },
      });

      fireEvent.change(screen.getByPlaceholderText("Digite o número"), {
        target: { value: "123" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Bairro"), {
        target: { value: "Bairro da Central" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome da Cidade"), {
        target: { value: "Rio de Janeiro" },
      });
      fireEvent.change(screen.getByPlaceholderText("Nome do Estado"), {
        target: { value: "Rio de Janeiro" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Contato"), {
        target: { value: "João" },
      });

      fireEvent.change(screen.getByPlaceholderText("(00) 0000-00000"), {
        target: { value: "(11) 99999-9999" },
      });

      fireEvent.change(
        screen.getByPlaceholderText("Digite o E-mail do Contato"),
        { target: { value: "joao@email.com" } },
      );

      fireEvent.click(screen.getByText("SIM"));

      fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

      fireEvent.click(
        screen.getByRole("button", {
          name: "Sim",
        }),
      );
      await waitFor(() => {
        expect(cadastraLaboratorio).toHaveBeenCalled();
      });
    });

    it("deve fechar modal de envio ao clicar em Não", async () => {
      fireEvent.change(
        screen.getByPlaceholderText("Digite o Nome do Laboratório"),
        { target: { value: "LAB TESTE" } },
      );

      fireEvent.change(
        screen.getByPlaceholderText("Digite o CNPJ do Laboratório"),
        { target: { value: "12.345.678/0001-99" } },
      );

      fireEvent.change(screen.getByPlaceholderText("Digite o CEP"), {
        target: { value: "20931-900" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Logradouro"), {
        target: { value: "Rua da Central" },
      });

      fireEvent.change(screen.getByPlaceholderText("Digite o número"), {
        target: { value: "123" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Bairro"), {
        target: { value: "Bairro da Central" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome da Cidade"), {
        target: { value: "Rio de Janeiro" },
      });
      fireEvent.change(screen.getByPlaceholderText("Nome do Estado"), {
        target: { value: "Rio de Janeiro" },
      });

      fireEvent.change(screen.getByPlaceholderText("Nome do Contato"), {
        target: { value: "João" },
      });

      fireEvent.change(screen.getByPlaceholderText("(00) 0000-00000"), {
        target: { value: "(11) 99999-9999" },
      });

      fireEvent.change(
        screen.getByPlaceholderText("Digite o E-mail do Contato"),
        { target: { value: "joao@email.com" } },
      );

      fireEvent.click(screen.getByText("SIM"));

      fireEvent.click(
        screen.getByRole("button", {
          name: "Salvar",
        }),
      );

      fireEvent.click(
        screen.getByRole("button", {
          name: "Não",
        }),
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/Salvar Cadastro do Laboratório/i),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe.only("Edição de laboratório", () => {
    const uuidLaboratorio = "41b140d4-580e-4783-999f-42beae4352a5";
    beforeEach(async () => {
      jest.clearAllMocks();

      getListaLaboratorios.mockResolvedValue({
        data: {
          results: [
            {
              nome: "Laboratorio São Paulo",
              cnpj: "22345678000199",
            },
            {
              nome: "Laboratorio Rio de Janeiro",
              cnpj: "12345678000199",
            },
          ],
        },
        status: 200,
      });

      getLaboratorio.mockResolvedValue({
        data: {
          contatos: [
            {
              nome: "JOSE",
              telefone: "11 232222323",
              email: "email@gmail.com",
            },
          ],
          criado_em: "26/07/2023 14:16:43",
          alterado_em: "26/07/2023 14:16:43",
          uuid: uuidLaboratorio,
          nome: "Laboratorio São Paulo",
          cnpj: "04060448000151",
          cep: "03311900",
          logradouro: "Rua Apucarana",
          numero: "22",
          complemento: "",
          bairro: "Tatuapé",
          cidade: "São Paulo",
          estado: "SP",
          credenciado: true,
        },
        status: 200,
      });

      getEnderecoPorCEP.mockResolvedValue({
        status: 200,
        data: {
          cep: "03311900",
          logradouro: "Rua Apucarana",
          complemento: "",
          unidade: "",
          bairro: "Tatuapé",
          localidade: "São Paulo",
          uf: "SP",
          estado: "São Paulo",
          regiao: "Sudeste",
          ibge: "3304557",
          gia: "",
          ddd: "21",
          siafi: "6001",
        },
      });

      const search = `?uuid=${uuidLaboratorio}`;
      window.history.pushState({}, "", search);
      await act(async () => {
        render(
          <MemoryRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <CadastroLaboratorio naoEditavel={true} />
            <ToastContainer />
          </MemoryRouter>,
        );
      });
    });

    it("deve renderizar os títulos principais", async () => {
      preview.debug();
    });
  });
});
