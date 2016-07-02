module.exports = {
  target: 'http://localhost:3333',//標的となるurl
  // duration: 3, //テストする期間 second
  // rate: 30, //リクエストの送信レート
  timeformat: 'ss.S', //サンプルを増やす milli secでとりたい時
  timeout: 30,
  phases: [
      {"duration": 3, "arrivalRate": 50, "name": "Warm-up"},
      // {"duration": 30, "arrivalRate": 30 , "name": "hoge"},
      // {"duration": 30, "arrivalRate": 50, "name": "High load phase"}
    ],
  scenarios: [
    {
      'flow': [
        {'get': {url: '/ad?spotId={{ id }}'}}, 
        {'get': {url: '/hoge?spotId={{ id }}'}}
      ]
    },
  ],
  variables: {
    id: ["1","2","3","4"]
  },
  //cap: "mb", //memory系の表示単位 kb, mb
  /**
   * ss.SS -> 秒.ミリ秒
   */

  //artilleryQuiet: true //artilleryQuietが黙って実行される
  spreadSheetSoftwarePath: '/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel' //コマンド実行後指定したアプリケーションで出力ファイルを開く
};