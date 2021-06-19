import * as React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: dodgerblue;
  border: none;
  box-shadow: none;
  color: white;
  font-size: 1rem;
  height: 2rem;
  min-width: 5rem;
  padding: 0 1rem;

  &.cancel {
    background: white;
    border: 1px solid gray;
    color: gray;
  }
`;

// このコンポーネントに渡すパラメータの型を定義する。childrenはボタン内に表示するテキストで、onClickはボタンをクリックした場合の処理関数になっている
interface Props {
  cancel?: boolean;
  children: string;
  onClick: () => void;
}

// ボタンコンポーネントを返す関数の定義。React.FC<Props>のように定義すると、引数のpropsはPropsであると型を明示できる
export const Button: React.FC<Props> = (props) => (
  // 渡されたテキストとクリック時の処理関数を使って、コンポーネントを描画する。
  <StyledButton
    onClick={props.onClick}
    className={props.cancel ? "cancel" : ""}
  >
    {props.children}
  </StyledButton>
);
