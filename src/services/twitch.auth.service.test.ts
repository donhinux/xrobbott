/*
*   Should test the totality of the Authentication Service
*/
import {TwitchAuthService} from "./twitch.auth.service";
import axios from "axios";

jest.mock('axios');

describe('Twitch Authentication Service', () => {

    let twitchAuth: TwitchAuthService;
    const token = 'ACCESS_TOKEN';
    beforeEach(() => {
        jest.resetModules();
        TwitchAuthService.dispose();
        twitchAuth = TwitchAuthService.getInstance();
    });

    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should verify if there is only a single instance', () => {
        twitchAuth.token = token;
        const twitchAuthNew = TwitchAuthService.getInstance();
        expect(twitchAuthNew).toBe(twitchAuth);
    });

    it('should verify if it includes de possibility of disposing the instance', () => {
        twitchAuth.token = token;
        TwitchAuthService.dispose();
        const twitchAuthNew = TwitchAuthService.getInstance();
        expect(twitchAuthNew).not.toBe(twitchAuth);
    });

    it('should verify if the getter actually returns the current token', () => {
        twitchAuth.token = token;
        const tokenResult = twitchAuth.token;
        expect(tokenResult).toBe(token);
    });

    it('should verify if the parameters sent to the Twitch API have the right format', async () => {
        const params = {
            "client_id": process.env.TWITCH_CLIENT_ID,
            "client_secret": process.env.TWITCH_CLIENT_SECRET,
            "grant_type": TwitchAuthService.GRANT_TYPE,
        };
        const data = {
            config: {}, headers: {}, status: 200, statusText: "", data: {
                "access_token": token,
                "expires_in": 1,
                "token_type": "bearer"
            }
        };
        (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue(data);
        await twitchAuth.refresh();
        expect(axios.post).toHaveBeenCalledWith(TwitchAuthService.AUTH_ENDPOINT, null, {params});
    });

    it('should verify if the Twitch API return is valid', async () => {
        const data = {
            config: {}, headers: {}, status: 200, statusText: "", data: {
                "access_token": token,
                "expires_in": 1,
                "token_type": "bearer"
            }
        };
        (axios.post as jest.MockedFunction<typeof axios.post>).mockResolvedValue(data);
        await twitchAuth.refresh();
        expect(twitchAuth.token).toEqual(`Bearer ${token}`);
    });

    it('should verify if it includes de possibility of validating the token', async ()=>{
        const status = 200;
        twitchAuth.token = token;
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({status, data: {}});
        expect(await twitchAuth.isValid()).toEqual(true);
    });

    it('should verify if it there is no token', async ()=>{
        expect(await twitchAuth.isValid()).toEqual(false);
    });

    it('should verify if Twitch API was touched for validating the token with right params', async ()=> {
        const status = 200;
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({status, data: {}});
        twitchAuth.token = token;
        const headers = {
            "Authorization": twitchAuth.token,
        };
        await twitchAuth.isValid();
        expect(axios.get).toHaveBeenCalledWith(TwitchAuthService.AUTH_ENDPOINT_VALIDATE,{headers});
    });

    it('should verify if Twitch API for validating the token returns a valid response', async ()=> {
        const status = 401;
        const data = {};
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({status, data});
        twitchAuth.token = token;
        const isValid = await twitchAuth.isValid();
        expect(isValid).toEqual(false);
    });

    it('should verify if it includes de possibility of refreshing the token if not valid', async ()=>{

        const mockedRefresh = jest.fn();
        const mockedIsValid = jest.fn();
        mockedIsValid.mockReturnValue(false);

        twitchAuth.isValid = mockedIsValid;
        twitchAuth.refresh = mockedRefresh;

        await twitchAuth.getValidToken();
        expect(twitchAuth.isValid).toHaveBeenCalledTimes(1);
        expect(twitchAuth.refresh).toHaveBeenCalledTimes(1);
    });

});