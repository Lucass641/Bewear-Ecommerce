"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  status: "completed" | "current" | "upcoming";
}

interface CheckoutStepperProps {
  steps: Step[];
}

export const CheckoutStepper = ({ steps }: CheckoutStepperProps) => {
  return (
    <>
      {/* Mobile version - centered horizontal */}
      <div className="w-full py-4 lg:hidden">
        <div className="mx-auto flex max-w-xs items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                    step.status === "completed" &&
                      "border-green-600 bg-green-600 text-white",
                    step.status === "current" &&
                      "border-primary bg-primary text-primary-foreground",
                    step.status === "upcoming" &&
                      "border-muted-foreground bg-background text-muted-foreground",
                  )}
                >
                  {step.status === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-1 text-xs font-medium",
                    step.status === "completed" && "text-green-600",
                    step.status === "current" && "text-primary",
                    step.status === "upcoming" && "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 w-12",
                    step.status === "completed" ? "bg-green-600" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop version - horizontal with text to the side */}
      <div className="hidden w-full py-2 lg:block">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
                    step.status === "completed" &&
                      "border-green-600 bg-green-600 text-white",
                    step.status === "current" &&
                      "border-primary bg-primary text-primary-foreground",
                    step.status === "upcoming" &&
                      "border-muted-foreground bg-background text-muted-foreground",
                  )}
                >
                  {step.status === "completed" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium whitespace-nowrap",
                    step.status === "completed" && "text-green-600",
                    step.status === "current" && "text-primary",
                    step.status === "upcoming" && "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-0.5 w-16",
                    step.status === "completed" ? "bg-green-600" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
