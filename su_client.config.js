module.exports = {
  //target: 'http://54.199.255.117',//標的となるurl
  target: 'http://localhost:3333',//標的となるurl
  timeformat: 'ss.S', //サンプルを増やす milli secでとりたい時
  timeout: 30,
  phases: [
      {"duration": 3, "arrivalRate": 5, "name": "Warm-up"},
      {"pause": 10},
      {"duration": 3, "arrivalRate": 30 , "name": "hoge"},
      {"duration": 6, "arrivalRate": 50, "name": "High load phase"}
    ],
  scenarios: [
    {
      'flow': [
        {'get': {url: '/hoge'}}, {'get': {url: '/huga'}} 
        ]
    }
  ],
  // variables: {
    
  // },
  /**
   * ss.SS -> 秒.ミリ秒
   */
  // spreadSheetSoftwarePath: '/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel'
};

//終わった後エクセル開く
// excel path 表計算ソフトのpath

// 

//todo target => targetURL
