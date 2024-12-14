"use server";

import { SMTPClient } from "smtp-client";

const SmtpTest = async (
	host,
	port,
	tls,
	username,
	password,
	emailFromAddress,
) => {
	const smtp = new SMTPClient({ host: host, port: port });

	try {
		if (tls) {
			smtp.secure();
		}
		if (username != null && password != null) {
			await smtp.authLogin({ username: username, password: password });
		}
		if (emailFromAddress != null) {
			await smtp.mail({ from: emailFromAddress });
		}
		const response = await smtp.connect({ timeout: 3000 });
		if (response == 220) {
			return "OK";
		}
	} catch (err) {
		return err.message;
	}

	return "INVALID";
};

export default SmtpTest;
