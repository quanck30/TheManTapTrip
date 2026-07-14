/**
 * @brief 質問コンテキストを購読する useQuestion フック
 * @note context 定義は QuestionContext.js、Provider は QuestionProvider.jsx にある。
 */

import { useContext } from "react";
import { QuestionContext } from "../context/QuestionContext";

export const useQuestion = () => useContext(QuestionContext);
