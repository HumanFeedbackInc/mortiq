"use client";

import React from "react";
import {Button, Input, Checkbox, Link, Divider, Form} from "@heroui/react";
import {Icon} from "@iconify/react";

import {AcmeIcon} from "@/components/ui/logo";

export default function Component() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("handleSubmit");
  };

  return (
    <div className="flex h-full w-full flex-row items-center justify-center pt-16">
      <div className="mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small">
        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
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
        <p className="text-xl font-medium">Contact Me</p>
        <p className="text-small text-default-500">Get in touch today</p>
      </div>
    </div>
  );
}
