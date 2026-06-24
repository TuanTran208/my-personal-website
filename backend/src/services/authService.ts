import jwt from 'jsonwebtoken';



/**
 * AuthService handles authentication logic such as JWT generation,
 * OAuth providers integration (Discord, Google), and user validation.
 */
class AuthService {

    /**
     * Exchanges the Discord OAuth code for an access token and fetches the user profile.
     */
    async handleDiscordLogin(code: string) {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;
        const redirectUri = process.env.DISCORD_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error("Discord OAuth environment variables are not fully configured.");
        }

        // 1. Exchange code for token
        const params = new URLSearchParams({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirectUri
        });

        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        if (!tokenResponse.ok) {
            const errorDetails = await tokenResponse.text();
            throw new Error(`Failed to fetch Discord token: ${tokenResponse.statusText} - ${errorDetails}`);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 2. Fetch User Profile
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!userResponse.ok) {
            throw new Error(`Failed to fetch Discord user profile: ${userResponse.statusText}`);
        }

        const discordUser = await userResponse.json();
        return discordUser;
    }

    async handleGoogleLogin(code: string) {
        throw new Error("Method not implemented.");
    }

    /**
     * Issues a JWT containing user ID, username, avatar and owner status.
     */
    generateToken(discordUser: any) {

        const ownerId = process.env.DISCORD_OWNER_ID || '';
        const jwtSecret = process.env.JWT_SECRET || 'pandory_fallback_secret';
        const isOwner = ownerId !== '' && discordUser.id === ownerId;
        const payload = {
            id: discordUser.id,
            username: discordUser.username,
            avatar: discordUser.avatar,
            isOwner
        };

        // Token expires in 7 days
        return jwt.sign(payload, jwtSecret, { expiresIn: '7d' });
    }

    verifyToken(token: string) {
        const jwtSecret = process.env.JWT_SECRET || 'pandory_fallback_secret';
        try {
            return jwt.verify(token, jwtSecret);
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();
