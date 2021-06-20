import * as marked from "marked";
import * as sanitizeHtml from "sanitize-html";
// Web Workerを変数にセット
// 通常のJavaScriptであれば、selfというグローバル変数でアクセス出来る
// self as any と書くことで型チェックを回避する。anyは何でもOKという意味
// workerという変数はWorkerという型だと定義しなおす。
const worker: Worker = self as any;

// メインスレッドからデータを渡された際に実行する関数を定義している。
worker.addEventListener("message", (event) => {
  // メインスレッドから渡されたデータをコンソールに出力している。
  // console.log("Worker Received:", event.data);

  // let count: number = 1;
  // while (count < 2_000_000_000) {
  //   count++;
  // }
  // // postMessageという関数を呼び出して、メインスレッドへ処理結果を送信している
  // worker.postMessage({ result: event.data });

  const text = event.data;
  const html = sanitizeHtml(marked(text), {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "h1", "h2"],
  });
  worker.postMessage({ html });
});
