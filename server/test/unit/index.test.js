"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const completionHandler_1 = __importDefault(require("../../src/api/completionHandler"));
const texts_1 = require("../../src/docs/texts");
// Mocking the methods of the singleton instance
jest.mock('../../src/api/completionHandler', () => ({
    __esModule: true,
    default: {
        getTitle: jest.fn(),
        getQuestions: jest.fn(),
        getSummary: jest.fn(),
        getTags: jest.fn(),
        getSentimentScore: jest.fn(),
        getGoals: jest.fn()
    },
}));
describe('CompletionHandler Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should return metadata title', async () => {
        const mockTitleResponse = { title: 'A Descriptive Title' };
        completionHandler_1.default.getTitle.mockResolvedValue(mockTitleResponse);
        const response = await completionHandler_1.default.getTitle(texts_1.testTexts.sampleEntry2);
        expect(response).toEqual(mockTitleResponse);
        expect(completionHandler_1.default.getTitle).toHaveBeenCalledWith(texts_1.testTexts.sampleEntry2);
    });
    it('should return metadata questions', async () => {
        const mockQuestionsResponse = { questions: ['Question 1', 'Question 2'] };
        completionHandler_1.default.getQuestions.mockResolvedValue(mockQuestionsResponse);
        const response = await completionHandler_1.default.getQuestions(texts_1.testTexts.sampleEntry2);
        expect(response).toEqual(mockQuestionsResponse);
        expect(completionHandler_1.default.getQuestions).toHaveBeenCalledWith(texts_1.testTexts.sampleEntry2);
    });
    it('should return a summary', async () => {
        const mockSummaryResponse = {
            summaries: [
                {
                    summary: 'Summary of the entry content.',
                    quote: 'Excerpt from the entry.',
                },
                {
                    summary: 'Another summary point.',
                    quote: 'Another excerpt from the entry.',
                },
            ],
        };
        completionHandler_1.default.getSummary.mockResolvedValue(mockSummaryResponse);
        const response = await completionHandler_1.default.getSummary(texts_1.testTexts.sampleEntry2);
        expect(response).toEqual(mockSummaryResponse);
        expect(completionHandler_1.default.getSummary).toHaveBeenCalledWith(texts_1.testTexts.sampleEntry2);
    });
    it('should return tags', async () => {
        const mockTagsResponse = { tags: ['tag1', 'tag2', 'tag3'] };
        completionHandler_1.default.getTags.mockResolvedValue(mockTagsResponse);
        const response = await completionHandler_1.default.getTags(texts_1.testTexts.sampleEntry2);
        expect(response).toEqual(mockTagsResponse);
        expect(completionHandler_1.default.getTags).toHaveBeenCalledWith(texts_1.testTexts.sampleEntry2);
    });
    it('should return sentiment score', async () => {
        const mockSentimentResponse = '0.60';
        completionHandler_1.default.getSentimentScore.mockResolvedValue(mockSentimentResponse);
        const response = await completionHandler_1.default.getSentimentScore(texts_1.testTexts.sampleEntry2);
        expect(response).toEqual(mockSentimentResponse);
        expect(completionHandler_1.default.getSentimentScore).toHaveBeenCalledWith(texts_1.testTexts.sampleEntry2);
    });
    it('should return goals', async () => {
        const mockGoalsResponse = { goals: ['Goal 1', 'Goal 2'] };
        completionHandler_1.default.getGoals.mockResolvedValue(mockGoalsResponse);
        const response = await completionHandler_1.default.getGoals(texts_1.testTexts.sampleEntry2);
        expect(response).toEqual(mockGoalsResponse);
        expect(completionHandler_1.default.getGoals).toHaveBeenCalledWith(texts_1.testTexts.sampleEntry2);
    });
});
