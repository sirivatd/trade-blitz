import React from "react";
import { withRouter } from "react-router";
import SearchBar from "./../search_bar/search_bar";
import TopMoversIndexContainer from "./../home/top_movers/top_movers_container";
import { fetchAthleteTweets } from "./../../util/athlete_api_util";
class AthleteShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      previousPortValue: 0.0,
      totalPortValue: 0.0,
      athleteId: this.props.match.params.athleteId
    };

    this.findAthlete = this.findAthlete.bind(this);
  }

  componentDidMount() {
    this.props.fetchAllAthletes();
    this.props.fetchStocks();
    fetchAthleteTweets(this.state.athleteId).then(res => console.log(res));
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.match.params.athleteId !== nextProps.match.params.athleteId
    ) {
      fetchAthleteTweets(nextProps.match.params.athleteId).then(res =>
        console.log(res)
      );
    }
  }

  calculateTotalPortValue() {
    let total = 0;
    let currentTotal = this.state.totalPortValue;

    this.props.orders.forEach(order => {
      let stockEquity = this.findStock(order).current_price;
      if (!stockEquity) {
        stockEquity = 0;
      }
      let totalEquity = order.num_share * stockEquity;
      total += totalEquity;
    });

    this.setState({
      previousPortValue: currentTotal,
      totalPortValue: total + this.props.currentUser.buying_power
    });
  }

  findAthlete(id) {
    let athlete = {};
    for (let i = 0; i < this.props.athletes.length; i++) {
      if (this.props.athletes[i].id === id) {
        athlete = this.props.athletes[i];
      }
    }
    return athlete;
  }

  render() {
    const loader = () => (
      <span className="cssload-loader">
        <span className="cssload-loader-inner" />
      </span>
    );
    const athleteName = () => <h1>{this.props.athlete.name}</h1>;
    const accountSettings = () => (
      <div className="account-settings-menu hidden-menu">
        <div className="account-settings-stats">
          <h3 className="account-settings-name">
            {this.props.currentUser.first_name}{" "}
            {this.props.currentUser.last_name}
          </h3>
          <div className="account-setting-port">
            <h4 className="account-setting-port-value">
              ${this.state.totalPortValue.toFixed(2)}
            </h4>

            <h4 className="account-setting-label">Portfolio Value</h4>
          </div>

          <div className="account-setting-power">
            <h4 className="account-setting-power-value">
              ${this.props.currentUser.buying_power.toFixed(2)}
            </h4>
            <h4 className="account-setting-label">Buying Power</h4>
          </div>
        </div>
        <hr className="account-setting-divider" />
        <ul
          className="account-settings-list"
          onClick={() => this.props.logout(currentUser)}
        >
          <li className="account-settings-item">Logout</li>
        </ul>
      </div>
    );

    const athleteHeader = () => (
      <div className="athlete-show-header">
        <div className="athlete-show-name">
          {this.props.athletes.length > 0 ? athleteName() : loader()}
        </div>
        <div className="athlete-show-price">$25.14</div>
        <div className="athlete-show-percent-change">+ $1.91 (7.27%)</div>
      </div>
    );

    const athleteStats = () => (
      <div className="athlete-stats-section">
        <h1 className="athlete-stats-header"> Statistics</h1>
        <hr className="athlete-show-break-line" />
      </div>
    );

    const athleteGraph = () => (
      <div className="athlete-show-graph">This is where the graph goes</div>
    );

    const buySellSection = () => (
      <div className="athlete-show-buy-sell animated slideInRight">
        Buy and sell here
      </div>
    );

    const athleteImage = () => (
      <div className="athlete-show-image-container">
        <img
          className="athlete-show-headshot animated fadeInUp delay-1s"
          src={this.props.athlete.image_url}
          alt="athlete headshot"
        />
      </div>
    );

    const athleteTweets = () => (
      <div className="athlete-tweets-container">
        <h1 className="athlete-stats-header">Recent Tweets</h1>
        <hr className="athlete-show-break-line" />
      </div>
    );

    const similarAthletes = () => (
      <div className="athlete-similar-container">
        <h1 className="athlete-stats-header">Similar Athletes</h1>
        <hr className="athlete-show-break-line" />
        <TopMoversIndexContainer />
      </div>
    );

    return (
      <div className="athlete-show-section">
        {accountSettings()}
        <div className="fixed-nav-bar">
          <img
            onClick={() => this.props.history.push("/")}
            className="logo-img"
            src="https://media.glassdoor.com/sqll/1167765/robinhood-squarelogo-1530549970728.png"
          />
          <SearchBar athletes={this.props.athletes} />
          <nav className="login-signup">
            {/* <button className="login-logout-button">Leaderboard</button> */}
            <button
              id="account-button"
              className="login-logout-button"
              onClick={this.showMenu}
            >
              Account
            </button>
          </nav>
        </div>

        {Object.values(this.props.athletes).length > 0
          ? athleteHeader()
          : loader()}
        {athleteGraph()}
        {Object.values(this.props.athletes).length > 0
          ? athleteStats()
          : loader()}

        {Object.values(this.props.athletes).length > 0
          ? buySellSection()
          : loader()}

        {Object.values(this.props.athletes).length > 0
          ? athleteImage()
          : loader()}
        {athleteTweets()}
        {Object.values(this.props.stocks).length > 0
          ? similarAthletes()
          : loader()}
      </div>
    );
  }
}

export default withRouter(AthleteShow);
