export class TwitchAuthService{

    private static instance:TwitchAuthService;
    private accessToken!: string;

    constructor() { }

    static getInstance():TwitchAuthService {
        if (TwitchAuthService.instance==undefined)
            TwitchAuthService.instance = new TwitchAuthService();
        return TwitchAuthService.instance;
    }
    get token():string{ return this.accessToken; }
    set token(token){this.accessToken = token;}
}