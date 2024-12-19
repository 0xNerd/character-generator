import dotenv from 'dotenv';  // Import dotenv
dotenv.config();
import { Character } from './types';
import fs from 'fs';
// add anthropic
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText as aiGenerateText } from "ai";
import crypto from 'crypto';

const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const characterTypes = [
  "entrepreneur", "scientist", "artist", "explorer", "philosopher", "inventor",
  "activist", "visionary", "leader", "innovator", "mentor", "pioneer",
  "knight", "alchemist", "monk", "merchant", "sage", "royal advisor",
  "court jester", "blacksmith", "scribe", "noble", "warrior", "mystic",
  "diplomat", "archaeologist", "astronaut", "detective", "journalist", "curator",
  "philanthropist", "strategist", "revolutionary", "scholar", "architect", "healer"
];

const timeSettings = [
  "modern day", "near future", "cyberpunk future", "post-apocalyptic world",
  "alternate history", "renaissance period", "industrial revolution era",
  "medieval times", "ancient civilization", "age of exploration", "golden age of piracy",
  "viking era", "ancient rome", "feudal japan", "silk road period",
  "steampunk world", "solarpunk utopia", "space colonization era", "magical realm",
  "digital consciousness age", "prehistoric times", "bronze age", "enlightenment period"
];

const personalityTraits = [
  "ambitious", "analytical", "creative", "diplomatic", "eccentric",
  "methodical", "rebellious", "strategic", "visionary", "pragmatic",
  "mysterious", "charismatic", "stoic", "zealous", "contemplative",
  "cunning", "honorable", "maverick", "sagacious", "tenacious",
  "enlightened", "machiavellian", "philosophical", "revolutionary", "transcendent",
  "unconventional", "virtuosic", "whimsical", "ethereal", "formidable"
];

const conflicts = [
  "internal struggle with identity", "rivalry with a competitor", "societal expectations",
  "technological advancement risks", "environmental challenges", "moral dilemmas",
  "power dynamics", "cultural preservation", "resource scarcity", "ideological differences",
  "divine right vs public will", "tradition vs progress", "honor vs survival",
  "loyalty vs truth", "faith vs reason", "duty vs desire", "heritage vs adaptation",
  "artificial intelligence ethics", "genetic engineering boundaries", "digital privacy",
  "cosmic exploration risks", "consciousness transfer ethics", "time paradox implications",
  "virtual reality addiction", "biotechnology limits", "quantum reality disputes"
];

const motivations = [
  "seeking redemption", "pursuing knowledge", "protecting loved ones", "achieving recognition",
  "creating lasting change", "discovering truth", "building legacy", "maintaining balance",
  "challenging status quo", "solving grand problems",
  "restoring family honor", "fulfilling prophecy", "avenging past wrongs",
  "preserving ancient wisdom", "uniting warring factions", "breaking curses",
  "transcending human limitations", "decoding universe secrets", "achieving immortality",
  "bridging dimensions", "evolving consciousness", "harmonizing opposites",
  "rewriting reality", "unlocking divine knowledge", "mastering time"
];

const backgrounds = [
  "self-made success", "aristocratic upbringing", "humble beginnings", "mysterious past",
  "academic excellence", "street-smart survivor", "cultural fusion", "technological prodigy",
  "spiritual journey", "revolutionary heritage",
  "prophesied chosen one", "exiled royalty", "apprentice to masters", "cursed bloodline",
  "forgotten dynasty", "sacred order initiate", "nomadic tribe leader", "ancient guild member",
  "dimensional traveler", "genetic experiment", "time displaced entity", "artificial being",
  "cosmic consciousness", "quantum anomaly", "parallel world refugee", "divine incarnation",
  "memory collective vessel", "universal constant guardian"
];

async function generateCharacterJson(
    characterData: {
        tokenName: string;
        tokenSymbol: string;
        bio?: string;
        lore?: string;
        knowledge?: string;
        topics?: string;
        adjectives?: string;
    }
): Promise<Character> {
    // Randomly select elements to make each character unique
    const characterType = characterTypes[Math.floor(Math.random() * characterTypes.length)];
    const timeSetting = timeSettings[Math.floor(Math.random() * timeSettings.length)];
    const trait = personalityTraits[Math.floor(Math.random() * personalityTraits.length)];
    
    // Add more random selections
    const conflict = conflicts[Math.floor(Math.random() * conflicts.length)];
    const motivation = motivations[Math.floor(Math.random() * motivations.length)];
    const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    
    const characterPrompt = `
        Generate a completely unique character file for a token named ${characterData.tokenName} with a symbol of ${characterData.tokenSymbol}. 
        The character should be a ${trait} ${characterType} in a ${timeSetting} setting.
        Their primary conflict is ${conflict}, motivated by ${motivation}, with a background of ${background}.
        ${characterData.bio ? `Use this bio as inspiration: ${characterData.bio}` : ''}
        ${characterData.lore ? `Incorporate this lore: ${characterData.lore}` : ''}
        ${characterData.knowledge ? `Include this knowledge base: ${characterData.knowledge}` : ''}
        ${characterData.topics ? `Focus on these topics: ${characterData.topics}` : ''}
        ${characterData.adjectives ? `Emphasize these character traits: ${characterData.adjectives}` : ''}
        Make sure this character is distinct and has never-before-seen qualities.
        
        The JSON object should include the following fields: name, username, bio, lore, messageExamples, postExamples, topics, adjectives, style. 

        The name should be a short name for the character.
        The username should be a short username for the character.
        The bio should be a short description of the character in an array of strings (15-18 sentences).
        The lore should be a long description of the character in an array of strings (25-30 sentences).
        The messageExamples should be a list of messages that the character would send (16-19 messages).
        The postExamples should be a list of posts that the character would make in an array of strings (25-29 posts).
        The topics should be a list of topics that the character would be relevant to in an array of strings (28-34 topics).
        The adjectives should be a list of adjectives that describe the character in an array of strings (22-26 adjectives).
        The style should be a list of styles that the character would be relevant to in an array of strings (22-26 styles per category).

        The character file should be highly detailed and include all the information needed to create a character.
        
        Response must be output like this JSON:

        {
            "name": "string",
            "username": "string",
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
            temperature: 0.8,
            maxTokens: 8192,
            frequencyPenalty: 0.8,
            presencePenalty: 0.8,
          };
      
        const { text: anthropicResponse } = await aiGenerateText(options);

        // parse the json
        const json = JSON.parse(anthropicResponse);

        // Create character object with top-level fields first
        const character: Character = {
            id: crypto.randomUUID(), // Using crypto for UUID generation
            name: json.name || characterData.tokenName.toLowerCase().replace(/\s+/g, '-'),
            username: json.username || characterData.tokenName.toLowerCase().replace(/\s+/g, '_'),
            modelProvider: "anthropic",
            ...json
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

generateCharacterJson({
    tokenName: "Token Name",
    tokenSymbol: "Token Symbol",
    bio: "Bio",
    lore: "Lore",
    knowledge: "Knowledge",
    topics: "Topics",
    adjectives: "Adjectives",
});
