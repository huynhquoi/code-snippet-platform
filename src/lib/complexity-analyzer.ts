export interface ComplexityResult {
  complexity: string;
  confidence: number;
  explanation: string;
  details: {
    loops: number;
    nestingDepth: number;
    recursiveCalls: number;
    patterns: string[];
  };
}

export function analyzeComplexity(code: string): ComplexityResult {
  const cleanCode = code
    .replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")
    .replace(/(['"`])(\\?.)*?\1/g, "");

  const loopMatches =
    cleanCode.match(/\b(for|while|forEach|map|reduce)\b/g) || [];
  const loops = loopMatches.length;

  const depth = Math.max(
    0,
    (cleanCode.match(/{/g)?.length || 0) - (cleanCode.match(/}/g)?.length || 0)
  );

  const recursionMatches =
    cleanCode.match(/\bfunction\s+(\w+)[\s\S]*?\1\(/g) || [];
  const recursiveCalls = recursionMatches.length;

  const patterns: string[] = [];
  if (/binary/i.test(cleanCode)) patterns.push("binary search");
  if (/sort/i.test(cleanCode)) patterns.push("sorting");
  if (/memo/i.test(cleanCode)) patterns.push("memoization");

  let complexity = "O(1)";
  let confidence = 70;
  let explanation = "Constant time";

  if (recursiveCalls > 0) {
    complexity = "O(2^n)";
    confidence = 80;
    explanation = "Recursive calls detected (possible exponential time)";
  } else if (loops > 0 && loops <= 2) {
    complexity = loops === 1 ? "O(n)" : "O(n²)";
    confidence = 85;
    explanation =
      loops === 1
        ? "Single loop detected → linear time"
        : "Nested loops detected → quadratic time";
  } else if (patterns.includes("binary search")) {
    complexity = "O(log n)";
    confidence = 90;
    explanation = "Binary search pattern detected";
  } else if (patterns.includes("sorting")) {
    complexity = "O(n log n)";
    confidence = 90;
    explanation = "Sorting algorithm pattern detected";
  }

  return {
    complexity,
    confidence,
    explanation,
    details: {
      loops,
      nestingDepth: depth,
      recursiveCalls,
      patterns,
    },
  };
}
