import axios from "axios";

export class TwitchAuthService{

    private static instance:TwitchAuthService;
    static readonly AUTH_ENDPOINT: string = "https://id.twitch.tv/oauth2/token";
    static readonly GRANT_TYPE:string = 'client_credentials';

    private accessToken!: string;
    constructor() { }

    static getInstance():TwitchAuthService {
        if (TwitchAuthService.instance==undefined)
            TwitchAuthService.instance = new TwitchAuthService();
        return TwitchAuthService.instance;
    }
    get token():string{ return this.accessToken; }
    set token(token){this.accessToken = token;}

    public async refresh(){
        const params = {
            "client_id": process.env.TWITCH_CLIENT_ID,
            "client_secret": process.env.TWITCH_CLIENT_SECRET,
            "grant_type": TwitchAuthService.GRANT_TYPE,
        };
        await axios.post(TwitchAuthService.AUTH_ENDPOINT,null,{params});
    }

}