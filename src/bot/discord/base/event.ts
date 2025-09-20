import { Events } from "discord.js";

interface Event {
  name: (typeof Events)[keyof typeof Events] | keyof typeof Events;
  once?: boolean;
  run: (...args: any[]) => any;
}

export function createEvent(event: Event): Event {
  if (!event.name) throw new Error("Event is missing a name");
  if (typeof event.run !== "function") throw new Error(`Event "${event.name}" is missing a run function`);

  let normalizedName: string;

  if (typeof event.name === "string" && event.name in Events) {
    normalizedName = Events[event.name as keyof typeof Events];
  } else {
    normalizedName = event.name.toString();
  }

  return {
    ...event,
    name: normalizedName as (typeof Events)[keyof typeof Events],
  };
}