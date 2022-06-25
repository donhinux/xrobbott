/*
* Should test the user service entirely
*  */
import axios from "axios";
import {TwitchUserService} from "./twitch.user.service";

jest.mock('axios');
describe('Twitch User Service', function () {

    const authenticationToken = 'TEST-TOKEN';
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the user info from Twitch Users API', async () => {
        const username = "TEST-USER-1";
        const response = {
            data: [{
                "id": "TEST-ID-1",
                "login": username
            }]
        };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({data: response});
        const userInfo = await TwitchUserService.getUserInfoByUsername(username, authenticationToken);
        expect(userInfo).toEqual(response.data[0]);
    });
    it('should touch the Twitch Users Info endpoint with the right params', async () => {
        const username = "TEST-USER-2";
        const response = {
            data: [{
                "id": "TEST-ID-2",
                "login": username
            }]
        };
        const headers = {
            "Authorization": authenticationToken,
            "Client-Id": process.env.TWITCH_CLIENT_ID,
        };
        const params = {'login': username};
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({data: response});
        await TwitchUserService.getUserInfoByUsername(username, authenticationToken);
        expect(axios.get).toHaveBeenCalledWith(TwitchUserService.USERS_ENDPOINT, {headers, params});
    });

    it('should fetch a page of followers of a user', async () => {
        const response = {
            "total": 2,
            "data":
                [
                    {
                        "from_id": "171003792",
                        "from_login": "iiisutha067iii",
                        "from_name": "IIIsutha067III",
                        "to_id": "23161357",
                        "to_name": "LIRIK",
                        "followed_at": "2017-08-22T22:55:24Z"
                    },
                    {
                        "from_id": "113627897",
                        "from_login": "birdman616",
                        "from_name": "Birdman616",
                        "to_id": "23161357",
                        "to_name": "LIRIK",
                        "followed_at": "2017-08-22T22:55:04Z"
                    },
                ],
            "pagination": {
                "cursor": "eyJiIjpudWxsLCJhIjoiMTUwMzQ0MTc3NjQyNDQyMjAwMCJ9"
            }
        };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({data: response});
        const {followers} = await TwitchUserService.getUserFollowers('0001', authenticationToken, 'PAGINATION-TOKEN');
        expect(followers.length).toBeLessThanOrEqual(TwitchUserService.FOLLOWS_PAGE_SIZE);
    });
    it('should touch the follows endpoint when fetching the followers with expected params', async () => {
        const userId = "001";
        const paginationToken = 'PAGINATION-TOKEN';
        const headers = {
            "Authorization": authenticationToken,
            "Client-Id": process.env.TWITCH_CLIENT_ID,
        };
        const params = {'to_id': userId, after: paginationToken};
        await TwitchUserService.getUserFollowers(userId, authenticationToken, paginationToken);
        expect(axios.get).toHaveBeenCalledWith(TwitchUserService.FOLLOWS_ENDPOINT, {headers, params});
    });

    it('should return followers if total count bigger than 0', async ()=>{
        const userId = "001";
        const paginationToken = 'PAGINATION-TOKEN';
        const response = {
            "total": 2,
            "data":
                [
                    {
                        "from_id": "171003792",
                        "from_login": "iiisutha067iii",
                        "from_name": "IIIsutha067III",
                        "to_id": "23161357",
                        "to_name": "LIRIK",
                        "followed_at": "2017-08-22T22:55:24Z"
                    },
                    {
                        "from_id": "113627897",
                        "from_login": "birdman616",
                        "from_name": "Birdman616",
                        "to_id": "23161357",
                        "to_name": "LIRIK",
                        "followed_at": "2017-08-22T22:55:04Z"
                    },
                ],
            "pagination": {
                "cursor": "eyJiIjpudWxsLCJhIjoiMTUwMzQ0MTc3NjQyNDQyMjAwMCJ9"
            }
        };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({data: response});
        const {followers} = await TwitchUserService.getUserFollowers(userId, authenticationToken, paginationToken);
        expect(followers.length).toEqual(2);
    });
    it('should fetch all the followers of a user', async () => {
        TwitchUserService.getUserFollowers = jest.fn();
        (TwitchUserService.getUserFollowers as jest.MockedFunction<typeof TwitchUserService.getUserFollowers>)
            .mockResolvedValueOnce({"followers":[ {"from_id": "171003792","from_login": "teste1",},],"nextPageToken": "1"})
            .mockResolvedValueOnce({"followers":[ {"from_id": "171003792","from_login": "teste2",},],"nextPageToken": "2"})
            .mockResolvedValueOnce({"followers":[ {"from_id": "171003792","from_login": "teste3",},],});
        const userId = "002";
        const totalFollowers = 3;
        const followers = await TwitchUserService.getAllUserFollowers(userId, authenticationToken);
        expect(followers.length).toEqual(totalFollowers);
    });
    it('should call the get followers until all the followers where got', async () => {
        TwitchUserService.getUserFollowers = jest.fn();
        (TwitchUserService.getUserFollowers as jest.MockedFunction<typeof TwitchUserService.getUserFollowers>)
            .mockResolvedValueOnce({"followers":[ {"from_id": "171003792","from_login": "teste1",},],"nextPageToken": "1"})
            .mockResolvedValueOnce({"followers":[ {"from_id": "171003792","from_login": "teste2",},],"nextPageToken": "2"})
            .mockResolvedValueOnce({"followers":[ {"from_id": "171003792","from_login": "teste3",},],});
        const userId = "003";
        const followers = await TwitchUserService.getAllUserFollowers(userId, authenticationToken);
        console.log(followers);
        expect(TwitchUserService.getUserFollowers)
            .toHaveBeenCalledTimes(3);
    });

    it.todo('should fetch all the follows from a user');

});