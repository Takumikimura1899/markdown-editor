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

export const putMemo = async (title: string, text: string): Promise<void> => {
  const datetime = new Date().toISOString();
  await memos.put({ datetime, title, text });
};
