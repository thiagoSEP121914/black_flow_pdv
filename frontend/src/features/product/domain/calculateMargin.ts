const calculateMargin = (salePrice: number, costPrice: number) => {
  if (salePrice <= 0 || costPrice <= 0) {
    return 0;
  }

  return (salePrice - costPrice) / salePrice;
};

export default calculateMargin;
