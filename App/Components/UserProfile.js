var FAKE_DATA = {
  "login": "skyline75489",
  "id": 4710575,
  "avatar_url": "https://avatars.githubusercontent.com/u/4710575?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/skyline75489",
  "html_url": "https://github.com/skyline75489",
  "followers_url": "https://api.github.com/users/skyline75489/followers",
  "following_url": "https://api.github.com/users/skyline75489/following{/other_user}",
  "gists_url": "https://api.github.com/users/skyline75489/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/skyline75489/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/skyline75489/subscriptions",
  "organizations_url": "https://api.github.com/users/skyline75489/orgs",
  "repos_url": "https://api.github.com/users/skyline75489/repos",
  "events_url": "https://api.github.com/users/skyline75489/events{/privacy}",
  "received_events_url": "https://api.github.com/users/skyline75489/received_events",
  "type": "User",
  "site_admin": false,
  "name": "Liu Jialiang",
  "company": "",
  "blog": "http://byskyline.me",
  "location": "Harbin, Heilongjiang, China",
  "email": "skyline75489@outlook.com",
  "hireable": true,
  "bio": null,
  "public_repos": 39,
  "public_gists": 1,
  "followers": 159,
  "following": 111,
  "created_at": "2013-06-16T11:25:35Z",
  "updated_at": "2015-05-29T01:35:26Z"
}


'use strict';

var React = require('react-native');
var {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  LinkingIOS,
  ActivityIndicatorIOS,
} = React;

var Base = require("../Common/Base");
var Color = require("../Common/Color");
var Api = require('../Network/Api');

var RepoList = require('../Components/RepoList');
var RepoDetail = require('./RepoDetail');

var Icon = require("react-native-icons");
var Router = require('react-native-router');

module.exports = React.createClass({
  goToRepo: function(repoName) {
    // repoName is actully 'owner/repo'
    this.props.toRoute({
      name: repoName,
      component: RepoDetail,
      data: {repoName: repoName, goBack: this.props.toBack},
    });
  },
  getInitialState: function() {
    return {
      profileData: null,
      profileDataReady: false,
      repoListData: null,
      repoListDataReady: false,
    };
  },
  componentDidMount: function() { 
    var that = this;
    Api.getUserProfile(this.props.data.username, function(data) {
      that.setState({
        profileData: data,
        profileDataReady: true,
      });
    });
    Api.getUserRecentlyPushedRepo(this.props.data.username, 1, 5, function(data) {
      that.setState({
        repoListData: data,
        repoListDataReady: true,
      });
    });
  },
  renderLoadingView: function() { 
    return ( 
      <View style={styles.loadingView}>
      <View>
        <ActivityIndicatorIOS
          animating={true}
          style={{height: 30}}
          size="small"
        />
      </View>
      </View>
    ); 
  },

  render: function() {
    if (!(this.state.profileDataReady && this.state.repoListDataReady)) {
      return this.renderLoadingView();
    }
    var data = this.state.profileData;

    // Only display an item if it exists.
    var infoList = []
    if (data.location) {
      infoList.push(<View key={Base.makeKey()} style={styles.itemWrapper}>
                      <View style={styles.iconWrapper}>
                        <Icon name='octicons|location' size={16} color='#666666' style={styles.icon}/>
                      </View>
                      <View style={styles.textWrapper}>
                        <Text style={styles.location}>{data.location}</Text>
                      </View>
                    </View>);
    } 
    if (data.email) {
      infoList.push(<View key={Base.makeKey()} style={styles.itemWrapper}>
                      <View style={styles.iconWrapper}>
                        <Icon name='octicons|mail' size={16} color='#666666' style={styles.icon}/>
                      </View>
                      <View style={styles.textWrapper}>
                        <TouchableOpacity onPress={()=>{LinkingIOS.openURL('mailto:' + data.email);}}><Text style={styles.email}>{data.email}</Text></TouchableOpacity>
                      </View>
                    </View>);
    }
    if (data.blog) {
      infoList.push(<View key={Base.makeKey()} style={styles.itemWrapper}>
                      <View style={styles.iconWrapper}>
                        <Icon name='octicons|link' size={16} color='#666666' style={styles.icon}/>
                      </View>
                      <View style={styles.textWrapper}>
                        <TouchableOpacity onPress={()=>{LinkingIOS.openURL(data.blog);}}><Text style={styles.blog}>{data.blog}</Text></TouchableOpacity>
                      </View>
                    </View>);
    }

    return (
      <View style={styles.wrap}>
        <View style={styles.info}>
          <View style={styles.avatarWrapper}>
            <Image
              style={styles.avatar}
              source={{uri: data.avatar_url}}/>   
          </View>
          <View style={styles.nameWrapper}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.login}>{data.login}</Text>
            {infoList}
          </View>
        </View>

        <View style={styles.stat}>
            <View style={styles.followers}>
                <Text style={styles.statNums}>{data.followers}</Text>
                <Text style={styles.statTitle}>Followers</Text>
            </View>
            <View style={styles.starred}>
                <Text style={styles.statNums}>{data.starred_count}</Text>
                <Text style={styles.statTitle}>Starred</Text>
            </View>
            <View style={styles.following}>
                <Text style={styles.statNums}>{data.following}</Text>
                <Text style={styles.statTitle}>Following</Text>
            </View>
        </View>
        
        <View style={styles.repoListWrapper}>
          <RepoList scrollEnabled={false} dataSource={this.state.repoListData} goToRepo={this.goToRepo}/>
        </View>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  wrap: {
    backgroundColor: '#fff',
  },
  info: {
    flex: 2,
    flexDirection: 'row',
  },
  avatarWrapper: {
    flex: 0.7,
    padding: 15,
  },
  nameWrapper: {
    flex: 1.3,
    padding: 15,
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  login: {
    fontSize: 13,
    color: Color.github_font_gray,
    marginBottom: 10,
  },
  icon: {
    width: 15, 
    height: 15,
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  iconWrapper: {
    flex: 0.12,
  },
  textWrapper: {
    flex: 0.88,
  },
  location: {
    fontSize: 12,
    marginBottom: 3,
  },
  email: {
    fontSize: 12,
    marginBottom: 3,
    color: Color.github_link,
  },
  blog: {
    fontSize: 12,
    marginBottom: 3,
    color: Color.github_link,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  stat: {
    flex: 3,
    flexDirection: 'row',
    paddingBottom: 10,
  },
  followers: {
    flex: 1,
    alignItems: 'center',
  },
  starred: {
    flex: 1,
    alignItems: 'center',
  },
  following: {
    flex: 1,
    alignItems: 'center',
  },
  statNums: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statTitle: {
    fontSize: 12,
    color: Color.github_font_gray,
  },
  repoListWrapper: {
    top: -10,
    height: 220,
  },
  loadingView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

