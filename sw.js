// キャッシュの名前を定義します。 キャッシュAPIは、このキャッシュ名に応じて別のキャッシュを提供してくれます。
// 例えば一度キャッシュの内容をリセットしたい場合は、キャッシュ名を変更することで新しい状態にできます。
// キャッシュ名は任意の文字列で良いですが、バージョンが分かるように定義したほうが良いです
const CacheName = "Cache:v1";

// selfはサービスワーカー自信をさす。addEverntListenerで各イベントにコールバックを登録する。
// install activateはライフサイクルの各イベントを指す。
self.addEventListener("install", (event) => {
  console.log("ServiceWorker install:", event);
});

self.addEventListener("activate", (event) => {
  console.log("ServiceWorker activate:", event);
});

// Network falling back to cache の実装をした関数です。 詳細は以下で説明します
const networkFallingBackToCache = async (request) => {
  // 定義した名前でキャッシュをひらく
  // Cache インターフェイスは、Request / Response オブジェクトのペアのためのストレージの仕組みを提供します
  // MDNのドキュメントにもこう書かれている通り、リクエストに対してレスポンスを保持してくれるシンプルな仕組みでキャッシュを提供してくれます。
  const cache = await caches.open(CacheName);
  try {
    //   通常のfetchリクエストを実行してレスポンスを取得
    const response = await fetch(request);
    // レスポンス内容をキャッシュに保存しています。 なお response.clone() でレスポンスの内容をコピーしてから保存しなければなりません。
    // これはレスポンスの内部で一度しか読み取りできない処理があるためです。 なので、コピーしたものをキャッシュに保存してください。
    await cache.put(request, response.clone());
    // レスポンスを呼び出し元に返却する。
    return response;
    // リクエスト時にエラーが発生した場合にコンソールにエラーを表示して、キャッシュの内容を返却する処理です。 適切なキャッシュが無い場合、戻り値は undefined になります。
    //  しかしエラーの場合、適切な返却値がないのでそのままで良いでしょう。
  } catch (err) {
    console.error(err);
    return cache.match(request);
  }
};

// fetchイベント時に実行する処理を登録。fetchとはネットワークなどを経由してリソースを取得するために使用するAPI
self.addEventListener("fetch", (event) => {
  // コンソールにリクエストの内容を表示している
  //   console.log("Fetch to:", event.request.url);
  // ネットワークリクエストを行って結果をメインスレッドに戻す処理event.respondWithは完結にいうと、非同期処理(Promise)の実行終了まで待機してくれるメソッド
  //   event.respondWith(fetch(event.request));

  //   最後に fetch イベント時の処理を登録します。 self.addEventListener('fetch', でネットワークリクエストの処理に実行する処理を登録します。
  //   event.respondWith は先ほど説明したとおり、非同期処理を待機して結果を返却してくれるメソッドです。 networkFallingBackToCache(event.request) は作成した関数にリクエストを渡しています。 event.request にメインスレッドからのリクエスト内容が格納されています。
  //   これでネットワークまたはキャッシュからレスポンスが返却されるようになります。
  event.respondWith(networkFallingBackToCache(event.request));
});
