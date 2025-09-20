interface Embed {
  author?: { name?: string; icon_url?: string; url?: string };
  url?: string;
  title?: string;
  description?: string;
  color?: string;
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  image?: string;
  thumbnail?: string;
  timestamp?: boolean;
  footer?: { text?: string; icon_url?: string };
}

export class Webhook {
  private webhookUrl: string;
  private username: string | null = null;
  private avatarUrl: string | null = null;

  constructor(webhookUrl: string, username?: string, avatarUrl?: string) {
    this.webhookUrl = webhookUrl;
    if (username) this.username;
    if (avatarUrl) this.avatarUrl;
  }

  public async sendMessage(content: string) {
    const body: any = {
      content,
      username: this.username || 'Meow User',
      avatar_url: this.avatarUrl || 'https://i.pinimg.com/1200x/85/3c/de/853cde4c2b613a6e45b38508c8f2f1e0.jpg',
    };

    const res = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send webhook message: ${error}`);
    }

    return true;
  }

  public async sendEmbed(data: Embed, content?: string) {
    const embed: any = {};

    if (data.author) {
      embed.author = {};
      if (data.author.name) embed.author.name = data.author.name;
      if (data.author.icon_url) embed.author.icon_url = data.author.icon_url;
      if (data.author.url) embed.author.url = data.author.url;
    }

    if (data.url) embed.url = data.url;
    if (data.title) embed.title = data.title;
    if (data.description) embed.description = data.description;
    if (data.color) embed.color = this.hexToDecimal(data.color);

    if (data.fields) {
      embed.fields = data.fields.map(f => ({ name: f.name, value: f.value, inline: f.inline || false }));
    }

    if (data.image) embed.image = { url: data.image };
    if (data.thumbnail) embed.thumbnail = { url: data.thumbnail };

    if (data.timestamp) {
      embed.timestamp = new Date();
    }

    if (data.footer) {
      embed.footer = {};
      if (data.footer.text) embed.footer.text = data.footer.text;
      if (data.footer.icon_url) embed.footer.icon_url = data.footer.icon_url;
    }

    const body: any = {
      content,
      username: this.username || 'Meow User',
      avatar_url: this.avatarUrl || 'https://i.pinimg.com/1200x/85/3c/de/853cde4c2b613a6e45b38508c8f2f1e0.jpg',
      embeds: [embed] 
    };

    const res = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Failed to send webhook embed: ${error}`);
    }

    return true;
  }

  private hexToDecimal(hex: string): number {
    if (!hex) return 0;
    hex = hex.replace(/^#/, '');
    return parseInt(hex, 16);
  }
}