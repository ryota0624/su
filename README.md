## install

```
npm i

```

## テストサーバー
- /scripts以下に置いたモジュールが実行されるサーバ

## テスト
- サーバーへリクエストを送り結果をcsvファイルで出力する



## config
- サーバ
su_server.config.jsを記述

- クライアント
su_client.config.jsを記述

```
su_client.config.js
module.exports = {
  target: 'http://localhost:3030', //テストの攻撃先となるサーバURL
  /*
  scenarios 
    テストの実行シナリオ
    flowは配列で配列内のオブジェクトの順序にそってリクエストを送信する
    flow内の要素オブジェクトのプロパティ名がhttpメソッド名になっていて
    リクエスト先のurlをurlプロパティとして所持したオブジェクトをもつ
  **/
  scenarios: [
    {
      'flow': [{'post': {url: '/hoge'}},{'get': {url: '/huga'}} ]
    }
  ]
  /*
  テストシナリオの実行を記述する
  phasesは配列で配列内のオブジェクトの順序にそってシナリオを実行する
  テストシナリオを実行するphaseでは
    duration(シナリオ実行時間), arrivalRate(リクエストのレート/秒), name(csvログファイルに出力する際の名前)を持ったオブジェクトを持つ
  **/
  phases: [
    {'duration': 3, 'arrivalRate': 5, 'name': 'Warm-up'},
    {'duration': 3, 'arrivalRate': 30 , 'name': 'hoge'},
    {'duration': 6, 'arrivalRate': 50, 'name': 'High load phase'}
  ],

  spreadSheetSoftwarePath: '/Applications/Microsoft Excel.app/Contents/MacOS/Microsoft Excel'
  /**
  *csvファイルを開くソフトウェアのpath(記述があるときのみ実行後にソフトウェアでログファイルが開かれる)
  */
};

su_server.config.js
module.exports = {
  host: 'localhost' //サーバのホストネーム
  port: 3030, //サーバの起動するポート番号
  testModule: 'sampleScirpt.js' //テストするモジュールファイル名,/scripts以下に配置する 一つのみ実行可能
}
```

## usage

```
/*
* コマンドによるオプションはconfigファイルより優先される
*/
npm run server -> テストサーバーの起動
npm run client -> テストの開始
```

|clientコマンド|詳細
|:---|:---|
|npm run client|configファイル基準で実行
|npm run client:sec|秒リクエスト到着のテスト開始からの相対時間を秒単位でログを出力する状態で実行
|npm run client:msec|リクエスト到着のテスト開始からの相対時間をミリ秒単位でログを出力する状態で実行
|npm run client:min|リクエスト到着のテスト開始からの相対時間を分単位でログを出力する状態で実行
|npm run client:quick [duration] [arrivalRate]| [duration]秒間に[arrivalRate]/1sec リクエストで実行する シナリオはsu_client.config.jsのscenarios配列の先頭のものが使われる
|npm run client:onlyAttack|サーバへの負荷だけおこなう

|serverコマンド|詳細
|:---|:---|
|npm run server|１コアでのサーバの立ち上げ
|npm run server:cluster|クラスターでのサーバ立ち上げ

|その他コマンド|詳細
|:--|:--|
|npm run readserverStat [logfilepath]|[logfilepath]からcsvファイルを読み込みサマリー反映できるようにsutilleryに取り込む
|npm run summary:sec|
|npm run summary:min|
|npm run clean|sutillery内のログを削除

## テストされるモジュールのルール
```
/*
* request -> express requestオブジェクト
* response -> express responseオブジェクト
* next -> express next handler
**/
module.exports = (request, response, next) => {
  console.log(request.url);
  response.send('hoge');
  // or
  next();
  //テストされるモジュールないでレスポンスを返す、もしくはnext()の実行が必要
}
```
## 出力log
csv形式で出力
```
startDate,time,pid,rss/MB,heapUsed/MB,heapTotal/MB,osFreeMem/MB,osTotalMem/MB,la/1min,la/5min,la/15min,statusCode,responseTime
```
ヘッダーの詳細
```
startDate -> clientの実行開始時間
time -> server側の負荷開始時間からの相対時間
pid -> プロセスのID
rss/MB -> regident set size
heapUsed/MB -> ログ出力された時のプロセスの使用heap量
heapTotal/MB -> プロセスの使用できるheap量
osFreeMem/MB -> ログ出力された時のPCが使用しているメモリー量
osTotalMem/MB -> PCのメモリー量
la/1min,la/5min,la/15min -> 1分, 5分, 15分の ロードアベレージ
responseTime -> レスポンスまでにかかった時間

```