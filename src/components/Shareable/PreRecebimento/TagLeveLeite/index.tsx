import React from "react";
import "./styles.scss";

interface TagLeveLeiteProps {
  className?: string;
}

const TagLeveLeite: React.FC<TagLeveLeiteProps> = ({ className = "" }) => {
  return (
    <span className={`tag-leve-leite ${className}`}>LEVE LEITE - PLL</span>
  );
};

export default TagLeveLeite;
