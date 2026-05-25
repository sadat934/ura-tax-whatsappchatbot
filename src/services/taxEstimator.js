export class TaxEstimator {
  estimate({ monthlyTurnover, taxTypes }) {
    const annualTurnover = Number(monthlyTurnover || 0) * 12;
    const normalizedTaxTypes = taxTypes.map((item) => item.toLowerCase());

    let annualTax = estimateIncomeTax(annualTurnover);

    if (normalizedTaxTypes.some((item) => item.includes('vat'))) {
      annualTax += annualTurnover * 0.18;
    }

    if (normalizedTaxTypes.some((item) => item.includes('withholding'))) {
      annualTax += annualTurnover * 0.06;
    }

    if (normalizedTaxTypes.some((item) => item.includes('paye'))) {
      annualTax += annualTurnover * 0.03;
    }

    return {
      annualTurnover,
      annualTax,
      monthlyTax: annualTax / 12,
    };
  }
}

function estimateIncomeTax(annualTurnover) {
  if (annualTurnover <= 10_000_000) return 0;
  if (annualTurnover <= 30_000_000) return annualTurnover * 0.01;
  if (annualTurnover <= 80_000_000) return annualTurnover * 0.02;
  return annualTurnover * 0.03;
}
