import CompletionHandler from '../../src/api/completionHandler';
import { testTexts } from "../../src/docs/texts";

jest.mock('../../src/api/completionHandler', () => ({
  __esModule: true,
  default: {
    getTitle: jest.fn(),
    getQuestions: jest.fn(),
    getSummary: jest.fn(),
  },
}));

describe('CompletionHandler Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return metadata title', async () => {
    const mockTitleResponse = { title: 'A Descriptive Title' };
    (CompletionHandler.getTitle as jest.Mock).mockResolvedValue(mockTitleResponse);

    const response = await CompletionHandler.getTitle(testTexts.sampleEntry2);

    expect(response).toEqual(mockTitleResponse);
    expect(CompletionHandler.getTitle).toHaveBeenCalledWith(testTexts.sampleEntry2);
  });

  it('should return metadata questions', async () => {
    const mockQuestionsResponse = { questions: ['Question 1', 'Question 2'] };
    (CompletionHandler.getQuestions as jest.Mock).mockResolvedValue(mockQuestionsResponse);

    const response = await CompletionHandler.getQuestions(testTexts.sampleEntry2);

    expect(response).toEqual(mockQuestionsResponse);
    expect(CompletionHandler.getQuestions).toHaveBeenCalledWith(testTexts.sampleEntry2);
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
    (CompletionHandler.getSummary as jest.Mock).mockResolvedValue(mockSummaryResponse);

    const response = await CompletionHandler.getSummary(testTexts.sampleEntry2);

    expect(response).toEqual(mockSummaryResponse);
    expect(CompletionHandler.getSummary).toHaveBeenCalledWith(testTexts.sampleEntry2);
  });
});
