/*
*   Should test the totality of the Authentication Service
*/
import {TwitchAuthService} from "./twitch.auth.service";
import axios from "axios";

jest.mock('axios');

describe('Twitch Authentication Service', () => {

    it('should verify if there is only a single instance', () => {
        const twitchAuthOriginal = TwitchAuthService.getInstance();
        twitchAuthOriginal.token = 'TEST-TOKEN';
        const twitchAuthNew = TwitchAuthService.getInstance();
        expect(twitchAuthNew).toBe(twitchAuthOriginal);
    });

    it('should verify if the getter actually returns the current token', () => {
        const twitchAuthOriginal = TwitchAuthService.getInstance();
        const token = "TEST-TOKEN";
        twitchAuthOriginal.token = token;
        const tokenResult = twitchAuthOriginal.token;
        expect(tokenResult).toBe(token);
    });

    it('should verify if the parameters sent to the Twitch API have the right format', async () => {
        const twitchAuth = TwitchAuthService.getInstance();
        const params = {
            "client_id": process.env.TWITCH_CLIENT_ID,
            "client_secret": process.env.TWITCH_CLIENT_SECRET,
            "grant_type": TwitchAuthService.GRANT_TYPE,
        };
        await twitchAuth.refresh();
        expect(axios.post).toHaveBeenCalledWith(TwitchAuthService.AUTH_ENDPOINT, null, {params});
    });

    it.todo('should verify if the Twitch API return is valid');
    it.todo('should verify if it includes de possibility of validating the token');
    it.todo('should verify if it includes de possibility of refreshing the token');

});