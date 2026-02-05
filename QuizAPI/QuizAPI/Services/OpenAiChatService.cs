using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace QuizAPI.Services
{
    /// <summary>
    /// Minimal OpenAI Chat Completions client compatible with ASP.NET Core 2.x (netcoreapp2.0).
    /// Reads configuration from:
    /// - OpenAI:ApiKey (env var OpenAI__ApiKey) OR OPENAI_API_KEY
    /// - OpenAI:ApiUrl (env var OpenAI__ApiUrl) OR OPENAI_API_URL (optional)
    /// - OpenAI:Model  (env var OpenAI__Model)  OR OPENAI_MODEL (optional)
    /// </summary>
    public class OpenAiChatService
    {
        private static readonly HttpClient _http = new HttpClient();
        private readonly IConfiguration _config;

        public OpenAiChatService(IConfiguration config)
        {
            _config = config;
        }

        public string GetApiKey()
        {
            var key =
                (_config["OpenAI:ApiKey"] ?? "").Trim();

            if (string.IsNullOrEmpty(key))
            {
                key = (_config["OPENAI_API_KEY"] ?? "").Trim();
            }

            return key;
        }

        public string GetApiUrl()
        {
            var url = (_config["OpenAI:ApiUrl"] ?? "").Trim();
            if (string.IsNullOrEmpty(url))
            {
                url = (_config["OPENAI_API_URL"] ?? "").Trim();
            }

            return string.IsNullOrEmpty(url)
                ? "https://api.openai.com/v1/chat/completions"
                : url;
        }

        public string GetModel(string defaultModel)
        {
            var model = (_config["OpenAI:Model"] ?? "").Trim();
            if (string.IsNullOrEmpty(model))
            {
                model = (_config["OPENAI_MODEL"] ?? "").Trim();
            }

            return string.IsNullOrEmpty(model) ? defaultModel : model;
        }

        public async Task<string> CreateChatCompletionAsync(object payload)
        {
            var apiKey = GetApiKey();
            if (string.IsNullOrEmpty(apiKey))
            {
                throw new InvalidOperationException("OpenAI API key is not configured. Set OpenAI__ApiKey or OPENAI_API_KEY in Azure App Service configuration.");
            }

            var apiUrl = GetApiUrl();

            var json = JsonConvert.SerializeObject(payload);
            var req = new HttpRequestMessage(HttpMethod.Post, apiUrl);
            req.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
            req.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var resp = await _http.SendAsync(req);
            var body = await resp.Content.ReadAsStringAsync();

            if (!resp.IsSuccessStatusCode)
            {
                // Try to surface OpenAI error message if present.
                try
                {
                    var err = JObject.Parse(body);
                    var msg = (string)err["error"]?["message"];
                    throw new InvalidOperationException(string.IsNullOrEmpty(msg) ? body : msg);
                }
                catch (JsonException)
                {
                    throw new InvalidOperationException(body);
                }
            }

            var parsed = JObject.Parse(body);
            var content = (string)parsed["choices"]?[0]?["message"]?["content"];
            if (string.IsNullOrEmpty(content))
            {
                throw new InvalidOperationException("Invalid response from OpenAI (missing choices[0].message.content).");
            }

            return content.Trim();
        }
    }
}

