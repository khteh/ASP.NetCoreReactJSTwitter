import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import TwitterLogin from 'react-twitter-auth';
import * as Models from '../Models';
interface UserState {
    user: Models.User
}
export class Home extends React.Component<RouteComponentProps<Models.User>, UserState> {
    constructor(props) {
        super(props);
        this.state = { user: null };
        if (props.location.search) {
            var queryString = "?user=";
            var index = props.location.search.indexOf(queryString);
            if (index >= 0) {
                var user = JSON.parse(decodeURIComponent(props.location.search.substring(queryString.length)));
                if (user)
                    this.state = { user: user };
            }
            this.props.history.replace("/");
        } else {
            fetch('/home/currentuser')
                .then(response => response.json() as Promise<Models.User>)
                .then(user =>
                {
                    this.setState({user: user});
                    //this.state = { user: user }
                });
        }
    }
    logout = () => { this.setState({ user: null }); }
    private renderFriends(user) {
        var f = (!!user && !!user.isAuthenticated) ? user.Friends : null;
        var values = null;
        if (!!user && !!user.isAuthenticated)
            values = user.Friends.map(function (friend) {
                var followed = "https://twitter.com/" + friend + "?ref_src=twsrc%5Etfw";
                return <a className="twitter-timeline" href={followed}>Tweets followed by {user.ScreenName}</a>
            });
        return values;
    }
    public render() {
        const user = this.state.user;
        var url = !!user && !!user.isAuthenticated ? "https://twitter.com/" + user.ScreenName + "?ref_src=twsrc%5Etfw" : "";
        let content = !!user && !!user.isAuthenticated ? (
            <div>
                <p>Authenticated</p>
                <div>{user.ScreenName}</div>
                <div>
                    <button onClick={this.logout.bind(this)} className="button">Log out</button>
                </div>
                <div className="row">
                    <a className="twitter-timeline" href={url}>Tweets by {user.ScreenName}</a>
                    {this.renderFriends(user)}
                </div>
            </div>
        ) : (
                <div>
                    <a href="/Home/TwitterAuth"><input type="submit" value='Log In'/></a>
                </div>
            );
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to React Twitter Application</h1>
                </header>
                {content}
            </div>
        );
    }
}