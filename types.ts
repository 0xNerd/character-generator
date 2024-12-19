// Add these type definitions at the top of the file
type UUID = string;

/**
 * Example message for demonstration
 */
interface MessageExample {
    /** Associated user */
    user: string;

    /** Message content */
    content: Content;
}

/**
 * Represents the content of a message or communication
 */
interface Content {
    /** The main text content */
    text: string;

    /** Optional action associated with the message */
    action?: string;

    /** Optional source/origin of the content */
    source?: string;

    /** URL of the original message/post (e.g. tweet URL, Discord message link) */
    url?: string;

    /** UUID of parent message if this is a reply/thread */
    inReplyTo?: UUID;

    /** Array of media attachments */
    attachments?: Media[];

    /** Additional dynamic properties */
    [key: string]: unknown;
}

/**
 * Represents a media attachment
 */
type Media = {
    /** Unique identifier */
    id: string;

    /** Media URL */
    url: string;

    /** Media title */
    title: string;

    /** Media source */
    source: string;

    /** Media description */
    description: string;

    /** Text content */
    text: string;
};

/**
 * Configuration for an agent character
 */
export type Character = {
    /** Optional unique identifier */
    id?: UUID;

    /** Character name */
    name: string;

    /** Optional username */
    username?: string;

    /** Optional system prompt */
    system?: string;

    /** Model provider to use */
    modelProvider: string;

    /** Image model provider to use, if different from modelProvider */
    imageModelProvider?: string;

    /** Optional model endpoint override */
    modelEndpointOverride?: string;

    /** Optional prompt templates */
    templates?: {
        goalsTemplate?: string;
        factsTemplate?: string;
        messageHandlerTemplate?: string;
        shouldRespondTemplate?: string;
        continueMessageHandlerTemplate?: string;
        evaluationTemplate?: string;
        twitterSearchTemplate?: string;
        twitterPostTemplate?: string;
        twitterMessageHandlerTemplate?: string;
        twitterShouldRespondTemplate?: string;
        farcasterPostTemplate?: string;
        farcasterMessageHandlerTemplate?: string;
        farcasterShouldRespondTemplate?: string;
        telegramMessageHandlerTemplate?: string;
        telegramShouldRespondTemplate?: string;
        discordVoiceHandlerTemplate?: string;
        discordShouldRespondTemplate?: string;
        discordMessageHandlerTemplate?: string;
        wordpressPostTemplate?: string;
    };

    /** Character biography */
    bio: string | string[];

    /** Character background lore */
    lore: string[];

    /** Example messages */
    messageExamples: MessageExample[][];

    /** Example posts */
    postExamples: string[];

    /** Known topics */
    topics: string[];

    /** Character traits */
    adjectives: string[];

    /** Optional knowledge base */
    knowledge?: string[];

    /** Supported client platforms */
    clients: string[];

    /** Available plugins */
    plugins: string[];

    /** Optional configuration */
    settings?: {
        secrets?: { [key: string]: string };
        intiface?: boolean;
        voice?: {
            model?: string; // For VITS
            url?: string; // Legacy VITS support
            elevenlabs?: {
                // New structured ElevenLabs config
                voiceId: string;
                model?: string;
                stability?: string;
                similarityBoost?: string;
                style?: string;
                useSpeakerBoost?: string;
            };
        };
        model?: string;
        embeddingModel?: string;
        chains?: {
            evm?: any[];
            solana?: any[];
            [key: string]: any[] | undefined;
        };
    };

    /** Optional client-specific config */
    clientConfig?: {
        discord?: {
            shouldIgnoreBotMessages?: boolean;
            shouldIgnoreDirectMessages?: boolean;
            messageSimilarityThreshold?: number;
            isPartOfTeam?: boolean;
            teamAgentIds?: string[];
            teamLeaderId?: string;
            teamMemberInterestKeywords?: string[];
        };
        telegram?: {
            shouldIgnoreBotMessages?: boolean;
            shouldIgnoreDirectMessages?: boolean;
        };
    };

    /** Writing style guides */
    style: {
        all: string[];
        chat: string[];
        post: string[];
    };

    /** Optional Twitter profile */
    twitterProfile?: {
        id: string;
        username: string;
        screenName: string;
        bio: string;
        nicknames?: string[];
    };
};