const clientCallback = process.env.clientCallback;
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;
const botToken = process.env.botToken;
const guildId = process.env.guildId;
const roleId = process.env.roleId;

export async function getAccessToken(code: string) {
  const response = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId || '',
      client_secret: clientSecret || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: clientCallback || '',
      scope: 'identify email guilds.join'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get access token: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function getUserData(accessToken: string) {
  const response = await fetch('https://discord.com/api/v10/users/@me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to fetch user data: ${JSON.stringify(error)}`);
  }

  return response.json();
}

export async function addUserToGuild(userId: string, accessToken: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      access_token: accessToken
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to add user to guild: ${JSON.stringify(error)}`);
  }

  return true;
}

export async function addRoleToUser(userId: string) {
  const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${userId}/roles/${roleId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${botToken}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to add role to user: ${JSON.stringify(error)}`);
  }

  return true;
}