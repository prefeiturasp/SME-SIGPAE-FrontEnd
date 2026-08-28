import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Listagem } from "../index";

const relatorio = {
  uuid: "6af4139c-b02d-46f4-9b6e-bb73e7b58623",
  diretoria_regional: "DRE Butantã",
  unidade_educacional: "EMEF Teste",
  data: "25/08/2026",
  status: "Enviado para CODAE",
};

const propriedades = {
  objetos: [relatorio],
  perfilNutriSupervisao: false,
  getDashboardPainelGerencialSupervisaoAsync: jest.fn(),
  buscarResultados: jest.fn(),
  filtros: {},
  pagina: 1,
};

describe("Ações da listagem de relatórios", () => {
  it("exibe o botão de visualização quando o usuário possui permissão", () => {
    render(
      <MemoryRouter>
        <Listagem {...propriedades} podeVisualizarRelatorio />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/supervisao/terceirizadas/relatorio-fiscalizacao-terceirizadas/detalhar-relatorio-fiscalizacao?uuid=${relatorio.uuid}`,
    );
  });

  it("não exibe o botão de visualização sem permissão", () => {
    render(
      <MemoryRouter>
        <Listagem {...propriedades} podeVisualizarRelatorio={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
