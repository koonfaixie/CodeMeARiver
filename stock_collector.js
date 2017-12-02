// nohup node stock_collector & or npm run stock_collector

const STOCK = 'MSFT';
const API_KEY = 'AG0IP72EVIO313VX';
const axios = require('axios');
const mongoose = require('mongoose');
const Stock = require('./models/stock');

mongoose.connect('mongodb://127.0.0.1/fundthatflip', {useMongoClient: true});
mongoose.Promise = global.Promise;

function collect_stock_data(stock_name) {
  axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stock_name}&apikey=${API_KEY}`)
  .then(function(response){
    let date_now = new Date();
    Stock.findOne({stock:stock_name}).then(function(stock){
      if (stock) {
        // if stock already exists, update with just the difference between response and db data
        let stock_data = stock.data,
            response_data = response.data['Time Series (Daily)'],
            diff = Object.keys(response_data).filter(function(x) {return Object.keys(stock_data).indexOf(x) < 0});
        diff.forEach(function(key){
          let new_data = {updated: date_now};
          // removing unwanted periods and numbers from keys
          new_data.open = diff[key]['1. open'];
          new_data.high = diff[key]['2. high'];
          new_data.low = diff[key]['3. low'];
          new_data.close = diff[key]['4. close'];
          new_data.volume = diff[key]['5. volume'];
          stock_data[key] = new_data;
        })
        Stock.findOneAndUpdate({stock: stock_name}, {data: stock_data}).then(function(){
          console.log('stock updated')
        }).catch(function(){
          console.log('stock update error!')
        })
      } else {
        // if stock doesnt exist, include all data from response
        let stock_data = {},
            response_data = response.data['Time Series (Daily)'];
        Object.keys(response_data).forEach(function(key){
          let new_data = {updated: date_now};
          // removing unwanted periods and numbers from keys
          new_data.open = response_data[key]['1. open'];
          new_data.high = response_data[key]['2. high'];
          new_data.low = response_data[key]['3. low'];
          new_data.close = response_data[key]['4. close'];
          new_data.volume = response_data[key]['5. volume'];
          stock_data[key] = new_data;
        })
        console.log(stock_name, stock_data)
        Stock.create({stock:stock_name, data: stock_data}).then(function(){
          console.log('stock created')
        }).catch(function(error){
          console.log(error,'stock creation error!')
        })
      }
    }).catch(function(){
      console.log('please make sure mongodb is running/ credentials are correct')
    })
  })
  .catch(function(response){
    console.log('error!')
  })
}

collect_stock_data(STOCK);

while (true) {
  // set to run again after 24 hours
  setTimeout(function(){ collect_stock_data(STOCK); }, 86400000);
}
