"use client";

import { Button } from "@/components/ui/button";

type AlertButtonProps = {
  message: string;
  children: React.ReactNode;
};

export function AlertButton({ message, children }: AlertButtonProps) {
  return (
    <Button
      size="lg"
      variant="primary"
      fullWidth
      onClick={() => {
        alert(message);
      }}
    >
      {children}
    </Button>
  );
}
