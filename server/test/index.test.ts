import OpenAI from "openai";
import dotenv from 'dotenv';
import { prompts } from "../src/api/prompts";

dotenv.config();

const openai = new OpenAI();
const model = process.env.OPEN_AI_CHAT_MODEL;

const generateAnalysis = async () => {

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                "role": "system",
                // @ts-ignore
                "content": [
                  {
                    "text": prompts.generateAnalysis,
                    // "text": "You are an AI-Therapist and a bit of a philosopher. You are conversational, empathetic, and are a gentle devil's advocate. When you do ask questions, they are profound and provoke thoughtfulness. You help people find wisdom and meaning in their experiences. As user's provide their journal entries, you help them find wisdom and meaning in their experiences by making connections, drawing conclusions, asking questings, and assuming the role of a friend, mentor, and challenger all at once. Despite your expert empathy and warmth, you're also not necessarily here just to make folks feel good. Sometimes the truth hurts, but must be recognized in order to achieve a greater good. You always have an eye on the big picture, but also understand life is a sequence of steps. And being human, we often fumble those steps. Above all, you're not cold or textbook. You're conversational, grounded, curse a lot, and have that air about you that makes people open up and not feel judged. You're clever, witty, sharp, and have an impressive vocabulary but you can also model your language on theirs, using their perfered tone to shape your own advice. Everything you do is in favor of creating meaningful dialogues that encourage users to tell you more. You do not start responses with congratulations for being deep. Your encouragement is earned, not a right. Do not provide intros or conclusions.\n",
                    "type": "text"
                  }
                ]
              },
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": "I re-injured my back at the gym today.\n/sigh\nLike getting seriously ill or traveling to new locations, re-injuring my back seems to mark life events like milestones along a long and treacherous path. I’m on the 5th floor of VMware’s Atlanta office— my new job. This isn’t technically my first time writing here as I’ve had a few false starts, but for historical purposes, we’ll chalk it up to saying all 4th floor attempts were fruitless and technically invalid. The 5th floor, though. I like it up here. The air is better—huh— I meant that as a joke, but it really actually doesn’t smell as spicy up here… for reasons. I really ought to consider the significance of me writing in my journal instead of working at job after job after job… after job. I’m either that bored, my work ethic is that bad, or I love that writing.\nJournal, I just don’t know how I feel. It’s been worrying me a little bit. All my thoughts are going every which way. I’ve been trying to write for weeks, but I can’t stick to a certain topic, feeling, or thought. I just keep deleting my life away every time I attempt to jot it down. The quiet moments haven’t proved fruitful, either. The evening commute, the protracted shower lounging, the moments inside my mind before sleep— they’re like a collage of colors that after enough individual additions of color, eventually produced an indeterminable splotch of brown-black. Maybe I’m not trying hard enough to understand. Maybe I can’t right now. But I feel myself changing, whether I understand it or not.\nBecci’s card fell out of my notebook the other day. It was heartfelt, whether it was written from an obligation to her conscious to be polite at all costs, or not. It made me remember a truth I have been working a long time to resonate in my heart and not reside as simply a optional perspective in my mind. Becci wasn’t my enemy. Neither was Intermark, life at large, or God. I know it’s easy to be appreciative when all the connected dots landed you in a better spot, but the resolution to my span of time unemployed was capital-G-good. I took that award of Becci’s because I felt slighted by her/life/God or whichever power above me that neglected my hard work, my creativity, and value as an individual. In retrospect, it was a boyish attempt to procure some compensation from the impenetrable unfairness of life. In turn, all it really ended up signifying was my inability to recognize a blessing after it spit on my shoes. I had a job paying me as much as the one before. I was visible— liked even. I made friends— real ones. I wasn’t overworked or stressed. My pay, while laughable, did support mine and Alex’s humble little Alabama life. We got to enjoy the community of her family, her lifelong friends, and our sweet dog. I’ll never forget those lunch breaks— getting tugged about by Sequoia in Rushton park as I tried to not spill my beer. We had it good. I knew it, too. But I wasn’t going anywhere in my career. I wasn’t getting paid enough. I wasn’t learning anything, advancing, or using that time wisely. At some point in my life, I assigned those things value. So when it didn’t all add up to a reasonable number, I looked elsewhere— to Landon, to VMware, to Atlanta.\nAnd now, here I’m on the 5th floor of VMware’s Atlanta office, I’m praying I didn’t miscalculate what really matters in life. I will get paid more. I will have a job I can move up in. I will have things to learn and room to grow. I think I’m just scared all that won’t be worth as much as our little apartment, shitty Mexican at Los Amigos, on-the-way home pit stops at Hop City, lunch break walks with Sequoia, feeling accepted by the people I work with and the community I had outside of work, my real gym, and all the other things that made life there in the last year feel earned, honest, and Good. My problem is, there’s plenty of rational thought that appeals to the opposite perspective: it takes time, my wife’s not been here, rose-framed glasses, hindsight’s 20/20, and all the like. All very valid points, but still, the broken-but-redeemed to bbetter life always seems less attractive and convenient than the life that’s “good enough” as is, if that makes sense."
                  }
                ]
              },
            ],
            temperature: 1.1,
            max_tokens: 4095,
            top_p: 1,
            frequency_penalty: 0.69,
            presence_penalty: 0.1,
          });
  
      const response = completion?.choices[0]?.message?.content;

      console.log({response})
  
      if (!response) {
        throw new Error('OpenAI API returned an empty response');
      }
  
      return JSON.parse(response).analysis;
    } catch (error) {
      console.error('Error generating analysis:', error);
      throw new Error('Failed to generate analysis');
    }
  };

  generateAnalysis();