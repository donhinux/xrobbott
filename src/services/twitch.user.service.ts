import axios from "axios";

export class TwitchUserService {
    static readonly USERS_ENDPOINT: string = "https://api.twitch.tv/helix/users";
    static readonly FOLLOWS_ENDPOINT: 'https://api.twitch.tv/helix/users/follows';
    static readonly FOLLOWS_PAGE_SIZE: number = 20;

    static async getUserInfoByUsername(username: string, token: string) {
        const headers = {'Authorization': token, 'Client-Id': process.env.TWITCH_CLIENT_ID ?? ''};
        const params = {'login': username};
        const {data} = await axios.get(TwitchUserService.USERS_ENDPOINT, {headers, params});
        return data.data[0];
    }
    static async getUserFollowers( userId: string, authenticationToken:string, paginationToken?: string):Promise<any> {
        const headers = {'Authorization': authenticationToken, 'Client-Id': process.env.TWITCH_CLIENT_ID ?? ''};
        const params = {'to_id': userId, 'after': paginationToken};
        const {data} = await axios.get(TwitchUserService.FOLLOWS_ENDPOINT, {headers, params});
        return {followers: data.data, nextPageToken:data.pagination.cursor};
    }

    static async getAllUserFollowers(userId: string, authenticationToken:string) {
        let pageToken = ''
        let accFollowers: any[]=[];
        do {
            let {followers,nextPageToken} = await this.getUserFollowers(userId, authenticationToken, pageToken);
            accFollowers = [...accFollowers, ...followers];
            pageToken = nextPageToken;
        }
        while (pageToken);
        return accFollowers;
    }
}