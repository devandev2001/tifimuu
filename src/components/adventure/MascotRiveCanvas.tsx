"use client";

import { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import type { MascotEvent } from "@/lib/mascot-events";

const STATE_MACHINE = "Mascot";

export function MascotRiveCanvas({
  event,
  eventSequence,
  decorative,
}: {
  event: MascotEvent;
  eventSequence: number;
  decorative: boolean;
}) {
  const { rive, RiveComponent } = useRive({
    src: "/rive/mascot.riv",
    artboard: "Main",
    stateMachines: STATE_MACHINE,
    autoplay: true,
  });
  const welcome = useStateMachineInput(rive, STATE_MACHINE, "WELCOME");
  const idle = useStateMachineInput(rive, STATE_MACHINE, "IDLE");
  const mealSelected = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "MEAL_SELECTED",
  );
  const questCompleted = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "QUEST_COMPLETED",
  );
  const planChosen = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "PLAN_CHOSEN",
  );
  const orderClicked = useStateMachineInput(
    rive,
    STATE_MACHINE,
    "ORDER_CLICKED",
  );

  useEffect(() => {
    const inputs = {
      WELCOME: welcome,
      IDLE: idle,
      MEAL_SELECTED: mealSelected,
      QUEST_COMPLETED: questCompleted,
      PLAN_CHOSEN: planChosen,
      ORDER_CLICKED: orderClicked,
    };
    inputs[event]?.fire();
  }, [
    event,
    eventSequence,
    idle,
    mealSelected,
    orderClicked,
    planChosen,
    questCompleted,
    welcome,
  ]);

  return (
    <RiveComponent
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : "Interactive Tiffimu mascot"}
      role={decorative ? undefined : "img"}
      className="h-full w-full"
    />
  );
}
