import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import TempButton from '../components/buttons/TempButton';

import logoImage from '../assets/Taptrip.png';

function Welcome({ onStartExplore, onNavigateToLogin, onNavigateToRegister }) {
  return (
    <div className="flex flex-col h-full px-5 py-6 gap-6 overflow-x-hidden bg-gradient-to-b from-white to-sky-50">
      {/* ロゴとキャッチコピー */}
      <div className="flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-2 mb-2">
          <img src={logoImage} alt="TapTripロゴ" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-bold">TapTrip</h1>
        </div>
        <h2 className="text-2xl font-bold text-blue-600">今日はどこへ行く？</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
          いくつかの質問に答えるだけで、TapTripが今の気分にぴったりの場所を提案します。
        </p>
      </div>

      {/* グラフィック領域 */}
      <div className="flex-1 min-h-[140px] max-h-60 rounded-2xl bg-gradient-to-br from-emerald-300 to-indigo-400 flex items-center justify-center p-4">
        <p className="text-white font-bold text-center text-base">
          あなたのためのスマート旅行プランナー
        </p>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col gap-3 w-full">
        <TempButton
          text="探索をはじめる"
          icon={<FaArrowRight />}
          variant="primary"
          onClick={onStartExplore}
          className="w-full"
        />
        <TempButton
          text="新規登録"
          icon={<FaArrowRight />}
          variant="secondary"
          onClick={onNavigateToRegister}
          className="w-full"
        />
        <span
          onClick={onNavigateToLogin}
          className="text-center text-blue-500 underline text-sm cursor-pointer mt-1"
        >
          すでにアカウントをお持ちの方
        </span>
      </div>
    </div>
  );
}

export default Welcome;