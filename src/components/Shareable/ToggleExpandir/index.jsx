import "./style.scss";

export const ToggleExpandir = (props) => {
  const { onClick, ativo, className, dataTestId } = props;
  return (
    <span
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={Boolean(ativo)}
      aria-label={ativo ? "Recolher" : "Expandir"}
      data-testid={dataTestId}
      className={`toggle-expandir ${className}`}
      data-cy="botao-expandir"
    >
      {ativo ? (
        <i className="fas fa-chevron-up" />
      ) : (
        <i className="fas fa-chevron-down" />
      )}
    </span>
  );
};
