/*
*   Should test the totality of the Authentication Service
*/
import {TwitchAuthService} from "./twitch.auth.service";

describe('Twitch Authentication Service', ()=>{

    it('should verify if there is only a single instance',()=>{
        const twitchAuthOriginal = TwitchAuthService.getInstance();
        twitchAuthOriginal.token ='TEST-TOKEN';
        const twitchAuthNew = TwitchAuthService.getInstance();
        expect(twitchAuthNew).toBe(twitchAuthOriginal);
    });
    it.todo('should verify if the parameters sent to the Twitch API have the right format');
    it.todo('should verify if the Twitch API return is valid');
    it.todo('should verify if it includes de possibility of validating the token');
    it.todo('should verify if it includes de possibility of refreshing the token');

});