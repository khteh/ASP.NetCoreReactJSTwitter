using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ASP.NetCoreReactJSTwitter
{
    public class User
    {
        public bool isAuthenticated { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string ScreenName { get; set; }
        public List<string> Friends { get; set; }
    }
    public class Tweet
    {
        public string TweetString { get; set; }
        public byte[] File { get; set; }
    }
}