import axios from "axios";

export class TwitchUserService {
    static readonly USERS_ENDPOINT: string = "https://api.twitch.tv/helix/users";

    static async getUserInfoByUsername(username: string, token: string) {
        const params = {
            "Authorization": token,
            "Client-Id": process.env.TWITCH_CLIENT_ID,
        };
        const {data} = await axios.get(TwitchUserService.USERS_ENDPOINT, {params});
        return data[0];
    }
}