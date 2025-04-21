export default class SendDiscordMessage {
	constructor(private readonly webhookUrl: string) {
		if (!webhookUrl || !webhookUrl.startsWith("https://discord.com/api/webhooks/")) {
			throw new Error("Invalid Discord webhook URL");
		}
	}

	public async send(message: string): Promise<void> {
		if (!message || typeof message !== "string") {
			throw new Error("Message must be a non-empty string");
		}

		try {
			const response = await fetch(this.webhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: message }),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Discord webhook failed: ${response.status} ${errorText}`);
			}
		} catch (error) {
			console.error(
				"Failed to send to Discord:",
				error instanceof Error ? error.message : error,
			);
			throw error; // Re-throw to allow caller to handle
		}
	}
}
