import * as React from "react";
// import React from "react";
// import { useState } from "react";
import styled from "styled-components";
import { useStateWithStorage } from "../hooks/use_state_with_storage";
import * as ReactMarkdown from "react-markdown";
import { putMemo } from "../indexeddb/memos";
import { Button } from "../components/button";
import { SaveModal } from "../components/save_modal";

// useState関数をReactから取り出す
const { useState } = React;

const Header = styled.header`
  align-content: center;
  display: flex;
  font-size: 1.5rem;
  height: 2rem;
  justify-content: space-between;
  left: 0;
  line-height: 2rem;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  top: 0;
`;

const HeaderControl = styled.div`
  height: 2rem;
  display: flex;
  align-content: center;
`;

const Wrapper = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 3rem;
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
const StorageKey = "pages/editor:text";

// Editorという変数はReact.FCという型であると定義している。
// Reac.FCは関数コンポーネントの略でシンプルな関数でReactのコンポーネントを返すと定義している。
// React.FCで定義された関数は、JSXで<Editor>という形式で呼び出す事が出来る。
export const Editor: React.FC = () => {
  // 初期値をlocalStrageから取得した値をセットする。nullがかえってきた場合の為に||""で必ず文字列が入るようにする。
  //   const [text, setText] = useState<string>(
  //     localStorage.getItem(StorageKey) || ""
  //   );
  const [text, setText] = useStateWithStorage("", StorageKey);

  // const saveMemo = (): void => {
  //   putMemo("TITLE", text);
  // };

  // モーダルを表示するかどうかのフラグ管理。デフォルトは表示したくないのでfalse
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Header>
        Markdown Editor
        <HeaderControl>
          {/* ボタンを押した時にモーダル表示のフラグをONにする処理 */}
          <Button onClick={() => setShowModal(true)}>保存する</Button>
        </HeaderControl>
      </Header>
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
          <ReactMarkdown children={text} />
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
