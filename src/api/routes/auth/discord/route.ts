import { addRoleToUser, addUserToGuild, getAccessToken, getUserData } from "@/api/controllers/discord/auth.js";
import { Webhook } from "@/api/controllers/discord/webhook.js";
import { defineRoutes } from "@/api/functions/utils.js";
import { FastifyReply } from "fastify";

const clientCallback = process.env.clientCallback;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const botToken = process.env.botToken;
const guildId = process.env.guildId;
const roleId = process.env.roleId;
const webhookAuth = process.env.webhookAuth;

function redirectToCallback(reply: FastifyReply, success: boolean, message: string) {
  reply.setCookie('callback_success', String(success), { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 });

  reply.setCookie('callback_message', message, { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 });

  return reply.redirect('/callback.html');
}


export default defineRoutes(app => {
  app.get('/login', (_req, reply) => {
    if (!clientCallback || !clientId) {
      return redirectToCallback(reply, false, 'Missing clientCallback or clientId in environment variables.');
    }

    reply.status(302).redirect(`https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(clientCallback)}&response_type=code&scope=identify%20email%20guilds.join`);
  });

  app.get('/callback', async (req, reply) => {
    const { code } = req.query as { code?: string };

    if (!code) {
      return redirectToCallback(reply, false, 'Authorization code missing.');
    }

    if (!clientCallback || !clientSecret || !clientId || !botToken || !guildId || !roleId) {
      return redirectToCallback(reply, false, 'Missing critical environment variables.');
    }

    try {
      const response = await getAccessToken(code);
      const user = await getUserData(response.access_token);
      await addUserToGuild(user.id, response.access_token);
      await addRoleToUser(user.id);

      if (webhookAuth) {
        const avatarUrl = user.avatar
          ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar.startsWith('a_') ? 'gif' : 'png'}`
          : `https://i.pinimg.com/1200x/85/3c/de/853cde4c2b613a6e45b38508c8f2f1e0.jpg`;

        const webhook = new Webhook(webhookAuth, user.username, avatarUrl);

        await webhook.sendEmbed({
          author: { name: `${user.username} - New verified user`, icon_url: avatarUrl },
          color: '#000000',
          description: '-# New verified user',
          fields: [
            { name: 'User', value: `<@${user.id}> \`${user.id}\``, inline: true },
          ],
          timestamp: true,
          footer: { text: 'Meow User', icon_url: 'https://i.pinimg.com/1200x/b6/96/b6/b696b6aa209582e958ba34eb0c2dd824.jpg' }
        });
      }

      return redirectToCallback(reply, true, 'User added to guild and role assigned successfully!');
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
      return redirectToCallback(reply, false, errorMessage);
    }
  });
});