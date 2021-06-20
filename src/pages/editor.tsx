import * as React from "react";
// import React from "react";
// import { useState } from "react";
import styled from "styled-components";
import { useStateWithStorage } from "../hooks/use_state_with_storage";
// import * as ReactMarkdown from "react-markdown";
import { putMemo } from "../indexeddb/memos";
import { Button } from "../components/button";
import { SaveModal } from "../components/save_modal";
import { Link } from "react-router-dom";
import { Header } from "../components/header";

// Workerを読み込んでいる。worker-loader!は読み込むファイルがWorkerであることを示している。おまじないのようなもの
import ConvertMarkdownWorker from "worker-loader!../worker/convert_markdown_worker";

// Workerのインスタンスを生成する処理
const convertMarkdownWorker = new ConvertMarkdownWorker();
// useState関数をReactから取り出す
const { useState, useEffect } = React;

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
`;

const HeaderArea = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  left: 0;
`;

const TextArea = styled.textarea`
  border-right: 1px solid silver;
  border-top: 1px solid silver;
  bottom: 0;
  font-size: 1rem;
  left: 0;
  padding: 0.5rem;
  position: absolute;
  top: 0;
  width: 50vw;
`;

const Preview = styled.div`
  border-top: 1px solid silver;
  bottom: 0;
  overflow-y: scroll;
  padding: 1rem;
  position: absolute;
  right: 0;
  top: 0;
  width: 50vw;
`;

// localStrageでデータの参照・保存に使うキー名を決めておく
// const StorageKey = "pages/editor:text";

interface Props {
  text: string;
  setText: (text: string) => void;
}

// Editorという変数はReact.FCという型であると定義している。
// Reac.FCは関数コンポーネントの略でシンプルな関数でReactのコンポーネントを返すと定義している。
// React.FCで定義された関数は、JSXで<Editor>という形式で呼び出す事が出来る。
export const Editor: React.FC<Props> = (props) => {
  // 初期値をlocalStrageから取得した値をセットする。nullがかえってきた場合の為に||""で必ず文字列が入るようにする。
  //   const [text, setText] = useState<string>(
  //     localStorage.getItem(StorageKey) || ""
  //   );
  const { text, setText } = props;

  // const saveMemo = (): void => {
  //   putMemo("TITLE", text);
  // };

  // モーダルを表示するかどうかのフラグ管理。デフォルトは表示したくないのでfalse
  const [showModal, setShowModal] = useState(false);

  // htmlの文字列を管理する状態を用意
  const [html, setHtml] = useState("");

  // useEffectを使って、初回のみWorkerから結果を受け取る関数を登録しておく
  // 今回はテストなので受け取ったデータをコンソールに表示するだけ。
  useEffect(() => {
    // WebWorkerから受け取った処理結果(HTML)で状態を更新
    convertMarkdownWorker.onmessage = (event) => {
      setHtml(event.data.html);
    };
  }, []);

  // useEffectを使って、テキストの変更時にWorkerへテキストデータを送信している。
  useEffect(() => {
    convertMarkdownWorker.postMessage(text);
  }, [text]);

  return (
    <>
      <HeaderArea>
        <Header title="Markdown Editor">
          {/* ボタンを押した時にモーダル表示のフラグをONにする処理 */}
          <Button onClick={() => setShowModal(true)}>保存する</Button>
          <Link to="/history">履歴を見る</Link>
        </Header>
      </HeaderArea>
      <Wrapper>
        <TextArea
          //   onChange={(event) => {
          //     const changedText = event.target.value;
          //     localStorage.setItem(StorageKey, changedText);
          //     setText(changedText);
          //   }}
          onChange={(event) => setText(event.target.value)}
          value={text}
        />
        <Preview>
          {/* HTMLをdivタグ内に表示する */}
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Preview>
      </Wrapper>
      {/* モーダルの表示がONになっている場合のみモーダルを表示する判定式 */}
      {showModal && (
        // モーダルの表示処理
        <SaveModal
          // IndexDBへの保存処理とモーダルを閉じるためにshowModalへfalseをセットする。
          onSave={(title: string): void => {
            putMemo(title, text);
            setShowModal(false);
          }}
          // こちらはモーダルを閉じるだけ
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
};
