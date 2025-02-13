"use client";

import React from "react";
import { Button, Input, Checkbox, Link, Divider, Form } from "@heroui/react";
import { Icon } from "@iconify/react";

import { AcmeIcon } from "@/components/ui/logo";

export default function ContactMe(props: {
  address: string;
  amount: number;
  interest_rate: number;
  ltv: number;
  prior_encumbrances: string;
  term: unknown;
  mortgage_type: string;
}) {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Extract form values using the FormData API
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    // Ensure the phone number is in the right format (i.e., starts with a "+")
    const formattedPhone = phone.startsWith("+") ? phone : "+1" + phone;

    // Build the payload based on the instructions
    const payload = {
      name: `${firstName} ${lastName}`,
      phone_number: formattedPhone,
      property_listing_id: "3403",
      address: props.address,
      amount: props.amount,
      interest_rate: props.interest_rate,
      ltv: props.ltv,
      prior_encumbrances: props.prior_encumbrances,
      term: props.term,
      mortgage_type: props.mortgage_type,
    };

    console.log("Payload prepared:", payload);

    try {
      // Call the webhook to contact the user
      const response = await fetch(
        "https://api.callfluent.ai/api/call-api/make-call/3403",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      console.log("Call initiated successfully");
    } catch (error) {
      console.error("Error initiating call:", error);
    }
  };

  //on submit, trigger a webhook to send an email to the listing agent and initiate
  //a call from our callfluent ai platform to the lead to book a time to view the property.
  return (
    <div className="flex h-full w-full flex-col sm:flex-row items-center justify-center pt-16">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <Form
          className="flex flex-col gap-3"
          validationBehavior="native"
          onSubmit={handleSubmit}
        >
          <Input
            isRequired
            label="First Name"
            name="firstName"
            placeholder="Enter your first name"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            label="Last Name"
            name="lastName"
            placeholder="Enter your last name"
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            label="Phone Number"
            name="phone"
            placeholder="Enter your phone number"
            type="tel"
            variant="bordered"
          />
          <Button className="w-full" color="primary" type="submit">
            Contact Me Now
          </Button>
        </Form>
      </div>
      <div className="flex flex-col items-center p-6">
        <AcmeIcon size={60} />
        <p className="text-xl font-medium">Contact Me Now</p>
        <p className="text-small text-default-500">
          We'll call within 5 minutes
        </p>
      </div>
    </div>
  );
}
