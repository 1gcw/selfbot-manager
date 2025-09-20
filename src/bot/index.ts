import { Client, GatewayIntentBits, Collection, Partials } from "discord.js";
import { LoadEvents } from "@/bot/modules/events.js";
import { LoadCommands } from "@/bot/modules/commands.js";

export interface ExtendedClient extends Client {
  slashCommands: Collection<string, any>
}

const client = new Client({
  intents: Object.values(GatewayIntentBits) as number[],
}) as ExtendedClient;

client.slashCommands = new Collection();

await LoadEvents(client);
await LoadCommands(client);

client.login(process.env.botToken);

export default client;