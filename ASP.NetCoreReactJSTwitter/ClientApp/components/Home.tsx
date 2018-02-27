import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import TwitterLogin from 'react-twitter-auth';
import * as Models from '../Models';
interface UserState {
    loading: boolean,
    user: Models.User
}
export class Home extends React.Component<RouteComponentProps<{}>, UserState> {
    constructor(props) {
        super(props);
        this.state = { loading: true, user: null};
        //if (props.location.search) {
        //    var queryString = "?user=";
        //    var index = props.location.search.indexOf(queryString);
        //    if (index >= 0) {
        //        var user = JSON.parse(decodeURIComponent(props.location.search.substring(queryString.length)));
        //        if (user)
        //            this.state = { user: user };
        //    }
        //    this.props.history.replace("/");
        //} else
        fetch('/home/currentuser')
            .then(response => response.json() as Promise<Models.User>)
            .then(user => this.setState({ loading: false, user: user }))
            .catch(e => console.log("error: " + e));
    }
    private logout() {
        fetch('/home/logout').then(response => this.setState({ loading: false, user: null})
        ).catch(function () {
            console.log("error");
        });
    }
    private submit(e) {
        e.preventDefault()
        let form: Element = document.querySelector('#frmCreateEdit')
        let id = document.getElementById('Id') as HTMLInputElement
        fetch('/home/tweet', {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.formToJson(form))
        }).then(data => {
//            this.setState({ save: false });
//            this.props.onSave(true);
        });
    }
    private renderFriends(user) {
        var f = (!!user && !!user.isAuthenticated) ? user.friends : null;
        var values = null;
        if (!!user && !!user.isAuthenticated)
            values = user.friends.map(function (friend) {
                var followed = "https://twitter.com/" + friend + "?ref_src=twsrc%5Etfw";
                return <a className="twitter-timeline" href={followed}>Tweets followed by {user.screenName}</a>
            });
        return values;
    }
    formToJson = elements => [].reduce.call(elements, (data, element) => {
        console.log('formToJson()', element)
        //if (this.isValidElement(element) && this.isValidValue(element)) {
            data[element.name] = element.value
        //}
        return data;
    }, {});
    public render() {
        if (!this.state.loading) {
            const user = this.state.user;
            var url = !!user && !!user.isAuthenticated ? "https://twitter.com/" + user.screenName + "?ref_src=twsrc%5Etfw" : "";
            let content = !!user && !!user.isAuthenticated ? (
                <div className="container">
                    <form id="frmTweet">
                        <div className="row">
                            <div className="col-md-6">
                                <input type="text" className="form-control" id="TweetString" placeholder="TweetString"></input>
                            </div>
                            <div className="col-md-6">
                                <input type="file" className="form-control" id="image" placeholder="Select file to upload..."></input>
                            </div>
                        </div>
                        <div className="row">
                            <button onClick={this.submit.bind(this)} className="button">Submit</button>
                        </div>
                    </form>
                    <div>
                        <div>
                            <button onClick={this.logout.bind(this)} className="button">Log out</button>
                        </div>
                        <div className="row">
                            <a className="twitter-timeline" href={url}>Tweets by {user.screenName}</a>
                            {user.friends.map(friend => <a className="twitter-timeline" href={"https://twitter.com/" + friend + "?ref_src=twsrc%5Etfw"}>Tweets followed by {user.screenName}</a>)}
                        </div>
                    </div>
                </div>
            ) : (
                    <div>
                        <a href="/Home/TwitterAuth"><input type="submit" value='Log In' /></a>
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
        } else
            return null;
    }
}