
export const sendDiscordAlert = async (message: string, isUrgent: boolean = false) => {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn('DISCORD_WEBHOOK_URL is not set. Skipping alert.');
        return;
    }

    // You can mention a user by ID if provided, e.g. <@123456789>
    const userId = process.env.DISCORD_USER_ID;
    const mention = userId ? `<@${userId}>` : '@everyone';

    const payload = {
        content: isUrgent ? `${mention} ${message}` : message,
        embeds: isUrgent ? [{
            title: "🚨 Stock Alert",
            description: message,
            color: 15158332 // Red
        }] : undefined
    };

    // If it's simple message
    const simplePayload = {
        content: message
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(isUrgent ? payload : simplePayload)
        });

        if (!response.ok) {
            console.error(`Failed to send Discord alert: ${response.status} ${response.statusText}`);
        } else {
            console.log('Discord alert sent successfully.');
        }
    } catch (error) {
        console.error('Error sending Discord alert:', error);
    }
};
