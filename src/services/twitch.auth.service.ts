import axios from "axios";

export class TwitchAuthService{

    private static instance:TwitchAuthService|undefined;
    static readonly AUTH_ENDPOINT: string = "https://id.twitch.tv/oauth2/token";
    static readonly AUTH_ENDPOINT_VALIDATE: string = "https://id.twitch.tv/oauth2/validate";
    static readonly GRANT_TYPE:string = 'client_credentials';

    private accessToken!: string;
    private constructor() { }

    static getInstance():TwitchAuthService {
        if (TwitchAuthService.instance==undefined)
            TwitchAuthService.instance = new TwitchAuthService();
        return TwitchAuthService.instance;
    }
    get token():string{
        return this.accessToken;
    }
    set token(token){this.accessToken = token;}

    public async refresh(){
        const params = {
            "client_id": process.env.TWITCH_CLIENT_ID,
            "client_secret": process.env.TWITCH_CLIENT_SECRET,
            "grant_type": TwitchAuthService.GRANT_TYPE,
        };
        const {data} = await axios.post(TwitchAuthService.AUTH_ENDPOINT, null, {params});
        this.token = `Bearer ${data.access_token}`;
    }

    static dispose(){ TwitchAuthService.instance = undefined; }

    async isValid() {
        if (!this.token) return false;
        const headers = {
            "Authorization": this.token,
        };
        const {status} = await axios.get(TwitchAuthService.AUTH_ENDPOINT_VALIDATE,{headers});
        return status===200;
    }

    async getValidToken(){
        if(!await this.isValid())
        {
            await this.refresh();
        }
        return this.token;
    }
}