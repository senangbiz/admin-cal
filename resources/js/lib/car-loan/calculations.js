export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const formatNumberWithCommas = (value) => {
  const num = String(value).replace(/,/g, '')
  if (num === '') return ''
  const parsed = parseFloat(num)
  if (Number.isNaN(parsed)) return value
  return parsed.toLocaleString('en-US')
}

export const normalizeCurrencyInput = (value, defaultZero = false) => {
  const cleanValue = String(value).replace(/,/g, '')
  if (cleanValue === '' && defaultZero) {
    return '0'
  }
  return cleanValue
}

export const calculatePrincipal = (loanAmount, downPayment, rebateAmount) =>
  parseFloat(loanAmount || '0') -
  parseFloat(downPayment || '0') -
  parseFloat(rebateAmount || '0')

export const calculateTotals = (principal, interestRate, tenureYears) => {
  if (principal <= 0 || tenureYears <= 0) {
    return {
      monthlyPayment: 0,
      totalLoanAmount: 0,
      totalInterest: 0,
    }
  }

  const interest = principal * interestRate * tenureYears
  const totalLoanAmount = principal + interest
  const numberOfPayments = tenureYears * 12
  const monthlyPayment = totalLoanAmount / numberOfPayments

  return { monthlyPayment, totalLoanAmount, totalInterest: interest }
}
