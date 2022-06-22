/*
* Should test the user service entirely
*  */
import axios from "axios";
import {TwitchUserService} from "./twitch.user.service";

jest.mock('axios');
describe('Twitch User Service', function () {

    const token = 'TEST-TOKEN';
    afterEach(()=>{
        jest.clearAllMocks();
    });

    it('should return the user info from Twitch Users API', async () => {
        const username = "TEST-USER-1";
        const response = [{
            "id": "TEST-ID-1",
            "login": username
        }];
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({data:response});
        const userInfo = await TwitchUserService.getUserInfoByUsername(username, token);
        expect(userInfo).toEqual(response[0]);
    });
    it('should touch the Twitch Users API with the right params', async () => {
        const username = "TEST-USER-2";
        const response = [{
            "id": "TEST-ID-2",
            "login": username
        }];
        const params = {
            "Authorization": token,
            "Client-Id": process.env.TWITCH_CLIENT_ID,
        };
        (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({data:response});
        await TwitchUserService.getUserInfoByUsername(username, token);
        expect(axios.get).toHaveBeenCalledWith(TwitchUserService.USERS_ENDPOINT, {params});
    });

});