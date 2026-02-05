using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using QuizAPI.Services;

namespace QuizAPI.Controllers
{
    /// <summary>
    /// Secure LLM endpoints: keep OpenAI key on the server (Azure App Service).
    /// Frontend calls:
    ///   POST /api/LLM/GenerateGoalJudgments
    ///   POST /api/LLM/GenerateLearningPatternAnalysis
    /// Optional:
    ///   POST /api/LLM/GeneratePerformanceRecap
    /// </summary>
    [EnableCors("MyPolicy")]
    [Route("api/[controller]")]
    public class LLMController : Controller
    {
        private readonly OpenAiChatService _openAi;

        public LLMController(OpenAiChatService openAi)
        {
            _openAi = openAi;
        }

        public class GoalJudgmentsRequest
        {
            public List<string> Goals { get; set; }
            public JObject PerformanceData { get; set; }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GenerateGoalJudgments([FromBody] GoalJudgmentsRequest request)
        {
            if (request == null || request.Goals == null || request.Goals.Count == 0 || request.PerformanceData == null)
            {
                return BadRequest(new { message = "Invalid request. Expected { goals: string[], performanceData: object }." });
            }

            var goals = request.Goals.Where(g => !string.IsNullOrWhiteSpace(g)).Select(g => g.Trim()).ToList();
            if (goals.Count == 0)
            {
                return BadRequest(new { message = "No goals provided." });
            }

            var prompt = BuildGoalJudgmentPrompt(goals, request.PerformanceData);

            var payload = new
            {
                model = _openAi.GetModel("gpt-4o-mini"),
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content =
                            "You are an educational assistant that evaluates learning goals based on quiz performance data. " +
                            "For each goal, provide an explanation grounded in the performance data using \"you\" language. " +
                            "Format it as: [brief factual performance data]|||[self-reflective question]. " +
                            "Start with a brief, concise factual statement (e.g., \"You scored X% on questions related to Y\" - keep it short, just the essential data), " +
                            "then use \"|||\" as a separator, then provide a short, clear, and engaging self-reflective question (1 sentence maximum) " +
                            "that captures attention and prompts the student to think about what this performance means for their understanding. " +
                            "The question should be concise, thought-provoking, and based on all the performance data provided."
                    },
                    new { role = "user", content = prompt }
                },
                temperature = 0.3,
                max_tokens = 500
            };

            try
            {
                var content = await _openAi.CreateChatCompletionAsync(payload);
                var judgments = ParseGoalJudgments(content, goals);
                return Ok(new { judgments });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"LLM error: {ex.Message}" });
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GenerateLearningPatternAnalysis([FromBody] JObject performanceData)
        {
            if (performanceData == null)
            {
                return BadRequest(new { message = "Invalid request body. Expected performance data object." });
            }

            var prompt = BuildLearningPatternPrompt(performanceData);

            var payload = new
            {
                model = _openAi.GetModel("gpt-4o-mini"),
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content =
                            "You are an educational assistant that analyzes learning patterns based on quiz performance. " +
                            "Provide a short paragraph (2-3 sentences) using \"you\" language explaining where and how you struggled, " +
                            "based on question type, difficulty, and mistakes."
                    },
                    new { role = "user", content = prompt }
                },
                temperature = 0.3,
                max_tokens = 200
            };

            try
            {
                var content = await _openAi.CreateChatCompletionAsync(payload);
                return Ok(new { analysis = content });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"LLM error: {ex.Message}" });
            }
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> GeneratePerformanceRecap([FromBody] JObject performanceData)
        {
            if (performanceData == null)
            {
                return BadRequest(new { message = "Invalid request body. Expected performance data object." });
            }

            var prompt = BuildPerformancePrompt(performanceData);

            var payload = new
            {
                model = _openAi.GetModel("gpt-4o-mini"),
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content =
                            "You are an educational assistant that provides brief, encouraging motivational messages to students. " +
                            "Your messages should be general, positive, and supportive. " +
                            "Do NOT provide specific learning advice, topic analysis, or study recommendations - only general encouragement."
                    },
                    new { role = "user", content = prompt }
                },
                temperature = 0.7,
                max_tokens = 200
            };

            try
            {
                var content = await _openAi.CreateChatCompletionAsync(payload);
                return Ok(new { recap = content });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"LLM error: {ex.Message}" });
            }
        }

        private static string BuildPerformancePrompt(JObject performanceData)
        {
            var overallSuccessRate = performanceData.Value<int?>("overallSuccessRate") ?? 0;
            var totalQuestions = performanceData.Value<int?>("totalQuestions") ?? 0;
            var correctCount = performanceData.Value<int?>("correctCount") ?? 0;

            var sb = new System.Text.StringBuilder();
            sb.Append("Based on a student's quiz performance, provide a personalized recap. Here are the details:\n\n");
            sb.Append($"Overall Performance: {correctCount} out of {totalQuestions} questions correct ({overallSuccessRate}% success rate)\n\n");

            AppendStatsBlock(sb, "Performance by Topic", performanceData["topics"] as JObject);
            AppendStatsBlock(sb, "Performance by Subtopic", performanceData["subtopics"] as JObject);
            AppendStatsBlock(sb, "Performance by Difficulty Level", performanceData["difficultyLevels"] as JObject);

            sb.Append("Please provide a brief, encouraging motivational message (1-2 short paragraphs, maximum 150 words) using \"you\" language that:\n");
            sb.Append("1. Acknowledges your effort and overall performance\n");
            sb.Append("2. Provides general encouragement to continue learning\n");
            sb.Append("IMPORTANT: Do NOT provide specific learning advice, topic analysis, or study recommendations. ");
            sb.Append("Only provide general motivation and encouragement. Keep it brief, positive, and supportive.");

            return sb.ToString();
        }

        private static string BuildGoalJudgmentPrompt(List<string> goals, JObject performanceData)
        {
            var overallSuccessRate = performanceData.Value<int?>("overallSuccessRate") ?? 0;
            var totalQuestions = performanceData.Value<int?>("totalQuestions") ?? 0;
            var correctCount = performanceData.Value<int?>("correctCount") ?? 0;

            var sb = new System.Text.StringBuilder();
            sb.Append("Evaluate each learning goal based on your quiz performance. For each goal, respond with exactly one line in this format:\n");
            sb.Append("GOAL: [goal text]\n");
            sb.Append("STATUS: [met/partially met/not yet met]\n");
            sb.Append("EXPLANATION: [Start with a brief, concise factual performance statement using \"you\" language (e.g., \"You scored X% on questions related to Y\" - keep it short, just the essential data), then add \"|||\" as a separator, then provide a short, clear, engaging self-reflective question (1 sentence maximum) that captures attention and prompts thinking about what this means for understanding, based on all the performance data provided]\n\n");

            sb.Append("Your Performance Data:\n");
            sb.Append($"- Overall: {correctCount}/{totalQuestions} correct ({overallSuccessRate}%)\n\n");

            AppendStatsBlock(sb, "Performance by Question Type", performanceData["questionTypes"] as JObject);
            AppendStatsBlock(sb, "Performance by Difficulty", performanceData["difficultyLevels"] as JObject);
            AppendStatsBlock(sb, "Performance by Topic", performanceData["topics"] as JObject);

            var mistakes = performanceData["mistakes"] as JArray;
            if (mistakes != null && mistakes.Count > 0)
            {
                sb.Append("Areas of Struggle:\n");
                foreach (var m in mistakes.Take(5).OfType<JObject>())
                {
                    var topic = (string)m["topic"] ?? "Unknown";
                    var difficulty = (string)m["difficulty"] ?? "Unknown difficulty";
                    sb.Append($"- {topic}: {difficulty}\n");
                }
                sb.Append("\n");
            }

            sb.Append("Goals to Evaluate:\n");
            for (var i = 0; i < goals.Count; i++)
            {
                sb.Append($"{i + 1}. {goals[i]}\n");
            }

            return sb.ToString();
        }

        private static string BuildLearningPatternPrompt(JObject performanceData)
        {
            var overallSuccessRate = performanceData.Value<int?>("overallSuccessRate") ?? 0;
            var totalQuestions = performanceData.Value<int?>("totalQuestions") ?? 0;
            var correctCount = performanceData.Value<int?>("correctCount") ?? 0;

            var sb = new System.Text.StringBuilder();
            sb.Append("Analyze your learning patterns based on your quiz performance. Provide a short paragraph (2-3 sentences) using \"you\" language explaining where and how you struggled.\n\n");
            sb.Append("Your Performance Summary:\n");
            sb.Append($"- Overall: {correctCount}/{totalQuestions} correct ({overallSuccessRate}%)\n\n");

            AppendStatsBlock(sb, "Performance by Question Type", performanceData["questionTypes"] as JObject);
            AppendStatsBlock(sb, "Performance by Difficulty Level", performanceData["difficultyLevels"] as JObject);

            var mistakes = performanceData["mistakes"] as JArray;
            if (mistakes != null && mistakes.Count > 0)
            {
                sb.Append("Common Mistakes:\n");
                // Aggregate by topic like the frontend does
                var counts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
                foreach (var m in mistakes.OfType<JObject>())
                {
                    var topic = ((string)m["topic"] ?? "Unknown").Trim();
                    if (!counts.ContainsKey(topic)) counts[topic] = 0;
                    counts[topic]++;
                }

                foreach (var kv in counts.OrderByDescending(kv => kv.Value).Take(5))
                {
                    sb.Append($"- {kv.Key}: {kv.Value} mistake(s)\n");
                }
                sb.Append("\n");
            }

            sb.Append("Provide a concise analysis focusing on:\n");
            sb.Append("1. Which question types or difficulty levels were challenging for you\n");
            sb.Append("2. What patterns emerge from your mistakes\n");
            sb.Append("3. What this suggests about your understanding\n");
            sb.Append("Use \"you\" language. Keep it to 2-3 sentences, very short and simple.");

            return sb.ToString();
        }

        private static void AppendStatsBlock(System.Text.StringBuilder sb, string title, JObject stats)
        {
            if (stats == null || !stats.Properties().Any())
            {
                return;
            }

            sb.Append(title);
            sb.Append(":\n");

            foreach (var prop in stats.Properties())
            {
                var name = prop.Name;
                var obj = prop.Value as JObject;
                if (obj == null) continue;

                var correct = obj.Value<int?>("correct") ?? 0;
                var total = obj.Value<int?>("total") ?? 0;
                var success = total > 0 ? (int)Math.Round((double)correct / total * 100.0) : 0;
                sb.Append($"- {name}: {correct}/{total} correct ({success}%)\n");
            }

            sb.Append("\n");
        }

        private static List<object> ParseGoalJudgments(string content, List<string> goals)
        {
            var judgments = new List<object>();
            var lines = content.Split(new[] { '\n' }, StringSplitOptions.RemoveEmptyEntries).Select(l => l.Trim()).ToList();

            string currentGoal = null;
            string currentStatus = null;
            string currentExplanation = null;

            foreach (var line in lines)
            {
                if (line.StartsWith("GOAL:", StringComparison.OrdinalIgnoreCase))
                {
                    currentGoal = line.Substring("GOAL:".Length).Trim();
                }
                else if (line.StartsWith("STATUS:", StringComparison.OrdinalIgnoreCase))
                {
                    var statusText = line.Substring("STATUS:".Length).Trim().ToLowerInvariant();
                    if (statusText.Contains("met") && !statusText.Contains("not") && !statusText.Contains("partially"))
                    {
                        currentStatus = "met";
                    }
                    else if (statusText.Contains("partially"))
                    {
                        currentStatus = "partially met";
                    }
                    else
                    {
                        currentStatus = "not yet met";
                    }
                }
                else if (line.StartsWith("EXPLANATION:", StringComparison.OrdinalIgnoreCase))
                {
                    currentExplanation = line.Substring("EXPLANATION:".Length).Trim();
                    if (!string.IsNullOrEmpty(currentGoal) && !string.IsNullOrEmpty(currentStatus) && !string.IsNullOrEmpty(currentExplanation))
                    {
                        judgments.Add(new
                        {
                            goal = currentGoal,
                            status = currentStatus,
                            explanation = currentExplanation
                        });
                        currentGoal = null;
                        currentStatus = null;
                        currentExplanation = null;
                    }
                }
            }

            if (judgments.Count == 0)
            {
                foreach (var g in goals)
                {
                    judgments.Add(new { goal = g, status = "not yet met", explanation = "Evaluation pending" });
                }
            }

            return judgments;
        }
    }
}

