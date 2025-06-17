import React from "react";
import { render } from "@testing-library/react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

describe("chart.js setup", () => {
  it("deve registrar os componentes do Chart.js sem erro", () => {
    expect(() => {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
    }).not.toThrow();
  });

  it("deve renderizar um componente React com Chart.js importado sem quebrar", () => {
    const FakeComponent = () => <div>Chart.js test</div>;
    const { getByText } = render(<FakeComponent />);
    expect(getByText("Chart.js test")).toBeInTheDocument();
  });
});
