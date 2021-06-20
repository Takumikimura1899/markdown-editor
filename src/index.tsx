import * as React from "react";
import { render } from "react-dom";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import { Editor } from "./pages/editor";
// HashRouter as Routerはエイリアスの記法でHashRouterという要素をRouterという名前で扱うという意味。
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { History } from "./pages/history";
import { useStateWithStorage } from "./hooks/use_state_with_storage";

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

const StorageKey = "/editor:text";

// useStateを使うためにMainを関数化
const Main: React.FC = () => {
  const [text, setText] = useStateWithStorage("", StorageKey);

  return (
    <>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path="/editor">
            <Editor text={text} setText={setText} />
          </Route>
          <Route exact path="/history">
            <History setText={setText} />
          </Route>
          <Redirect to="/editor" path="*" />
        </Switch>
      </Router>
    </>
  );
};

render(<Main />, document.getElementById("app"));
