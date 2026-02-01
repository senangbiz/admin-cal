import { Car, TrendingUp, Phone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const DESIGN_MODES = ['classic', 'compact', 'split']

const DesignSelector = ({ designMode, onDesignModeChange }) => (
  <div className="flex items-center justify-center gap-2 sm:gap-3 bg-muted/60 dark:bg-muted/40 text-sm rounded-full px-3 py-1 border border-border/60 w-full sm:w-auto">
    <span className="font-medium text-muted-foreground">Design</span>
    <Select value={designMode} onValueChange={onDesignModeChange}>
      <SelectTrigger className="h-9 sm:h-10 w-[160px] bg-background border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="classic">Classic</SelectItem>
        <SelectItem value="compact">Center Card</SelectItem>
        <SelectItem value="split">Split Layout</SelectItem>
      </SelectContent>
    </Select>
  </div>
)

const BrandSelector = ({ agentBrands, selectedBrandId, onBrandChange }) => {
  if (!agentBrands?.length || agentBrands.length <= 1) return null
  const value = selectedBrandId != null ? String(selectedBrandId) : (agentBrands[0] && String(agentBrands[0].id))
  return (
    <Select value={value} onValueChange={(v) => onBrandChange?.(v)}>
      <SelectTrigger className="h-8 w-[140px] bg-background border-border text-xs">
        <SelectValue placeholder="Brand" />
      </SelectTrigger>
      <SelectContent>
        {agentBrands.map((b) => (
          <SelectItem key={b.id} value={String(b.id)}>
            {b.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const BrandLogo = ({ brandLogoUrl, brandName, className = 'h-8 sm:h-12 w-auto' }) => {
  if (brandLogoUrl) {
    return (
      <img
        src={brandLogoUrl}
        alt={brandName || 'Brand'}
        className={className}
      />
    )
  }
  return (
    <span className="text-lg sm:text-xl font-bold text-primary">
      {brandName || 'Loan Calculator'}
    </span>
  )
}

export function ClassicLayout(props) {
  const { brandLogoUrl, brandName } = props
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card dark:bg-card/95 border-b-2 border-primary/20 shadow-sm">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <BrandLogo brandLogoUrl={brandLogoUrl} brandName={brandName} className="h-8 sm:h-12 w-auto" />
                <BrandSelector agentBrands={props.agentBrands} selectedBrandId={props.selectedBrandId} onBrandChange={props.onBrandChange} />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
                {props.profileData?.phone && (
                  <a
                    href={`tel:${props.profileData.phone}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                  >
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 animate-pulse" />
                    <span className="text-base sm:text-lg font-semibold">{props.profileData.phone}</span>
                  </a>
                )}
                {props.profileData?.name && (
                  <span className="text-base sm:text-lg font-semibold text-primary">{props.profileData.name}</span>
                )}
                {props.qrCodeUrl && <img src={props.qrCodeUrl} alt="WhatsApp QR Code" className="h-12 w-12 sm:h-16 sm:w-16" />}
              </div>
            </div>
            <DesignSelector designMode={props.designMode} onDesignModeChange={props.onDesignModeChange} />
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-6 flex-1 w-full">
        <div className="flex justify-center">
          <div className="w-full md:w-1/2">
            <Card className="border-2 shadow-lg h-full flex flex-col">
              <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 flex-1 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="car-type" className="text-sm sm:text-base font-semibold flex items-center gap-2">
                      <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                      Model
                    </Label>
                    <Select value={props.selectedCar} onValueChange={props.setSelectedCar}>
                      <SelectTrigger id="car-type" className="h-10 sm:h-12 text-sm sm:text-base border-2 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(props.carTypes || []).map((car) => (
                          <SelectItem key={car.id} value={car.id} className="text-base">
                            {car.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="car-variant" className="text-sm sm:text-base font-semibold">
                      Variant
                    </Label>
                    <Select value={props.selectedVariant} onValueChange={props.setSelectedVariant}>
                      <SelectTrigger id="car-variant" className="h-10 sm:h-12 text-sm sm:text-base border-2 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(props.selectedCarData?.variants || []).map((variant) => (
                          <SelectItem key={variant.id} value={variant.id} className="text-base">
                            {variant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-primary">Loan Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="loan-amount" className="text-sm sm:text-base font-semibold">
                      OTR Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-muted-foreground">
                        MYR
                      </span>
                      <Input
                        id="loan-amount"
                        type="text"
                        value={props.formatNumberWithCommas(props.loanAmount)}
                        onChange={(e) => props.handleLoanAmountChange(e.target.value)}
                        className="pl-14 sm:pl-16 h-10 sm:h-12 text-sm sm:text-base border-2"
                        placeholder="30,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="down-payment" className="text-sm sm:text-base font-semibold">
                      Down Payment
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-muted-foreground">
                        MYR
                      </span>
                      <Input
                        id="down-payment"
                        type="text"
                        value={props.formatNumberWithCommas(props.downPayment)}
                        onChange={(e) => props.handleDownPaymentChange(e.target.value)}
                        className="pl-14 sm:pl-16 h-10 sm:h-12 text-sm sm:text-base border-2"
                        placeholder="5,000"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="rebate-amount" className="text-sm sm:text-base font-semibold">
                      Rebate Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-muted-foreground">
                        MYR
                      </span>
                      <Input
                        id="rebate-amount"
                        type="text"
                        value={props.formatNumberWithCommas(props.rebateAmount)}
                        onChange={(e) => props.handleRebateAmountChange(e.target.value)}
                        className="pl-14 sm:pl-16 h-10 sm:h-12 text-sm sm:text-base border-2"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="computed-loan-amount" className="text-sm sm:text-base font-semibold">
                      Loan Amount
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-muted-foreground">
                        MYR
                      </span>
                      <Input
                        id="computed-loan-amount"
                        type="text"
                        value={props.formatCurrency(props.computedLoanAmount)}
                        disabled
                        className="pl-14 sm:pl-16 h-10 sm:h-12 text-sm sm:text-base border-2 bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="interest-rate" className="text-sm sm:text-base font-semibold">
                      Interest Rate (APR)
                    </Label>
                    <Select
                      value={String(props.interestRatePercent)}
                      onValueChange={(v) => props.onInterestRateChange?.(v)}
                    >
                      <SelectTrigger id="interest-rate" className="h-10 sm:h-12 text-sm sm:text-base border-2 w-full max-w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((p) => (
                          <SelectItem key={p} value={String(p)} className="text-base">
                            {p}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 bg-accent rounded-lg p-3 sm:p-4 border-2 border-accent-foreground/20">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground flex-shrink-0" />
                    <h3 className="text-base sm:text-lg font-bold text-accent-foreground">Loan Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-3">
                    <div className="bg-blue-100 dark:bg-blue-950/40 rounded-lg p-2 sm:p-3 border-2 border-blue-300 dark:border-blue-700 min-w-0">
                      <p className="text-xs font-medium mb-1 text-blue-900 dark:text-blue-200">Monthly Payment</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100 break-words">
                        {props.formatCurrency(props.calculateMonthlyPaymentForTenure(5))}
                      </p>
                      <p className="text-[18px] mt-1 text-blue-800 dark:text-blue-300">5 Years</p>
                    </div>
                    <div className="bg-green-100 dark:bg-green-950/40 rounded-lg p-2 sm:p-3 border-2 border-green-300 dark:border-green-700 min-w-0">
                      <p className="text-xs font-medium mb-1 text-green-900 dark:text-green-200">Monthly Payment</p>
                      <p className="text-lg sm:text-xl font-bold text-green-900 dark:text-green-100 break-words">
                        {props.formatCurrency(props.calculateMonthlyPaymentForTenure(7))}
                      </p>
                      <p className="text-[18px] mt-1 text-green-800 dark:text-green-300">7 Years</p>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-950/40 rounded-lg p-2 sm:p-3 border-2 border-orange-300 dark:border-orange-700 min-w-0">
                      <p className="text-xs font-medium mb-1 text-orange-900 dark:text-orange-200">Monthly Payment</p>
                      <p className="text-lg sm:text-xl font-bold text-orange-900 dark:text-orange-100 break-words">
                        {props.formatCurrency(props.calculateMonthlyPaymentForTenure(9))}
                      </p>
                      <p className="text-[18px] mt-1 text-orange-800 dark:text-orange-300">9 Years</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-accent-foreground/10 rounded-lg p-2 sm:p-3 border border-accent-foreground/20">
                      <p className="text-xs font-medium mb-1 text-accent-foreground/90">Total Loan Amount</p>
                      <p className="text-lg sm:text-xl font-bold text-accent-foreground">
                        {props.formatCurrency(props.totalLoanAmount)}
                      </p>
                      <p className="text-[11px] mt-1 text-accent-foreground/75">Average Total Loan Amount</p>
                    </div>

                    <div className="bg-accent-foreground/10 rounded-lg p-2 sm:p-3 border border-accent-foreground/20">
                      <p className="text-xs font-medium mb-1 text-accent-foreground/90">Interest Rate</p>
                      <p className="text-lg sm:text-xl font-bold text-accent-foreground">{props.interestRatePercent ?? 2.3}% APR</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CompactLayout(props) {
  const { brandLogoUrl, brandName } = props
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/40 to-background flex flex-col">
      <header className="border-b border-border/50 bg-card/80 dark:bg-card/90 backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto max-w-5xl px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <BrandLogo brandLogoUrl={brandLogoUrl} brandName={brandName} className="h-8 sm:h-10 w-auto" />
              <BrandSelector agentBrands={props.agentBrands} selectedBrandId={props.selectedBrandId} onBrandChange={props.onBrandChange} />
              <div className="text-sm sm:text-base font-semibold text-primary">{props.profileData?.name ?? brandName ?? 'Loan Calculator'}</div>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {props.profileData?.phone && (
                <a
                  href={`tel:${props.profileData.phone}`}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                >
                  <Phone className="h-4 w-4" />
                  <span>{props.profileData.phone}</span>
                </a>
              )}
              <DesignSelector designMode={props.designMode} onDesignModeChange={props.onDesignModeChange} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-10 flex-1 w-full">
        <div className="mx-auto w-full lg:w-4/5">
          <Card className="border border-border/40 shadow-sm">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Quick Calculator</h2>
                <p className="text-sm text-muted-foreground">Fast, centered card layout.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="car-type" className="text-sm font-semibold flex items-center gap-2">
                    <Car className="h-4 w-4 text-accent flex-shrink-0" />
                    Model
                  </Label>
                  <Select value={props.selectedCar} onValueChange={props.setSelectedCar}>
                    <SelectTrigger className="h-10 sm:h-11 text-sm border border-border/50 bg-input w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(props.carTypes || []).map((car) => (
                        <SelectItem key={car.id} value={car.id}>
                          {car.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="car-variant" className="text-sm font-semibold">
                    Variant
                  </Label>
                  <Select value={props.selectedVariant} onValueChange={props.setSelectedVariant}>
                    <SelectTrigger className="h-10 sm:h-11 text-sm border border-border/50 bg-input w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(props.selectedCarData?.variants || []).map((variant) => (
                        <SelectItem key={variant.id} value={variant.id}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-amount" className="text-xs sm:text-sm font-medium text-muted-foreground">
                    OTR Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                    <Input
                      id="loan-amount"
                      type="text"
                      value={props.formatNumberWithCommas(props.loanAmount)}
                      onChange={(e) => props.handleLoanAmountChange(e.target.value)}
                      className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-input"
                      placeholder="30,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="down-payment" className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Down Payment
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                    <Input
                      id="down-payment"
                      type="text"
                      value={props.formatNumberWithCommas(props.downPayment)}
                      onChange={(e) => props.handleDownPaymentChange(e.target.value)}
                      className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-input"
                      placeholder="5,000"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rebate-amount" className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Rebate Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                    <Input
                      id="rebate-amount"
                      type="text"
                      value={props.formatNumberWithCommas(props.rebateAmount)}
                      onChange={(e) => props.handleRebateAmountChange(e.target.value)}
                      className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="computed-loan-amount" className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Loan Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                    <Input
                      id="computed-loan-amount"
                      type="text"
                      value={props.formatCurrency(props.computedLoanAmount)}
                      disabled
                      className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-muted text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="interest-rate-compact" className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Interest Rate (APR)
                  </Label>
                  <Select value={String(props.interestRatePercent)} onValueChange={(v) => props.onInterestRateChange?.(v)}>
                    <SelectTrigger id="interest-rate-compact" className="h-10 sm:h-11 text-sm border border-border/50 bg-input w-full max-w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 15 }, (_, i) => i + 1).map((p) => (
                        <SelectItem key={p} value={String(p)}>
                          {p}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[5, 7, 9].map((tenure) => (
                  <div key={tenure} className="rounded-lg border border-border/40 bg-card dark:bg-card/80 px-4 py-3 shadow-sm flex flex-col gap-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{tenure}-Year Term</p>
                    <p className="text-xl font-bold text-foreground break-words">
                      {props.formatCurrency(props.calculateMonthlyPaymentForTenure(tenure)).split('.')[0]}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Monthly Payment</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/30 bg-card/80 dark:bg-card/70 p-3 shadow-sm">
                  <p className="text-xs text-muted-foreground">Total Loan (9yr)</p>
                  <p className="text-lg font-semibold text-foreground">{props.formatCurrency(props.totalLoanAmount)}</p>
                </div>
                <div className="rounded-lg border border-border/30 bg-card/80 dark:bg-card/70 p-3 shadow-sm">
                  <p className="text-xs text-muted-foreground">Interest Rate</p>
                  <p className="text-lg font-semibold text-foreground">{props.interestRatePercent ?? 2.3}% APR</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/30 bg-card dark:bg-card/80 flex items-center justify-center p-4 min-h-[180px]">
                  {props.selectedCarData?.image ? (
                    <img
                      src={props.selectedCarData.image}
                      alt={props.selectedCarData.name}
                      className="max-h-[150px] max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm">No image</div>
                  )}
                </div>
                <div className="rounded-lg border border-border/30 bg-card dark:bg-card/80 flex items-center justify-center p-4 min-h-[180px]">
                  {props.qrCodeUrl ? (
                    <img src={props.qrCodeUrl} alt="QR Code" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-muted-foreground text-sm text-center px-4">Add a phone in profile to show QR contact.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export function SplitLayout(props) {
  const { brandLogoUrl, brandName } = props
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col">
      <header className="border-b border-border/50 bg-card/80 dark:bg-card/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <BrandLogo brandLogoUrl={brandLogoUrl} brandName={brandName} className="h-7 sm:h-10 w-auto" />
              <BrandSelector agentBrands={props.agentBrands} selectedBrandId={props.selectedBrandId} onBrandChange={props.onBrandChange} />
              <div className="h-6 w-px bg-border/50 hidden sm:block" />
              <h1 className="text-base sm:text-lg font-bold text-foreground">Loan Calculator</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href={props.profileData?.phone ? `tel:${props.profileData.phone}` : '#'}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm sm:text-base font-medium"
              >
                <span className="text-base sm:text-lg font-bold text-foreground">{props.profileData?.name ?? 'Contact'}</span>
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{props.profileData?.phone ?? 'Tap to call'}</span>
              </a>
              <DesignSelector designMode={props.designMode} onDesignModeChange={props.onDesignModeChange} />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl px-3 sm:px-4 py-6 sm:py-10 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow h-full">
              <CardContent className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">Calculate Your Payment</h2>
                  <p className="text-sm text-muted-foreground">Enter your details to see estimated monthly payments</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="car-type" className="text-sm font-semibold flex items-center gap-2">
                        <Car className="h-4 w-4 text-accent flex-shrink-0" />
                        Model
                      </Label>
                      <Select value={props.selectedCar} onValueChange={props.setSelectedCar}>
                        <SelectTrigger id="car-type" className="h-10 sm:h-11 text-sm border border-border/50 bg-input w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(props.carTypes || []).map((car) => (
                            <SelectItem key={car.id} value={car.id}>
                              {car.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="car-variant" className="text-sm font-semibold">
                        Variant
                      </Label>
                      <Select value={props.selectedVariant} onValueChange={props.setSelectedVariant}>
                        <SelectTrigger id="car-variant" className="h-10 sm:h-11 text-sm border border-border/50 bg-input w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(props.selectedCarData?.variants || []).map((variant) => (
                            <SelectItem key={variant.id} value={variant.id}>
                              {variant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      Loan Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="loan-amount" className="text-xs sm:text-sm font-medium text-muted-foreground">
                          OTR Price
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                          <Input
                            id="loan-amount"
                            type="text"
                            value={props.formatNumberWithCommas(props.loanAmount)}
                            onChange={(e) => props.handleLoanAmountChange(e.target.value)}
                            className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-input w-full"
                            placeholder="30,000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="down-payment" className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Down Payment
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                          <Input
                            id="down-payment"
                            type="text"
                            value={props.formatNumberWithCommas(props.downPayment)}
                            onChange={(e) => props.handleDownPaymentChange(e.target.value)}
                            className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-input w-full"
                            placeholder="5,000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rebate-amount" className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Rebate Amount
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                          <Input
                            id="rebate-amount"
                            type="text"
                            value={props.formatNumberWithCommas(props.rebateAmount)}
                            onChange={(e) => props.handleRebateAmountChange(e.target.value)}
                            className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-input w-full"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="computed-loan-amount" className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Loan Amount
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">MYR</span>
                          <Input
                            id="computed-loan-amount"
                            type="text"
                            value={props.formatCurrency(props.computedLoanAmount)}
                            disabled
                            className="pl-12 h-10 sm:h-11 text-sm border border-border/50 bg-muted text-muted-foreground w-full"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="interest-rate-split" className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Interest Rate (APR)
                        </Label>
                        <Select value={String(props.interestRatePercent)} onValueChange={(v) => props.onInterestRateChange?.(v)}>
                          <SelectTrigger id="interest-rate-split" className="h-10 sm:h-11 text-sm border border-border/50 bg-input w-full max-w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 15 }, (_, i) => i + 1).map((p) => (
                              <SelectItem key={p} value={String(p)}>
                                {p}%
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="flex items-center justify-center bg-card dark:bg-card/80 rounded-lg p-4 min-h-[200px] border border-border/30 shadow-sm">
                      {props.selectedCarData?.image ? (
                        <img
                          src={props.selectedCarData.image}
                          alt={props.selectedCarData.name}
                          className="max-h-[180px] max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-muted-foreground text-sm">No image</div>
                      )}
                    </div>
                    <div className="flex items-center justify-center bg-card dark:bg-card/80 rounded-lg p-4 min-h-[200px] border border-border/30 shadow-sm">
                      {props.qrCodeUrl ? (
                        <img src={props.qrCodeUrl} alt="QR Code" className="max-h-full max-w-full object-contain" />
                      ) : (
                        <div className="text-muted-foreground text-sm text-center">Add a phone in profile to show QR</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-4">
            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="p-4 sm:p-5 space-y-3 min-w-0">
                <p className="text-[15px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">5-Year Term</p>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-primary break-words">
                    {props.formatCurrency(props.calculateMonthlyPaymentForTenure(5)).split('.')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Payment</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20">
              <CardContent className="p-4 sm:p-5 space-y-3 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">7-Year Term</p>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 break-words">
                    {props.formatCurrency(props.calculateMonthlyPaymentForTenure(7)).split('.')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Payment</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-destructive/5 to-destructive/10">
              <CardContent className="p-4 sm:p-5 space-y-3 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">9-Year Term</p>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-destructive break-words">
                    {props.formatCurrency(props.calculateMonthlyPaymentForTenure(9)).split('.')[0]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Monthly Payment</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardContent className="p-4 sm:p-5 space-y-3">
                <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Summary</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs text-muted-foreground">Principal Loan</p>
                    <p className="text-sm font-semibold text-foreground">{props.formatCurrency(props.computedLoanAmount)}</p>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border/20">
                    <p className="text-xs text-muted-foreground">Loan Amount (9yr)</p>
                    <p className="text-sm font-semibold text-primary">{props.formatCurrency(props.totalLoanAmount)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
