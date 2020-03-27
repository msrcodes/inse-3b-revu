const postmark = require('postmark'),
			config = require('../config/config.json');

const client = new postmark.ServerClient(config.postmarkAPIKey);

function sendMail(to, subject, body, textBody) {
	client.sendEmail({
		From: config.fromEmail,
		To: to,
		Subject: subject,
		HtmlBody: body,
		TextBody: textBody
	})
}

module.exports = {
	sendMail
};
