import { useState } from "react";

// カスタムフックを定義。カスタムフックはuseから始める慣例がある。
// init:stringは初期値で、useStateの引数と同じ
// key:stringはlocalStrageに保存する際のキー
// [string,(s:string) => void]はカスタムフックの戻り値でuseStateの戻り値と同じ型
export const useStateWithStorage = (
  init: string,
  key: string
): [string, (s: string) => void] => {
  // localStrageの値を取得しつつ、取得出来ない場合は引数の初期値を使っている
  const [value, setValue] = useState<string>(localStorage.getItem(key) || init);

  // useStateから取得した関数とlocalStrageへの保存を組み合わせた関数を生成する。
  const setValueWithStorage = (nextValue: string): void => {
    setValue(nextValue);
    localStorage.setItem(key, nextValue);
  };

  // useStateから取得した値とlocalStorageへの保存を組み合わせた更新関数を返却している。
  return [value, setValueWithStorage];
};
