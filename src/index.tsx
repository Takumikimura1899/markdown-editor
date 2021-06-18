import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { Editor } from "./pages/editor";

// const Main = <h1>Markdown Editor </h1>;

// const Header = styled.h1`
//   color: blue;
// `;

// const Main = <Header>Markdown Editor</Header>;

// ページ全体に適用できるスタイルを定義している
const GlobalStyle = createGlobalStyle`
body * {
  box-sizing: border-box;
}
`;

const Main = (
  <>
    <GlobalStyle />
    <Editor />
  </>
);

render(Main, document.getElementById("app"));
