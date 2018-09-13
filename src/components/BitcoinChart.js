// @flow strict

import React, { Component } from "react";
import { Input } from "reactstrap";

import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

class BitcoinChart extends Component {
  constructor(props) {
    super(props);

    this.Change = this.Change.bind(this);
    this.state = {
      value: {
        open: [],
        close: [],
        high: [],
        low: []
      },
      series: [],
      option: "Open"
    };
  }

  CheckOption(key, value) {
    let series = [];

    switch (key) {
      case "Open":
        series.push({
          name: "Open",
          data: value.open
        });
        break;
      case "Close":
        series.push({
          name: "Close",
          data: value.close
        });
        break;
      case "High":
        series.push({
          name: "High",
          data: value.high
        });
        break;
      case "Low":
        series.push({
          name: "Low",
          data: value.low
        });
        break;
      default:
        series = [
          {
            name: "Open",
            data: value.open
          },
          {
            name: "Close",
            data: value.close
          },
          {
            name: "High",
            data: value.high
          },
          {
            name: "Low",
            data: value.low
          }
        ];
    }

    return series;
  }

  Change(e) {
    let series = [];
    let value = this.state.value;
    series = this.CheckOption(e.target.value, value);
    this.setState({ series, option: e.target.value });
  }

  initialValue() {
    const value = {
      open: [],
      close: [],
      high: [],
      low: []
    };
    this.setState({ value });
  }

  fetchQuotes() {
    this.initialValue();

    fetch(
      "https://min-api.cryptocompare.com/data/histoday?fsym=BTC&tsym=USD&limit=100"
    )
      .then(response => response.json())
      .then(data => {
        let series = [];
        let value = {
          open: [],
          close: [],
          high: [],
          low: []
        };
        data.Data.map(cur => {
          value.open.push([new Date(cur.time * 1000).toString(), cur.open]);
          value.close.push([new Date(cur.time * 1000).toString(), cur.close]);
          value.high.push([new Date(cur.time * 1000).toString(), cur.high]);
          value.low.push([new Date(cur.time * 1000).toString(), cur.low]);

          return value;
        });
        series = this.CheckOption(this.state.option, value);
        this.setState({ series, value });
      });
  }

  componentDidMount() {
    this.fetchQuotes();
    this.timer = setInterval(() => this.fetchQuotes(), 5000);
  }

  componentWillUnmount() {
    this.timer = null;
  }

  render() {
    //   console.log(this.state.value.open);
    const options = {
      title: {
        text: "BitCoin"
      },

      subtitle: {
        text: "Source: eugenezheng0208@gmail.com"
      },

      xAxis: {
         type:"category",
         tickInterval: 7, // one week
      },

      yAxis: {
        title: {
          text: "Price"
        }
      },
      legend: {
        layout: "vertical",
        align: "right",
        verticalAlign: "middle"
      },

      tooltip: {
        shared: true,
        crosshairs: true
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false
          },
          pointStart: 2010
        }
      },

      series: this.state.series
    };
    return (
      <div>
        <Input
          type="select"
          name="select"
          id="exampleSelect"
          onChange={this.Change}
        >
          <option>Open</option>
          <option>Close</option>
          <option>High</option>
          <option>Low</option>
          <option>All</option>
        </Input>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    );
  }
}

export default BitcoinChart;
