from decimal import Decimal
from app.schemas.tax import TaxCalculationRequest, TaxCalculationResponse, RegimeTaxDetails

def calculate_income_tax(req: TaxCalculationRequest) -> TaxCalculationResponse:
    gross = req.grossIncome
    
    # -------------------------------------------------------------
    # 1. NEW TAX REGIME CALCULATIONS (Standard Deduction = ₹75,000)
    # -------------------------------------------------------------
    new_std_deduction = Decimal("75000.00")
    new_taxable = max(Decimal("0.00"), gross - new_std_deduction)
    
    new_tax = Decimal("0.00")
    new_slabs = []
    
    if new_taxable > 1500000:
        tax_in_slab = (new_taxable - Decimal("1500000.00")) * Decimal("0.30")
        new_tax += tax_in_slab
        new_slabs.append({"slab": "> ₹15,00,000 (30%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if new_taxable > 1200000:
        taxable_amt = min(new_taxable, Decimal("1500000.00")) - Decimal("1200000.00")
        tax_in_slab = taxable_amt * Decimal("0.20")
        new_tax += tax_in_slab
        new_slabs.append({"slab": "₹12,00,001 - ₹15,00,000 (20%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if new_taxable > 1000000:
        taxable_amt = min(new_taxable, Decimal("1200000.00")) - Decimal("1000000.00")
        tax_in_slab = taxable_amt * Decimal("0.15")
        new_tax += tax_in_slab
        new_slabs.append({"slab": "₹10,00,001 - ₹12,00,000 (15%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if new_taxable > 700000:
        taxable_amt = min(new_taxable, Decimal("1000000.00")) - Decimal("700000.00")
        tax_in_slab = taxable_amt * Decimal("0.10")
        new_tax += tax_in_slab
        new_slabs.append({"slab": "₹7,00,001 - ₹10,00,000 (10%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if new_taxable > 300000:
        taxable_amt = min(new_taxable, Decimal("700000.00")) - Decimal("300000.00")
        tax_in_slab = taxable_amt * Decimal("0.05")
        new_tax += tax_in_slab
        new_slabs.append({"slab": "₹3,00,001 - ₹7,00,000 (5%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if new_taxable <= 300000:
        new_slabs.append({"slab": "Up to ₹3,00,000 (0%)", "tax": "₹0.00"})

    # Rebate u/s 87A for New Regime (Taxable income <= ₹7,00,000)
    if new_taxable <= Decimal("700000.00"):
        new_tax = Decimal("0.00")

    new_cess = new_tax * Decimal("0.04")
    new_total_tax = new_tax + new_cess
    new_effective_rate = float((new_total_tax / gross) * 100) if gross > 0 else 0.0

    # -------------------------------------------------------------
    # 2. OLD TAX REGIME CALCULATIONS (Standard Deduction = ₹50,000)
    # -------------------------------------------------------------
    old_std_deduction = Decimal("50000.00")
    total_deductions = old_std_deduction + req.section80C + req.section80D + req.hraExemption
    old_taxable = max(Decimal("0.00"), gross - total_deductions)
    
    old_tax = Decimal("0.00")
    old_slabs = []
    
    if old_taxable > 1000000:
        tax_in_slab = (old_taxable - Decimal("1000000.00")) * Decimal("0.30")
        old_tax += tax_in_slab
        old_slabs.append({"slab": "> ₹10,00,000 (30%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if old_taxable > 500000:
        taxable_amt = min(old_taxable, Decimal("1000000.00")) - Decimal("500000.00")
        tax_in_slab = taxable_amt * Decimal("0.20")
        old_tax += tax_in_slab
        old_slabs.append({"slab": "₹5,00,001 - ₹10,00,000 (20%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if old_taxable > 250000:
        taxable_amt = min(old_taxable, Decimal("500000.00")) - Decimal("250000.00")
        tax_in_slab = taxable_amt * Decimal("0.05")
        old_tax += tax_in_slab
        old_slabs.append({"slab": "₹2,50,001 - ₹5,00,000 (5%)", "tax": f"₹{tax_in_slab:,.2f}"})
    if old_taxable <= 250000:
        old_slabs.append({"slab": "Up to ₹2,50,000 (0%)", "tax": "₹0.00"})

    # Rebate u/s 87A for Old Regime (Taxable income <= ₹5,00,000)
    if old_taxable <= Decimal("500000.00"):
        old_tax = Decimal("0.00")

    old_cess = old_tax * Decimal("0.04")
    old_total_tax = old_tax + old_cess
    old_effective_rate = float((old_total_tax / gross) * 100) if gross > 0 else 0.0

    # -------------------------------------------------------------
    # 3. RECOMMENDATIONS & COMPARISON
    # -------------------------------------------------------------
    recommended_regime = "New Tax Regime" if new_total_tax <= old_total_tax else "Old Tax Regime"
    tax_savings = abs(old_total_tax - new_total_tax)

    recommendations = []
    if recommended_regime == "New Tax Regime":
        recommendations.append(f"New Tax Regime saves you ₹{tax_savings:,.2f} in tax thanks to lower slab rates and higher standard deduction (₹75,000).")
    else:
        recommendations.append(f"Old Tax Regime saves you ₹{tax_savings:,.2f} because your total claimed deductions (₹{total_deductions:,.2f}) significantly lower your taxable income.")

    if req.section80C < Decimal("150000.00"):
        remaining_80c = Decimal("150000.00") - req.section80C
        recommendations.append(f"You can invest up to ₹{remaining_80c:,.2f} more under Section 80C (ELSS, PPF, NPS) to reduce tax under the Old Regime.")

    if req.section80D == Decimal("0.00"):
        recommendations.append("Consider purchasing health insurance to claim up to ₹25,000 under Section 80D.")

    return TaxCalculationResponse(
        grossIncome=gross,
        oldRegime=RegimeTaxDetails(
            regimeName="Old Tax Regime",
            taxableIncome=old_taxable,
            baseTax=old_tax,
            cess=old_cess,
            totalTax=old_total_tax,
            effectiveRate=round(old_effective_rate, 2),
            slabs=old_slabs
        ),
        newRegime=RegimeTaxDetails(
            regimeName="New Tax Regime",
            taxableIncome=new_taxable,
            baseTax=new_tax,
            cess=new_cess,
            totalTax=new_total_tax,
            effectiveRate=round(new_effective_rate, 2),
            slabs=new_slabs
        ),
        recommendedRegime=recommended_regime,
        annualTaxSavings=tax_savings,
        recommendations=recommendations
    )
