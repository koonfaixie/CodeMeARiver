import React from 'react';
import axios from 'axios';
import { LineChart, Brush } from 'react-d3-components';

export default class Stock extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stock_obj: null,
      stock_name: null,
      stock_data: null,
      filter: 'volume',
      xScale: null,
      xScaleBrush: null,
      sorted_keys: [],
    }
  }

  componentWillMount() {
    axios.post('/api/stock/', {stock: 'MSFT'}).then((response)=>{
      let stock_obj = response.data.stock_obj,
          sorted_keys = Object.keys(stock_obj.data).sort();
      this.setState({
        stock_obj: stock_obj,
        stock_name: stock_obj.stock,
        stock_data: stock_obj.data,
        sorted_keys: sorted_keys,
        xScale: d3.time.scale().domain([new Date(sorted_keys[0]), new Date(sorted_keys[sorted_keys.length-1])]).range([0, 1200]),
        xScaleBrush: d3.time.scale().domain([new Date(sorted_keys[0]), new Date(sorted_keys[sorted_keys.length-1])]).range([0, 1200]),
      })
    })
    .catch(()=>{
      alert('We could\'t connect to the database. Please check your internet connection and refresh the page.')
    })
  }

  tooltip(x, y) {
    return `(${x} ${y.x}) ${y.y}`
  }

  _onChange(extent) {
    this.setState({xScale: d3.time.scale().domain([extent[0], extent[1]]).range([0, 1200])});
  }

  render() {
    return(
      <div className="stock-page">
        {this.state.stock_obj ?
          <div>
            <div className="header">
              {this.state.stock_name}
            </div>
            <div>
              <select value={this.state.filter} onChange={(e)=>{this.setState({filter: e.target.value})}}>
                <option value="volume"> Volume </option>
                <option value="open"> Open </option>
                <option value="high"> High </option>
                <option value="low"> Low </option>
                <option value="close"> Close </option>
              </select>
            </div>
            <div className="graph">
              <LineChart
                data={[
                  {label: this.state.filter, values: this.state.sorted_keys.map((date)=> {
                    return {x: new Date(date), y: parseFloat(this.state.stock_data[date][this.state.filter])}
                    })
                  },
                ]
                }
                 width={1200}
                 height={300}
                 margin={{top: 0, bottom: 0, left: 0, right: 0}}
                 xScale={this.state.xScale}
                 tooltipHtml={this.tooltip.bind(this)}
                 xAxis={{label: 'date', tickFormat: d3.time.format("%m/%d")}}
                 yAxis={{label: this.state.filter}}
              />
              <div className="brush" style={{float: 'none'}}>
                <Brush
                   width={1200}
                   height={50}
                   margin={{top: 0, bottom: 30, left: 0, right: 0}}
                   xScale={this.state.xScaleBrush}
                   extent={[new Date(this.state.sorted_keys[0]), new Date(this.state.sorted_keys[10])]}
                   onChange={this._onChange.bind(this)}
                   xAxis={{tickFormat: d3.time.format("%m/%d")}}
                />
              </div>
            </div>
            <div className="report">
              <table>
                <tbody>
                  <tr>
                    <th>date</th>
                    <th>open</th>
                    <th>high</th>
                    <th>low</th>
                    <th>close</th>
                    <th>volume</th>
                    <th>last updated</th>
                  </tr>
                    {this.state.sorted_keys.map((date, index) =>
                      <tr key={index}>
                        <td>{new Date(date).toLocaleDateString()}</td>
                        <td>{this.state.stock_data[date].open}</td>
                        <td>{this.state.stock_data[date].high}</td>
                        <td>{this.state.stock_data[date].low}</td>
                        <td>{this.state.stock_data[date].close}</td>
                        <td>{this.state.stock_data[date].volume}</td>
                        <td>{new Date(this.state.stock_data[date].updated).toLocaleDateString()}</td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
          :
          <div className="pending">
            Fetching stock data...
          </div>
        }
      </div>
    )
  }
}
