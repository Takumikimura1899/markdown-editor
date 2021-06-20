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

// 1ページあたりの10件と定義
const NUM_PER_PAGE: number = 10;

export const getMemoPageCount = async (): Promise<number> => {
  // memosテーブルから総件数を取得する。count()はDexieに定義された関数
  const totalCount = await memos.count();
  // トータルの件数から1ページ当たりの件数で割って、ページ数を算出
  const pageCount = Math.ceil(totalCount / NUM_PER_PAGE);
  // 0件でも1ページと判定している
  return pageCount > 0 ? pageCount : 1;
};

// テキスト履歴をリストで取得する関数を定義。戻り値は配列なのでMemoRecordの末尾に[]をつけている。
export const getMemos = (page: number): Promise<MemoRecord[]> => {
  // ページ数を元に、取得する最初に位置(OFFSET)を算出している。
  const offset = (page - 1) * NUM_PER_PAGE;
  // memosテーブル～データを取得する処理。
  // offsetとlimitを追加
  // offsetは取得するリスト内の開始位置を設定する
  // limitは取得する件数を設定する
  return memos
    .orderBy("datetime")
    .reverse()
    .offset(offset)
    .limit(NUM_PER_PAGE)
    .toArray();
};
