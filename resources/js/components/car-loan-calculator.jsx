import { useEffect, useMemo, useState } from 'react'
import {
  calculatePrincipal,
  calculateTotals,
  formatCurrency,
  formatNumberWithCommas,
  normalizeCurrencyInput,
} from '@/lib/car-loan/calculations'
import { ClassicLayout, CompactLayout, SplitLayout } from '@/components/car-loan/designs'

const DEFAULT_APR = 2.3

function getWhatsappLink(phone) {
  if (!phone) return null
  const digitsOnly = String(phone).replace(/\D/g, '')
  if (!digitsOnly) return null
  const withoutLeadingZero = digitsOnly.startsWith('0') ? digitsOnly.slice(1) : digitsOnly
  const withCountry = withoutLeadingZero.startsWith('60') ? withoutLeadingZero : `60${withoutLeadingZero}`
  return `https://wa.me/${withCountry}`
}

export function CarLoanCalculator({
  agentBrands = [],
  carTypesByBrand = {},
  profileData = {},
  designStorageKey = 'loan-calc-design',
}) {
  const [selectedBrandId, setSelectedBrandId] = useState(null)
  const [loanAmount, setLoanAmount] = useState('50000')
  const [downPayment, setDownPayment] = useState('5000')
  const [rebateAmount, setRebateAmount] = useState('0')
  const [computedLoanAmount, setComputedLoanAmount] = useState(0)
  const [selectedCar, setSelectedCar] = useState('')
  const [selectedVariant, setSelectedVariant] = useState('')
  const [totalLoanAmount, setTotalLoanAmount] = useState(0)
  const [designMode, setDesignMode] = useState('classic')
  const [interestRatePercent, setInterestRatePercent] = useState(() =>
    Math.min(15, Math.max(1, Math.round(DEFAULT_APR)))
  )

  const effectiveBrandId = selectedBrandId ?? (agentBrands[0]?.id != null ? String(agentBrands[0].id) : null)

  const carTypes = useMemo(() => {
    if (!effectiveBrandId) return []
    return carTypesByBrand[effectiveBrandId] ?? carTypesByBrand[String(effectiveBrandId)] ?? []
  }, [effectiveBrandId, carTypesByBrand])

  const selectedBrand = useMemo(() => {
    if (effectiveBrandId == null) return agentBrands[0] ?? null
    return agentBrands.find((b) => String(b.id) === String(effectiveBrandId)) ?? agentBrands[0] ?? null
  }, [effectiveBrandId, agentBrands])

  const brandLogoUrl = selectedBrand?.logo_url ?? null
  const brandName = selectedBrand?.name ?? null

  const selectedCarData = useMemo(
    () => carTypes.find((car) => car.id === selectedCar || String(car.id) === String(selectedCar)),
    [carTypes, selectedCar],
  )

  const interestRate = useMemo(
    () => interestRatePercent / 100,
    [interestRatePercent],
  )

  useEffect(() => {
    const carApr = selectedCarData?.apr != null ? Number(selectedCarData.apr) : null
    const value =
      carApr != null && carApr >= 1 && carApr <= 15
        ? Math.round(carApr)
        : Math.min(15, Math.max(1, Math.round(DEFAULT_APR)))
    setInterestRatePercent(value)
  }, [selectedCar, selectedCarData?.apr])

  useEffect(() => {
    if (agentBrands.length && selectedBrandId == null && agentBrands[0]?.id != null) {
      setSelectedBrandId(String(agentBrands[0].id))
    }
  }, [agentBrands, selectedBrandId])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(designStorageKey)
      if (stored === 'classic' || stored === 'compact' || stored === 'split') {
        setDesignMode(stored)
      }
    } catch (_) {}
  }, [designStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(designStorageKey, designMode)
    } catch (_) {}
  }, [designMode, designStorageKey])

  useEffect(() => {
    const principal = calculatePrincipal(loanAmount, downPayment, rebateAmount)
    setComputedLoanAmount(principal)
    const totals = calculateTotals(principal, interestRate, 5)
    setTotalLoanAmount(totals.totalLoanAmount)
  }, [loanAmount, downPayment, rebateAmount, interestRate])

  useEffect(() => {
    const first = selectedCarData?.variants?.[0]
    if (first) {
      setSelectedVariant(first.id)
      setLoanAmount(String(first.otrPrice ?? first.price ?? 0))
    }
  }, [selectedCar, selectedCarData])

  useEffect(() => {
    if (!selectedCarData?.variants?.length) return
    const variant = selectedCarData.variants.find(
      (v) => v.id === selectedVariant || String(v.id) === String(selectedVariant),
    )
    if (variant && (variant.otrPrice > 0 || parseFloat(variant.price) > 0)) {
      setLoanAmount(String(variant.otrPrice ?? variant.price ?? 0))
    }
  }, [selectedVariant, selectedCarData])

  useEffect(() => {
    if (carTypes.length) {
      const firstId = String(carTypes[0].id)
      if (selectedCar !== firstId && !carTypes.some((c) => String(c.id) === String(selectedCar))) {
        setSelectedCar(firstId)
      } else if (!selectedCar) {
        setSelectedCar(firstId)
      }
    }
  }, [carTypes, selectedCar])

  const calculateMonthlyPaymentForTenure = (tenure) => {
    const principal = calculatePrincipal(loanAmount, downPayment, rebateAmount)
    return calculateTotals(principal, interestRate, tenure).monthlyPayment
  }

  const handleLoanAmountChange = (value) => setLoanAmount(normalizeCurrencyInput(value))
  const handleDownPaymentChange = (value) => setDownPayment(normalizeCurrencyInput(value, true))
  const handleRebateAmountChange = (value) => setRebateAmount(normalizeCurrencyInput(value, true))

  const whatsappLink = getWhatsappLink(profileData?.phone ?? null)
  const qrCodeUrl = whatsappLink
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(whatsappLink)}`
    : null

  const sharedProps = {
    profileData,
    designMode,
    onDesignModeChange: setDesignMode,
    carTypes,
    selectedCar,
    selectedVariant,
    selectedCarData,
    loanAmount,
    downPayment,
    rebateAmount,
    computedLoanAmount,
    totalLoanAmount,
    interestRatePercent,
    onInterestRateChange: (p) => setInterestRatePercent(Number(p)),
    formatCurrency,
    formatNumberWithCommas,
    calculateMonthlyPaymentForTenure,
    handleLoanAmountChange,
    handleDownPaymentChange,
    handleRebateAmountChange,
    setSelectedCar,
    setSelectedVariant,
    qrCodeUrl,
    whatsappLink,
    brandLogoUrl,
    brandName,
    agentBrands,
    selectedBrandId: effectiveBrandId,
    onBrandChange: (id) => setSelectedBrandId(id),
  }

  if (designMode === 'split') return <SplitLayout {...sharedProps} />
  if (designMode === 'compact') return <CompactLayout {...sharedProps} />
  return <ClassicLayout {...sharedProps} />
}
