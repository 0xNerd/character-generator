import dotenv from 'dotenv';  // Import dotenv
dotenv.config();
import { Character } from './types';
import fs from 'fs';
// add anthropic
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText as aiGenerateText } from "ai";

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });


async function generateCharacterJson(
    tokenName: string,
    tokenSymbol: string,
): Promise<Character> {
    const characterPrompt = `
    Generate a character file for a token named ${tokenName} with a symbol of ${tokenSymbol}. This is a character for a social media bot. 
    The character should be a human or a character that is relevant to the token.
    The JSON object should include the following fields: bio, lore, messageExamples, postExamples, topics, adjectives, style. 

    The bio should be a short description of the character in an array of strings (8-10 sentences).
    The lore should be a long description of the character in an array of strings (16-20 sentences).
    The messageExamples should be a list of messages that the character would send (10-12 messages).
    The postExamples should be a list of posts that the character would make in an array of strings (15-20 posts).
    The topics should be a list of topics that the character would be relevant to in an array of strings (17-20 topics).
    The adjectives should be a list of adjectives that describe the character in an array of strings (14-20 adjectives).
    The style should be a list of styles that the character would be relevant to in an array of strings (12-15 styles per category).

    The character file should be highly detailed and include all the information needed to create a character.
    
    Response must be output like this JSON:

    {
        "bio": ["string"],
        "lore": ["string"],
        "messageExamples": [
            {
                "user": "string", 
                "content": {
                    "text": "string",
                }
            }
        ],
        "postExamples": ["string"],
        "topics": ["string"],
        "adjectives": ["string"],
        "style": {"all": ["string"], "chat": ["string"], "post": ["string"]}
    }`;
    try {
        const options = {
            model: anthropic.languageModel("claude-3-5-sonnet-20241022"),
            prompt: characterPrompt,
            temperature: 0,
            maxTokens: 8192,
            frequencyPenalty: 0.5,
            presencePenalty: 0.5,
          };
      
        const { text: anthropicResponse } = await aiGenerateText(options);

        // parse the json
        const json = JSON.parse(anthropicResponse);

        // Create character object with top-level fields first
        const character: Character = {
            id: "uuid",
            name: "eliza",
            username: "eliza",
            modelProvider: "anthropic",
            ...json  // spread the AI-generated content after the required fields
        };

        console.log('character', character);
        // write the character to a file
        fs.writeFileSync('character.json', JSON.stringify(character, null, 2));
        return character;
       
    } catch (error) {
        console.error('Error generating character JSON:', error);
        throw error;
    }
}

generateCharacterJson('Token Name', 'Token Symbol');