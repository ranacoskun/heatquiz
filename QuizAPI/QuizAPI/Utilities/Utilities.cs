using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using QuizAPI.Data;
using QuizAPI.Models;
using RestSharp;
using Svg;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace QuizAPI.Utilities
{
    public class Utilities
    {
        public async static Task<string> SaveFile(string path, IFormFile File)
        {
            //Get a random File Name
            var FileExtension = Path.GetExtension(File.FileName);
            var fileName = Path.GetRandomFileName();

            //Create Directory If Does Not Exist
            Directory.CreateDirectory(path);

            //Add File To Path
            path = Path.Combine(path, fileName + FileExtension);

            //Save File
            using (var stream = new FileStream(path, FileMode.Create))
            {
                await File.CopyToAsync(stream);
            }

            var URL = new string(path.SkipWhile(s => s != 't').Skip(2).ToArray());

            return URL;
        }

        public async static Task<string> CopyFile(string sourcePath, string destinationPath)
        {
            //Get a random File Name
            var FileExtension = Path.GetExtension(sourcePath);
            var fileName = Path.GetRandomFileName();

            //Create Directory If Does Not Exist
            Directory.CreateDirectory(destinationPath);

            //Add File To Path
            var path = Path.Combine(destinationPath, fileName + FileExtension);

            //Save File
            using (Stream source = File.Open(sourcePath, FileMode.Open))
            {
                using (Stream destination = File.Create(path))
                {
                    
                    await source.CopyToAsync(destination);
                }
            }
            
            var URL = new string(path.SkipWhile(s => s != 't').Skip(2).ToArray());

            return URL;
        }



        public static void DeleteFile(string path)
        {
            //Check If Directory Already Exists, Delete It 
            if (Directory.Exists(path))
            {
                Directory.Delete(path, true);
            }
        }

        public static async Task<BaseUser> GetUser(IHttpContextAccessor accessor, ApplicationDbContext _applicationDbContext)
        {
            Console.WriteLine(string.Join(',',accessor.HttpContext.Request.Headers.Select(h => h.Key)));
            string token = accessor.HttpContext.Request.Headers["Authorization"];

            // Check if token exists and has sufficient length
            if (string.IsNullOrEmpty(token) || token.Length < 7)
                return null;

            token = token.Substring(7);

            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token);
            var Token = handler.ReadToken(token) as JwtSecurityToken;

            var UserId = Token.Claims.FirstOrDefault(c => c.Type.ToUpper() == "nameid".ToUpper());

            if (UserId.Value is null)
                return null;

            var User = await _applicationDbContext.Users
                .FirstOrDefaultAsync(u => u.Id == UserId.Value);

            return User;
        }

        public static KeyValuePair<HttpStatusCode, string> SaveLatex(RestSharp.RestClient client, XmlDocument Document, string code, string filename, out int Width, out int Height)
        {
            RestRequest request = new RestRequest(Method.GET);
            request.AddParameter("from", code);
            var response = client.Execute(request);

            if (response.StatusCode != System.Net.HttpStatusCode.OK)
            {
                Width = 0;
                Height = 0;
                return new KeyValuePair<HttpStatusCode, string>(HttpStatusCode.BadRequest, $"Fix Latex Code => {code}");
            }

            var image = response.Content;
            Document.LoadXml(image);

            var svgDocument = SvgDocument.FromSvg<SvgDocument>(Document.ChildNodes.Item(2).OuterXml);
            svgDocument.FontSize = 30;
            svgDocument.Width = svgDocument.Width * 10;
            svgDocument.Height = svgDocument.Height * 10;

            svgDocument.FontFamily = "Arial";

            var bitmap = svgDocument.Draw();
            
            bitmap.Save(filename, ImageFormat.Png);

            Width = bitmap.Width;
            Height = bitmap.Height;

            return new KeyValuePair<HttpStatusCode, string>(HttpStatusCode.OK, string.Empty);
        }

        public static KeyValuePair<HttpStatusCode, string> SaveLatex_MultipleChoice(XmlDocument Document, string code, string filename, out int Width, out int Height)
        {
            RestClient client = new RestClient("https://latex2image.joeraut.com/convert");
            RestRequest request = new RestRequest(Method.POST);

            request.AddHeader("content-type", "application/x-www-form-urlencoded");
            request.AddParameter("application/x-www-form-urlencoded", $"outputScale=125%&outputFormat=PNG&latexInput={code}", ParameterType.RequestBody);


            var response = client.Execute<LatexResponse>(request);
            var result = JsonConvert.DeserializeObject<LatexResponse>(response.Content);

            if (response.StatusCode != System.Net.HttpStatusCode.OK || result is null)
            {
                Width = 0;
                Height = 0;
                return new KeyValuePair<HttpStatusCode, string>(HttpStatusCode.BadRequest, $"Fix Latex Code =>{code}");
            }

            var ImageURL = result.imageURL;

            WebClient tclient = new WebClient();
            Stream stream = tclient.OpenRead("https://latex2image.joeraut.com/" + ImageURL);
            Bitmap bitmap;
            bitmap = new Bitmap(stream);

            if (bitmap != null)
            {
                bitmap.Save(filename, ImageFormat.Png);
            }
            else
            {
                Width = 0;
                Height = 0;
                return new KeyValuePair<HttpStatusCode, string>(HttpStatusCode.BadRequest, $"Error Generating Image for Latex Code =>{code}");
            }

            stream.Flush();
            stream.Close();
            tclient.Dispose();

            Width = bitmap.Width;
            Height = bitmap.Height;

            return new KeyValuePair<HttpStatusCode, string>(HttpStatusCode.OK, string.Empty);
        }


        public static List<string> GetChars()
        {
            List<char> array = new List<char>("ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToCharArray());
            array.AddRange("ABCDEFGHIJKLMNOPQRSTUVWXYZ".ToLower().ToCharArray());

            var array_string = new List<string>();

            foreach (var c in array)
            {
                array_string.Add(new string(c, 1));
            }


            var array_string2 = new List<string>();

            foreach (var s in array_string)
            {
                foreach (var ss in array_string)
                {
                    array_string2.Add(s + ss);
                }
            }
            return array_string2;

        }

        public static string EncryptString(string key, string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }

            return Convert.ToBase64String(array);
        }

        public static string DecryptString(string key, string cipherText)
        {
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

    }
}

public class LatexResponse
{
    public string imageURL { get; set; }

}
