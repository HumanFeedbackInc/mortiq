"use client";

import type { InputProps } from "@heroui/react";

import React from "react";
import { Input, Checkbox, Link } from "@heroui/react";
import { cn } from "@heroui/react";
import { useListingForm } from "./ListingFormContext";

export type SignUpFormProps = React.HTMLAttributes<HTMLFormElement>;

const SignUpForm = React.forwardRef<HTMLFormElement, SignUpFormProps>(
  ({ className, ...props }, ref) => {
    const { formData, updateFormData } = useListingForm();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      updateFormData({ [name]: value });

      // Calculate LTV when loan amount or fair market value changes
      if (name === "loanAmount" || name === "fairMarketValue") {
        const loanAmount =
          name === "loanAmount" ? parseFloat(value) : formData.loanAmount || 0;
        const fairMarketValue =
          name === "fairMarketValue"
            ? parseFloat(value)
            : formData.fairMarketValue || 0;

        if (fairMarketValue > 0) {
          const calculatedLTV = ((loanAmount / fairMarketValue) * 100).toFixed(
            2
          );
          updateFormData({ [name]: value, ltv: parseFloat(calculatedLTV) });
        }
      }
    };

    const inputProps: Pick<InputProps, "labelPlacement" | "classNames"> = {
      labelPlacement: "outside",
      classNames: {
        label:
          "text-small font-medium text-default-700 group-data-[filled-within=true]:text-default-700",
      },
    };

    return (
      <>
        <div className="text-3xl font-bold leading-9 text-default-foreground">
          Welcome to MortgageIQ 👋
        </div>
        <div className="py-2 text-medium text-default-500">
          Already have an account?
          <Link className="ml-2 text-secondary underline" href="#" size="md">
            Sign In
          </Link>
        </div>
        <form
          ref={ref}
          {...props}
          className={cn(
            "flex grid grid-cols-12 flex-col gap-4 py-8",
            className
          )}
        >
          <Input
            className="col-span-12 md:col-span-6"
            label="Loan Amount"
            name="loanAmount"
            placeholder="$250,000.00"
            startContent="$"
            type="number"
            value={formData.loanAmount?.toString() || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="Mortgage Type"
            name="mortgageType"
            placeholder="2nd"
            value={formData.mortgageType || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="Interest Rate"
            name="interestRate"
            placeholder="12.00"
            endContent="%"
            type="number"
            step="0.01"
            value={formData.interestRate?.toString() || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="Term"
            name="term"
            placeholder="6 Months (open)"
            value={formData.term || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="Prior Encumbrances"
            name="priorEncumbrances"
            placeholder="$712,000.00"
            startContent="$"
            type="number"
            value={formData.priorEncumbrances?.toString() || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="Prior Encumbrances With"
            name="priorEncumbrancesWith"
            placeholder="CIBC"
            value={formData.priorEncumbrancesWith || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="Estimated Fair Market Value"
            name="fairMarketValue"
            placeholder="$1,360,000.00"
            startContent="$"
            type="number"
            value={formData.fairMarketValue?.toString() || ""}
            onChange={handleInputChange}
            {...inputProps}
          />

          <Input
            className="col-span-12 md:col-span-6"
            label="LTV"
            name="ltv"
            placeholder="70.73"
            endContent="%"
            type="number"
            step="0.01"
            value={formData.ltv?.toString() || ""}
            onChange={handleInputChange}
            {...inputProps}
          />
        </form>
      </>
    );
  }
);

SignUpForm.displayName = "SignUpForm";

export default SignUpForm;
