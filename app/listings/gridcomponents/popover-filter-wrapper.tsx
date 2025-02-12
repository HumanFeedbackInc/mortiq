"use client";

import React, { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PopoverFilterWrapperProps {
  title: string;
  children: React.ReactNode;
}

export default function PopoverFilterWrapper({
  title,
  children,
}: PopoverFilterWrapperProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          className="bg-default-100 text-default-800"
          size="sm"
          startContent={
            <Icon
              className="text-default-400"
              icon="solar:tuning-2-linear"
              width={16}
            />
          }
        >
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex w-full flex-col gap-6 px-2 py-4">
          <div className="flex flex-col gap-2">
            <span className="text-small font-bold">{title}</span>
            {children}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              color="danger"
              variant="light"
              onPress={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button color="primary" onPress={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
