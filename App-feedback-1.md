I want to make a note of all the changes that I want in the interview screen because I don't like it as much. There are some major issues with it. 

Right off the bat, when I click on Begin Interview with Alex, sometimes he may not say anything at all, and I have to reload the page for him to start with "Hi Samarth, I am a senior interviewer from a top-tier company" or whatever he says. That is something that needs to be fixed. I don't know why this is happening. If you want any console logs for it, I can give those logs. Sometimes I have to reload it, not every time, but sometimes it's required. That should not happen in a top-tier product like I am aiming for. 

Additionally, I think that sometimes when I take a pause to think, it automatically considers that I have finished speaking and starts processing the thing that I was speaking. In that case, when it's processing, I'm not able to say anything, so during the time it's processing, I cannot interrupt it. Whatever I'm saying is not actually being captured. In that scenario, what I think we can do is we can let it capture whatever I'm saying still and keep feeding it to the LLM as a blob. 

Also, sometimes what happens is that it starts capturing the noise my fan is making and stuff, so that it should not happen. It's just a very low voice, so it should not consider that.

Another option for the previous point that I was talking about is that I can potentially have a 1 s cool-down period, or an 800 ms cool-down period, or maybe a 1 s cool-down period, after which it considers that yes, I have completely stopped speaking and now it can start analyzing again. 

The TTS is still an issue. It's where it takes too much time, and that's why it doesn't feel like an actual interview, because it feels like I'm talking to someone who is processing the whole thing and then it's replying. This needs to be resolved.

Earlier, I was using ElevenLabs, and that was working fine, but I got banned because I tried to misuse their API, so you need to fix this.

Apart from that, if we ignore the TTS once, is it even possible for Nova 2 or any other TTS service to be as fast as ElevenLabs, because ElevenLabs was giving me great results? I was really happy with those results. 