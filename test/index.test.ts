import { beforeEach, describe, expect, it, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import SendDiscordMessage from "../src/index";

// Create a mock fetch function
const mockFetch = createFetchMock(vi);
mockFetch.enableMocks();

describe("SendDiscordMessage", () => {
	const validWebhookUrl = "https://discord.com/api/webhooks/123456789012345678/abcXYZ";
	const invalidWebhookUrl = "https://invalid.com/webhook";

	beforeEach(() => {
		vi.clearAllMocks(); // Clear all mocks to prevent state leakage
	});

	describe("constructor", () => {
		it("should throw if webhook URL is empty", () => {
			expect(() => new SendDiscordMessage("")).toThrow("Invalid Discord webhook URL");
		});

		it("should throw if webhook URL is not a Discord webhook", () => {
			expect(() => new SendDiscordMessage(invalidWebhookUrl)).toThrow(
				"Invalid Discord webhook URL",
			);
		});

		it("should initialize with a valid webhook URL", () => {
			const sender = new SendDiscordMessage(validWebhookUrl);
			expect(sender).toBeInstanceOf(SendDiscordMessage);
		});
	});

	describe("send", () => {
		let sender: SendDiscordMessage;

		beforeEach(() => {
			sender = new SendDiscordMessage(validWebhookUrl);
		});

		it("should throw if message is empty", async () => {
			await expect(sender.send("")).rejects.toThrow("Message must be a non-empty string");
		});

		it("should throw if message is not a string", async () => {
			// @ts-expect-error Testing invalid input
			await expect(sender.send(null)).rejects.toThrow(
				"Message must be a non-empty string",
			);
		});

		it("should send message successfully", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 204,
				text: () => Promise.resolve(""),
			} as Response);

			await expect(sender.send("Test message")).resolves.toBeUndefined();

			expect(mockFetch).toHaveBeenCalledWith(validWebhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: "Test message" }),
			});
		});

		it("should throw and log error on webhook failure (HTTP 401)", async () => {
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			const errorMessage = "Unauthorized";
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				text: () => Promise.resolve(errorMessage),
			} as Response);

			await expect(sender.send("Test message")).rejects.toThrow(
				`Discord webhook failed: 401 ${errorMessage}`,
			);

			expect(mockFetch).toHaveBeenCalledWith(validWebhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: "Test message" }),
			});
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Failed to send to Discord:",
				`Discord webhook failed: 401 ${errorMessage}`,
			);
			consoleErrorSpy.mockRestore();
		});

		it("should throw and log error on network failure", async () => {
			const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			const errorMessage = "Network error";
			mockFetch.mockRejectedValueOnce(new Error(errorMessage));

			await expect(sender.send("Test message")).rejects.toThrow(errorMessage);

			expect(mockFetch).toHaveBeenCalledWith(validWebhookUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: "Test message" }),
			});
			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Failed to send to Discord:",
				errorMessage,
			);
			consoleErrorSpy.mockRestore();
		});
	});
});
