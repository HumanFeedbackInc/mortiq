import React, { createContext, useContext, useState } from "react";

export interface ListingFormData {
  // Loan Details (SignUpForm)
  loanAmount?: number;
  mortgageType?: string;
  interestRate?: number;
  term?: string;
  priorEncumbrances?: number;
  priorEncumbrancesWith?: string;
  fairMarketValue?: number;
  ltv?: number;

  // Images (CompanyInformationForm)
  listingImages?: File[];

  // Images and Documents
  listingDocuments?: File[];

  // Review & Payment
  //   email?: string;
  cardNumber?: string;
  cardMonth?: string;
  cardYear?: string;
  cardCvc?: string;
  //   entityName?: string;
  //   cardholderName?: string;
  //   country?: string;
  //   zipCode?: string;
  //   state?: string;

  // Contact Information
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  entityName?: string;
  cardholderName?: string;
  country?: string;
  zipCode?: string; // Used for postal code
  state?: string; // Used for province

  // Property Details
  propertyType?: string;
  propertyAddress?: string;
  propertyCity?: string;
  propertyProvince?: string;
  propertyPostalCode?: string;
  propertyCountry?: string;
  propertyLatitude?: number;
  propertyLongitude?: number;
  squareMeters?: number;
  numberOfUnits?: number;
  propertyDescription?: string;

  // Add full address details
  fullAddressDetails?: {
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    latitude?: number;
    longitude?: number;
    formattedAddress?: string;
  };
}

interface ListingFormContextType {
  formData: ListingFormData;
  updateFormData: (newData: Partial<ListingFormData>) => void;
}

const ListingFormContext = createContext<ListingFormContextType | undefined>(
  undefined
);

export function ListingFormProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<ListingFormData>({});

  const updateFormData = (newData: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <ListingFormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </ListingFormContext.Provider>
  );
}

export function useListingForm() {
  const context = useContext(ListingFormContext);
  if (context === undefined) {
    throw new Error("useListingForm must be used within a ListingFormProvider");
  }
  return context;
}
