"use client";

import React, { useState, useEffect } from 'react';
import { Input, InputProps } from "@heroui/react";
import { usePlacesWidget } from "react-google-autocomplete";

interface AddressDetails {
  unitNumber: string;
  streetAddress: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
}

interface AddressAutocompleteProps extends Omit<InputProps, 'onChange' | 'defaultValue'> {
  onAddressSelect: (address: AddressDetails) => void;
  defaultValue?: AddressDetails;
}

export function AddressAutocomplete({ 
  onAddressSelect, 
  defaultValue,
  ...props 
}: AddressAutocompleteProps) {
  const [addressDetails, setAddressDetails] = useState<AddressDetails>(
    defaultValue || {
      unitNumber: "",
      streetAddress: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
      formattedAddress: "",
    }
  );
  
  // Add useEffect to update state when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setAddressDetails(defaultValue);
    }
  }, [defaultValue]);

  const { ref: materialRef } = usePlacesWidget({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    options: {
      componentRestrictions: { country: "ca" },
      types: ["address"],
    },
    onPlaceSelected: (place: google.maps.places.PlaceResult) => {
      if (!place.address_components) return;

      const newAddressDetails: AddressDetails = {
        unitNumber: addressDetails.unitNumber, // Preserve unit number when address is selected
        streetAddress: "",
        city: "",
        province: "",
        postalCode: "",
        country: "",
        formattedAddress: place.formatted_address || "",
      };

      // Extract address components
      place.address_components.forEach((component) => {
        const types = component.types;
        
        if (types.includes("street_number") || types.includes("route")) {
          newAddressDetails.streetAddress += component.long_name + " ";
        }
        if (types.includes("locality")) {
          newAddressDetails.city = component.long_name;
        }
        if (types.includes("administrative_area_level_1")) {
          newAddressDetails.province = component.short_name;
        }
        if (types.includes("postal_code")) {
          newAddressDetails.postalCode = component.long_name;
        }
        if (types.includes("country")) {
          newAddressDetails.country = component.long_name;
        }
      });

      // Add coordinates if available
      if (place.geometry?.location) {
        newAddressDetails.latitude = place.geometry.location.lat();
        newAddressDetails.longitude = place.geometry.location.lng();
      }

      setAddressDetails(newAddressDetails);
      onAddressSelect(newAddressDetails);
    },
  });

  const handleManualChange = (field: keyof AddressDetails, value: string) => {
    const updatedDetails = {
      ...addressDetails,
      [field]: value,
    };
    
    // Use the updated values to build the formatted address
    updatedDetails.formattedAddress = field === 'formattedAddress' ? value : 
      `${updatedDetails.unitNumber ? `Unit ${updatedDetails.unitNumber}, ` : ''}${updatedDetails.streetAddress}, ${updatedDetails.city}, ${updatedDetails.province} ${updatedDetails.postalCode}, ${updatedDetails.country}`.trim();
    
    setAddressDetails(updatedDetails);
    onAddressSelect(updatedDetails);
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        {...props}
        ref={materialRef as any}
        value={addressDetails.formattedAddress}
        onChange={(e) => handleManualChange('formattedAddress', e.target.value)}
        placeholder="Search for address"
        label="Search Address"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Unit Number"
          value={addressDetails.unitNumber || ''}
          onChange={(e) => handleManualChange('unitNumber', e.target.value)}
          placeholder="Unit/Suite/Apt (optional)"
          className="md:col-span-1"
        />
        <Input
          label="Street Address"
          value={addressDetails.streetAddress || ''}
          onChange={(e) => handleManualChange('streetAddress', e.target.value)}
          placeholder="Street address"
          className="md:col-span-1"
        />
        <Input
          label="City"
          value={addressDetails.city || ''}
          onChange={(e) => handleManualChange('city', e.target.value)}
          placeholder="City"
        />
        <Input
          label="Province"
          value={addressDetails.province || ''}
          onChange={(e) => handleManualChange('province', e.target.value)}
          placeholder="Province"
        />
        <Input
          label="Postal Code"
          value={addressDetails.postalCode || ''}
          onChange={(e) => handleManualChange('postalCode', e.target.value)}
          placeholder="Postal code"
        />
        <Input
          label="Country"
          value={addressDetails.country || ''}
          onChange={(e) => handleManualChange('country', e.target.value)}
          placeholder="Country"
          className="md:col-span-2"
        />
      </div>
    </div>
  );
} 