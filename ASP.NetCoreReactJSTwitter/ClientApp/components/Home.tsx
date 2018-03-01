import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import TwitterLogin from 'react-twitter-auth';
import * as Models from '../Models';
import axios from 'axios';
import { Timeline } from 'react-twitter-widgets';
interface UserState {
    loading: boolean,
    user: Models.User,
    file: string
}
export class Home extends React.Component<RouteComponentProps<{}>, UserState> {
    constructor(props) {
        super(props);
        this.state = { loading: true, user: null, file: null};
        //if (props.location.search) {
        //    let queryString = "?user=";
        //    let index = props.location.search.indexOf(queryString);
        //    if (index >= 0) {
        //        let user = JSON.parse(decodeURIComponent(props.location.search.substring(queryString.length)));
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
        ).catch(e => console.log("error: " + e));
    }
    private handleFileChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        //reader.readAsDataURL(file);
        this.setState({ file: file });
    }
    private submit(e) {
        e.preventDefault();
        let data = new FormData();
        let str = (document.getElementById('TweetString') as HTMLInputElement).value;
        let file = (document.getElementById('TweetFile') as HTMLInputElement).files[0];
        data.append("TweetString", str);
        data.append("File", file);
        axios.post('/home/post', data)
            .then(result => {
                if (result.status === 200)
                    this.forceUpdate();
                console.log("Post result: " + result.statusText);
            })
            .catch(ex => console.error(ex));
    }
    public render() {
        if (!this.state.loading) {
            const user = this.state.user;
            const screenName = !!user && !!user.isAuthenticated ? user.screenName : "";
            let datasource = {};
            let datasources = [];
            if (!!user && !!user.isAuthenticated) {
                datasource = {
                    sourceType: 'profile',
                    screenName: user.screenName
                };
                if (user.friends.length > 0)
                    user.friends.map((friend) => datasources.push({sourceType: 'profile', screenName: friend}));
            }
            let url = !!user && !!user.isAuthenticated ? "https://twitter.com/" + user.screenName + "?ref_src=twsrc%5Etfw" : "";
            let content = !!user && !!user.isAuthenticated ? (
                <div>
                    <div className="row">
                        <div className="col-md-6">
                            <header className="App-header">
                                <h1 className="App-title">Welcome {user.screenName}!</h1>
                            </header>
                        </div>
                        <div className="col-md-2 header-top-margin">
                            <button className="btn btn-primary" onClick={this.logout.bind(this)}>Log out</button>
                        </div>
                    </div>
                    <form id="frmTweet">
                        <div className="row">
                            <div className="col-md-6">
                                <input type="text" className="form-control" id="TweetString" placeholder="TweetString"></input>
                            </div>
                            <div className="col-md-6">
                                <input type="file" className="form-control" id="TweetFile" placeholder="Select file to upload..."></input>
                            </div>
                        </div>
                        <div className="row body-top-margin">
                            <div className="col-md-2">
                                <button type="submit" className="btn btn-success" onClick={this.submit.bind(this)}>Post</button>
                            </div>
                        </div>
                    </form>
                    <div>
                        <div className="row">
                            <Timeline dataSource={datasource} onLoad={() => console.log('Timeline is loaded!')} />
                            {user.friends.length <= 0 ? <p>{user.screenName} does not follow any tweet!</p> : ''}
                            {datasources.map(source => <Timeline dataSource={source} onLoad={() => console.log('friend Timeline is loaded!')} />)}
                        </div>
                    </div>
                </div>
            ) : (
                    <div>
                        <header className="App-header">
                            <h1 className="App-title">Please log in to continue</h1>
                        </header>
                        <a href="/Home/TwitterAuth"><input type="submit" value='Log In' /></a>
                    </div>
                );
            return content;
        } else
            return null;
    }
}