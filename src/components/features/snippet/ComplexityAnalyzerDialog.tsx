"use client";

import { useState } from "react";
import { analyzeComplexity } from "@/lib/complexity-analyzer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Props {
  code: string;
  onResult: (result: ReturnType<typeof analyzeComplexity>) => void;
}

export function ComplexityAnalyzerDialog({ code, onResult }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReturnType<
    typeof analyzeComplexity
  > | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate processing
    const res = analyzeComplexity(code);
    setResult(res);
    onResult(res);
    setLoading(false);
  };

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        Analyze Complexity
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Time Complexity Analysis</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="py-8 text-center space-y-3">
              <Progress value={60} className="animate-pulse" />
              <p>Analyzing your code...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{result.complexity}</Badge>
                <span className="text-sm text-muted-foreground">
                  Confidence: {result.confidence}%
                </span>
              </div>
              <p className="text-sm">{result.explanation}</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Loops: {result.details.loops}</p>
                <p>Recursive calls: {result.details.recursiveCalls}</p>
                <p>Patterns: {result.details.patterns.join(", ") || "none"}</p>
              </div>
            </div>
          ) : (
            <Button type="button" onClick={handleAnalyze} className="w-full">
              Start Analysis
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
