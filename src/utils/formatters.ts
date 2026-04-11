export const formatCurrency = (value: number): string => {
  const absoluteValue = Math.abs(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return `${value < 0 ? '-' : ''}R$ ${absoluteValue}`;
};
