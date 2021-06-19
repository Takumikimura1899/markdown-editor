import Dexie from "dexie";

// IndexedDBに保存するデータの型定義
export interface MemoRecord {
  datetime: string;
  title: string;
  text: string;
}

// Dexieのインスタンス作成　データベース名はmarkdown-editor
const database = new Dexie("markdown-editor");
// テーブル定義
// .version(1)はデータベースのバージョン
// .stores()で使用するテーブルとインデックスとなるデータ名を指定する
database.version(1).stores({ memos: "&datetime" });
// データを扱うテーブルクラスを取得する。ここで再度ジェネリクス
// 最初のMemoRecordはデータの型で、2つめのstringはキーとなるデータ(今回はdatetime)の型
const memos: Dexie.Table<MemoRecord, string> = database.table("memos");

// メモを保存するためにタイトルとテキストを引数として受け取る関数を定義
export const putMemo = async (title: string, text: string): Promise<void> => {
  // 日時については保存のタイミングで自動的に付与すると便利なので、保存する関数内で生成している。
  // ISO8601形式で出力している。この形式は標準化されている。
  const datetime = new Date().toISOString();

  // この処理でIndexedDBに保存する。
  await memos.put({ datetime, title, text });
};
