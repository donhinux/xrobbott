import axios from "axios";

export class TwitchUserService {
    static readonly USERS_ENDPOINT: string = "https://api.twitch.tv/helix/users";

    static async getUserInfoByUsername(username: string, token: string) {
        const headers = {'Authorization': token, 'Client-Id': process.env.TWITCH_CLIENT_ID ?? ''};
        const params = {'login': username};
        const {data} = await axios.get(TwitchUserService.USERS_ENDPOINT, {headers, params});
        return data.data[0];
    }
}