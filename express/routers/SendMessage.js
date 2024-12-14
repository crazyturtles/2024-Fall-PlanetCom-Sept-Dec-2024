const express = require("express");
const { SMTPClient } = require("emailjs");
const router = express.Router();

const client = new SMTPClient({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	ssl: false,
});

router.post("/send-message", async (req, res) => {
	const { recipient, subject, message } = req.body;

	if (!recipient || !message) {
		return res
			.status(400)
			.json({ error: "Recipient and message are required." });
	}

	try {
		const emailResponse = await client.sendAsync({
			text: message,
			from: "pumpmaster@planetcom.ca",
			to: recipient,
			subject: subject,
		});

		console.log("Email sent successfully:", emailResponse);
		res.status(200).json({ message: "Message sent successfully!" });
	} catch (error) {
		console.error("Error sending message:", error);
		res.status(500).json({ error: "Failed to send message." });
	}
});

module.exports = router;
