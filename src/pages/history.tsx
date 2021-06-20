import * as React from "react";
// useHistoryはReactのカスタムフックでhistoryオブジェクトを返す。historyはブラウザの履歴を扱う為のAPIを提供してくれる。
// import { useHistory } from "react-router-dom";
// import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { Header } from "../components/header";
import { getMemoPageCount, getMemos, MemoRecord } from "../indexeddb/memos";

const { useState, useEffect } = React;

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`;

const Wrapper = styled.div`
  bottom: 3rem;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
  padding: 0 1rem;
  overflow-y: scroll;
`;

const Memo = styled.button`
  display: block;
  background-color: white;
  border: 1px solid gray;
  width: 100%;
  padding: 1rem;
  margin: 1rem 0;
  text-align: left;
`;

const MemoTitle = styled.div`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const MemoText = styled.div`
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Paging = styled.div`
  bottom: 0;
  height: 3rem;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem;
  position: fixed;
  right: 0;
  text-align: center;
`;

const PagingButton = styled.button`
  background: none;
  border: none;
  display: inline-block;
  height: 2rem;
  padding: 0.5rem 1rem;

  &:disabled {
    color: silver;
  }
`;

// テキストの状態を更新する関数をパラメータとして受け取るようにする(テキストは不要なので、更新関数だけ受け取る)
interface Props {
  setText: (text: string) => void;
}

export const History: React.FC<Props> = (props) => {
  //   const history = useHistory();
  const { setText } = props;

  // IndexedDBから取得したテキスト履歴を管理する
  const [memos, setMemos] = useState<MemoRecord[]>([]);
  // ページングに関する状態を保持する為の定義
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const history = useHistory();

  useEffect(() => {
    // getMemos関数を実行し、非同期処理が終わったら取得したテキスト履歴をsetMemosにわたして更新している
    getMemos(1).then(setMemos);
    getMemoPageCount().then(setMaxPage);
  }, []);

  // 次ページ・前ページに遷移できるかどうかを表すフラグ
  const canNextPage: boolean = page < maxPage;
  const canPrevPage: boolean = page > 1;
  // ページ遷移のボタンをクリックした場合に実行される関数を定義。引数に遷移したいページ数を指定する。
  const movePage = (targetPage: number) => {
    // 遷移先のページが遷移可能であるかを判定している
    if (targetPage < 1 || maxPage < targetPage) {
      return;
    }
    // 遷移可能な場合は管理されている状態(page)を更新する。そしてIndexDBから新しいページのレコードを取得し、状態(memos)を更新する
    setPage(targetPage);
    getMemos(targetPage).then(setMemos);
  };

  return (
    <>
      {/* <h1>History</h1> */}
      {/* history.push("遷移したいパス")というように記述すると、指定されたパスに遷移できる */}
      {/* <Button onClick={() => history.push("/editor")}>エディタへ戻る</Button> */}
      <HeaderArea>
        <Header title="履歴">
          <Link to="/editor">エディタに戻る</Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        {/* memosの中にある配列の要素をReactの要素に変換する。mapは配列の要素を関数に渡し、その戻り値から再度配列を生成するメソッド */}
        {memos.map((memo) => (
          <Memo
            key={memo.datetime}
            // メモをクリックした時の処理を追加
            // setTextを使いそのテキスト履歴のテキストで更新し、history.pushでエディタ画面に遷移する
            onClick={() => {
              setText(memo.text);
              history.push("/editor");
            }}
          >
            <MemoTitle>{memo.title}</MemoTitle>
            <MemoText>{memo.text}</MemoText>
          </Memo>
        ))}
      </Wrapper>
      <Paging>
        <PagingButton
          onClick={() => movePage(page - 1)}
          disabled={!canPrevPage}
        >
          ＜
        </PagingButton>
        {page}/{maxPage}
        <PagingButton
          onClick={() => movePage(page + 1)}
          disabled={!canNextPage}
        >
          ＞
        </PagingButton>
      </Paging>
    </>
  );
};
