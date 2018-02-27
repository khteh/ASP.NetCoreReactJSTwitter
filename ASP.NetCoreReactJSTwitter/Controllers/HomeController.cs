using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Tweetinvi;
using Tweetinvi.Models;
namespace ASP.NetCoreReactJSTwitter.Controllers
{
    [Produces("application/json")]
    public class HomeController : Controller
    {
        private readonly string _key, _secret;
        public HomeController(IConfiguration config)
        {
            _key = config["Authentication:Twitter:ConsumerKey"];
            _secret = config["Authentication:Twitter:ConsumerSecret"];
        }
        public IActionResult Index()
        {
            ITwitterCredentials credentials = Auth.Credentials;
            IAuthenticatedUser u;
            if (credentials != null && (u = Tweetinvi.User.GetAuthenticatedUser(credentials)) != null)
            {
                User user = new NetCoreReactJSTwitter.User();
                user.isAuthenticated = true;
                user.Name = u.Name;
                user.Email = u.Email;
                user.ScreenName = u.ScreenName;
                user.Friends = u.GetFriends().Select(i => i.ScreenName).ToList();
                return View(user);
            }
            return View();
            //return View(!string.IsNullOrEmpty(user) ? JsonConvert.DeserializeObject<User>(user) : null);
        }
        [HttpGet]
        public IActionResult CurrentUser()
        {
            IAuthenticatedUser u;
            User user = new NetCoreReactJSTwitter.User();
            if (Auth.Credentials != null && (u = Tweetinvi.User.GetAuthenticatedUser(Auth.Credentials)) != null)
            {
                user.isAuthenticated = true;
                user.Name = u.Name;
                user.Email = u.Email;
                user.ScreenName = u.ScreenName;
                user.Friends = u.GetFriends().Select(i => i.ScreenName).ToList();
            }
            return Ok(user);
        }
        [HttpGet]
        public IActionResult Logout()
        {
            Auth.SetCredentials(null);
            Auth.Credentials = null;
            return NoContent();
        }
        public IActionResult Error()
        {
            ViewData["RequestId"] = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Tweet tweet)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                ITweet publishedTweet = Auth.ExecuteOperationWithCredentials(Auth.Credentials, PublishTweet);
                bool success = publishedTweet != null;
                var routeValueParameters = new Dictionary<string, object>();
                routeValueParameters.Add("id", publishedTweet == null ? (Nullable<long>)null : publishedTweet.Id);
                routeValueParameters.Add("actionPerformed", "Publish");
                routeValueParameters.Add("success", success);
                return Ok();
            }
            catch (Exception e)
            {
                throw;
            }
            //return StatusCode(StatusCodes.Status500InternalServerError);
        }
        private ITweet PublishTweet()
        {
            var fileBytes = GetByteArrayFromFile(Image);
            var publishOptions = new PublishTweetOptionalParameters();
            if (fileBytes != null)
                publishOptions.MediaBinaries.Add(fileBytes);
            return Tweetinvi.Tweet.PublishTweet(TweetString, publishOptions);
        }
        private byte[] GetByteArrayFromFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return null;
            var memoryStream = new MemoryStream();
            file.OpenReadStream().CopyTo(memoryStream);
            return memoryStream.ToArray();
        }
        //public IActionResult Logout() => Auth.SetCredentials(null);
        public ActionResult TwitterAuth()
        {
            var appCreds = new ConsumerCredentials(_key, _secret);
            var redirectURL = "http://" + Request.Host.Value + "/Home/ValidateTwitterAuth";
            var authenticationContext = AuthFlow.InitAuthentication(appCreds, redirectURL);
            return new RedirectResult(authenticationContext.AuthorizationURL);
        }
        public ActionResult ValidateTwitterAuth()
        {
            User user = new NetCoreReactJSTwitter.User();
            if (Request.Query.ContainsKey("oauth_verifier") && Request.Query.ContainsKey("authorization_id"))
            {
                var verifierCode = Request.Query["oauth_verifier"];
                var authorizationId = Request.Query["authorization_id"];
                var userCreds = AuthFlow.CreateCredentialsFromVerifierCode(verifierCode, authorizationId);
                IAuthenticatedUser u = Tweetinvi.User.GetAuthenticatedUser(userCreds);
                Auth.SetCredentials(userCreds);
                user.isAuthenticated = true;
                user.Name = u.Name;
                user.Email = u.Email;
                user.ScreenName = u.ScreenName;
                user.Friends = u.GetFriends().Select(i => i.ScreenName).ToList();
            }
            //return RedirectToPage("/Index", user);  "Too many redirection" error
            //return LocalRedirect("/?user="+user.ToJson());
            return LocalRedirect("/");
        }
    }
}