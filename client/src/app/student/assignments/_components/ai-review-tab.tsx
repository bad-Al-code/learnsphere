'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  AlertTriangle,
  BookOpen,
  Bot,
  Brain,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Filter,
  Lightbulb,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from 'lucide-react';
import React, { useRef, useState } from 'react';

type TAnalysisType = 'grammar' | 'structure' | 'plagiarism' | 'comprehensive';
type TReviewResult = {
  type: TAnalysisType;
  score: number;
  suggestions: string[];
  strengths: string[];
  improvements: string[];
  plagiarismMatch?: number;
  readabilityScore?: number;
  wordCount: number;
  estimatedTime: string;
};

type TAssignmentDraft = {
  id: string;
  title: string;
  content: string;
  subject: string;
  type: string;
  createdAt: string;
  lastModified: string;
  wordCount: number;
  status: 'draft' | 'reviewed' | 'submitted';
  aiScore?: number;
};

const mockSuggestions = {
  grammar: [
    'Consider using active voice in paragraph 2 for stronger impact',
    'Check subject-verb agreement in the third sentence',
    "Replace 'very' with more specific adjectives for precision",
  ],
  structure: [
    'Add transition sentences between paragraphs 2 and 3',
    'Consider reorganizing arguments from weakest to strongest',
    'Your conclusion could better summarize key points',
  ],
  comprehensive: [
    'Strengthen your thesis statement with more specific claims',
    'Add more evidence to support your argument in paragraph 4',
    'Consider addressing potential counterarguments',
    'Improve flow between ideas with better transitions',
  ],
  plagiarism: [],
};

const mockStrengths = {
  grammar: [
    'Clear and concise writing style',
    'Good use of academic vocabulary',
  ],
  structure: [
    'Strong introduction',
    'Well-organized paragraphs',
    'Clear topic sentences',
  ],
  comprehensive: [
    'Original insights',
    'Strong evidence',
    'Engaging writing style',
    'Clear argumentation',
  ],
  plagiarism: [],
};

const sampleDrafts: TAssignmentDraft[] = [
  {
    id: '1',
    title: 'The Impact of Social Media on Modern Communication',
    content:
      'Social media has fundamentally transformed how we communicate in the 21st century...',
    subject: 'Communications',
    type: 'Essay',
    createdAt: '2024-01-15',
    lastModified: '2024-01-16',
    wordCount: 1247,
    status: 'draft',
    aiScore: 78,
  },
  {
    id: '2',
    title: 'Climate Change Solutions for Urban Areas',
    content:
      'Urban environments face unique challenges when addressing climate change...',
    subject: 'Environmental Science',
    type: 'Research Paper',
    createdAt: '2024-01-14',
    lastModified: '2024-01-15',
    wordCount: 2156,
    status: 'reviewed',
    aiScore: 85,
  },
];

export function AIReviewTab() {
  const [content, setContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [reviewResult, setReviewResult] = useState<TReviewResult | null>(null);
  const [analysisType, setAnalysisType] =
    useState<TAnalysisType>('comprehensive');
  const [drafts, setDrafts] = useState<TAssignmentDraft[]>(sampleDrafts);
  const [selectedDraft, setSelectedDraft] = useState<TAssignmentDraft | null>(
    null
  );
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);
  const [isDraftsDialogOpen, setIsDraftsDialogOpen] = useState(false);
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [newDraftSubject, setNewDraftSubject] = useState('');
  const [newDraftType, setNewDraftType] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      const wordCount = content.trim().split(/\s+/).length;
      const mockResult: TReviewResult = {
        type: analysisType,
        score: Math.floor(Math.random() * 30) + 70,
        suggestions:
          mockSuggestions[analysisType] || mockSuggestions.comprehensive,
        strengths: mockStrengths[analysisType] || mockStrengths.comprehensive,
        improvements: [
          'Consider expanding on key arguments',
          'Add more specific examples',
          'Improve citation format',
        ],
        plagiarismMatch:
          analysisType === 'plagiarism'
            ? Math.floor(Math.random() * 15)
            : undefined,
        readabilityScore: Math.floor(Math.random() * 40) + 60,
        wordCount,
        estimatedTime: `${Math.ceil(wordCount / 200)} min read`,
      };

      setReviewResult(mockResult);
      setIsAnalyzing(false);
      setIsResultDialogOpen(true);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleSaveDraft = () => {
    if (!content.trim() || !newDraftTitle.trim()) return;

    const newDraft: TAssignmentDraft = {
      id: Date.now().toString(),
      title: newDraftTitle,
      content: content,
      subject: newDraftSubject || 'General',
      type: newDraftType || 'Essay',
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      wordCount: content.trim().split(/\s+/).length,
      status: 'draft',
    };

    setDrafts((prev) => [newDraft, ...prev]);
    setNewDraftTitle('');
    setNewDraftSubject('');
    setNewDraftType('');
  };

  const handleLoadDraft = (draft: TAssignmentDraft) => {
    setContent(draft.content);
    setSelectedDraft(draft);
    setIsDraftsDialogOpen(false);
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85)
      return {
        variant: 'default' as const,
        text: 'Excellent',
        className: 'bg-green-100 text-green-800',
      };
    if (score >= 70)
      return {
        variant: 'secondary' as const,
        text: 'Good',
        className: 'bg-yellow-100 text-yellow-800',
      };
    return {
      variant: 'destructive' as const,
      text: 'Needs Work',
      className: 'bg-red-100 text-red-800',
    };
  };

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle>AI Assignment Reviewer</CardTitle>
          </div>
          <CardDescription>
            Upload your draft and get instant AI feedback before submission
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Analysis Type</Label>

            <Select
              value={analysisType}
              onValueChange={(value: TAnalysisType) => setAnalysisType(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="comprehensive">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Comprehensive Review
                  </div>
                </SelectItem>

                <SelectItem value="grammar">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Grammar & Style
                  </div>
                </SelectItem>

                <SelectItem value="structure">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Structure & Flow
                  </div>
                </SelectItem>

                <SelectItem value="plagiarism">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    Plagiarism Check
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="assignment-content"
                className="text-sm font-medium"
              >
                Assignment Content
              </Label>

              <div className="text-muted-foreground text-xs">
                {
                  content
                    .trim()
                    .split(/\s+/)
                    .filter((word) => word.length > 0).length
                }{' '}
                words
              </div>
            </div>

            <ScrollArea className="flex h-48 w-full flex-col rounded-md border">
              <Textarea
                id="assignment-content"
                placeholder="Paste your assignment text here for AI review..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none border-0 bg-transparent p-3 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing your assignment...</span>

                <span>{Math.round(analysisProgress)}%</span>
              </div>

              <Progress value={analysisProgress} className="h-2" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={!content.trim() || isAnalyzing}
              className="flex-1"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {isAnalyzing ? 'Analyzing...' : 'Get AI Review'}
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt"
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="h-4 w-4" />
              Upload File
            </Button>

            <Dialog
              open={isDraftsDialogOpen}
              onOpenChange={setIsDraftsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4" />
                  My Drafts ({drafts.length})
                </Button>
              </DialogTrigger>

              <DialogContent className="overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Assignment Drafts</DialogTitle>
                  <DialogDescription>
                    Manage your saved drafts and previous reviews
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <Card>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col gap-2">
                        <Input
                          placeholder="Draft title..."
                          value={newDraftTitle}
                          onChange={(e) => setNewDraftTitle(e.target.value)}
                        />

                        <div className="flex gap-2">
                          <Input
                            placeholder="Subject..."
                            value={newDraftSubject}
                            onChange={(e) => setNewDraftSubject(e.target.value)}
                            className="flex-1"
                          />

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="">
                                <Select
                                  value={newDraftType}
                                  onValueChange={setNewDraftType}
                                >
                                  <SelectTrigger className="">
                                    <Filter className="h-5 w-5" />
                                  </SelectTrigger>

                                  <SelectContent>
                                    <SelectItem value="essay">Essay</SelectItem>
                                    <SelectItem value="research">
                                      Research Paper
                                    </SelectItem>
                                    <SelectItem value="report">
                                      Report
                                    </SelectItem>
                                    <SelectItem value="analysis">
                                      Analysis
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </TooltipTrigger>

                            <TooltipContent>
                              Choose assignment type
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>

                      <Button
                        onClick={handleSaveDraft}
                        disabled={!content?.trim() || !newDraftTitle.trim()}
                        className="w-full"
                      >
                        <FileText className="h-4 w-4" />
                        Save Current Content as Draft
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {drafts.map((draft) => (
                      <Card key={draft.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <h4 className="font-semibold">{draft.title}</h4>
                              <Badge
                                className={
                                  getScoreBadge(draft.aiScore || 0).className
                                }
                              >
                                {draft.status}
                              </Badge>
                              {draft.aiScore && (
                                <Badge variant="outline">
                                  Score: {draft.aiScore}/100
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {draft.subject} • {draft.type} • {draft.wordCount}{' '}
                              words
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Created: {draft.createdAt} • Modified:{' '}
                              {draft.lastModified}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLoadDraft(draft)}
                            >
                              <Eye className="mr-1 h-4 w-4" />
                              Load
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteDraft(draft.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {drafts.length === 0 && (
                      <div className="py-8 text-center text-gray-500">
                        <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
                        <p>
                          No drafts saved yet. Save your current content to get
                          started!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="from-muted/30 to-muted/5 bg-gradient-to-r">
            <CardContent className="">
              <div className="mb-2 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Pro Tips</h4>
              </div>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>
                  • Use "Comprehensive Review" for complete feedback on content
                  and structure
                </li>
                <li>
                  • "Grammar & Style" focuses on language precision and
                  readability
                </li>
                <li>
                  • "Structure & Flow" analyzes organization and logical
                  progression
                </li>
                <li>
                  • "Plagiarism Check" scans for potential content similarities
                </li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              AI Review Results
            </DialogTitle>
            <DialogDescription>
              Detailed analysis and feedback for your assignment
            </DialogDescription>
          </DialogHeader>

          {reviewResult && (
            <div className="space-y-4">
              <Card className="from-muted/30 to-muted/5 bg-gradient-to-r">
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold">
                      Overall Score
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-3xl font-bold ${getScoreColor(reviewResult.score)}`}
                      >
                        {reviewResult.score}/100
                      </span>
                      <Badge
                        className={getScoreBadge(reviewResult.score).className}
                      >
                        {getScoreBadge(reviewResult.score).text}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1 text-right">
                    <p className="text-muted-foreground text-sm">
                      {reviewResult.wordCount} words •{' '}
                      {reviewResult.estimatedTime}
                    </p>

                    {reviewResult.readabilityScore && (
                      <p className="text-muted-foreground text-sm">
                        Readability: {reviewResult.readabilityScore}/100
                      </p>
                    )}

                    {reviewResult.plagiarismMatch !== undefined && (
                      <p className="text-muted-foreground text-sm">
                        Similarity: {reviewResult.plagiarismMatch}%
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Strengths
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2">
                      {reviewResult.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <TrendingUp className="h-5 w-5" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {reviewResult.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                          <span className="text-sm">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Detailed Suggestions
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    {reviewResult.suggestions.map((suggestion, index) => (
                      <Alert key={index}>
                        <Lightbulb className="h-4 w-4" />
                        <AlertDescription>{suggestion}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {reviewResult.plagiarismMatch !== undefined &&
                reviewResult.plagiarismMatch > 10 && (
                  <Alert className="" variant="default">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="">
                      Potential Similarity Detected
                    </AlertTitle>

                    <AlertDescription className="">
                      {reviewResult.plagiarismMatch}% similarity found. Review
                      your citations and ensure proper attribution.
                    </AlertDescription>
                  </Alert>
                )}

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const reportContent = `AI Review Report\n\nOverall Score: ${reviewResult.score}/100\nWord Count: ${reviewResult.wordCount}\n\nStrengths:\n${reviewResult.strengths.map((s) => `• ${s}`).join('\n')}\n\nImprovements:\n${reviewResult.improvements.map((i) => `• ${i}`).join('\n')}\n\nSuggestions:\n${reviewResult.suggestions.map((s) => `• ${s}`).join('\n')}`;

                    const blob = new Blob([reportContent], {
                      type: 'text/plain',
                    });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'ai-review-report.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download Report
                </Button>

                <Button onClick={() => setIsResultDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AIReviewTabSkeleton() {
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-[300px] w-full" />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-10 min-w-[140px] flex-1" />
            <Skeleton className="h-10 min-w-[120px] flex-1" />
            <Skeleton className="h-10 min-w-[120px] flex-1" />
          </div>

          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
