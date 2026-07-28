import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { updateDisplayName } from "../services/userService";
import { User, Camera, Bell, Lock, ChevronLeft, HelpCircle, ChevronRight, Pencil, Check } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const { logout, user, setAuthenticatedUser } = useAuth();

  const [formData, setFormData] = useState(user);
  const [savedData, setSavedData] = useState(user);

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const avatarInputRef = useRef(null);
  const avatarObjectUrlRef = useRef(null);
  const [editingField, setEditingField] = useState(null);
  const [draftValue, setDraftValue] = useState("");

  const hasChanges = formData.displayName !== savedData.displayName;

  const displayedAvatar = avatarPreview || formData.avatarUrl || null;

  useEffect(() => {
    return () => {
      if (avatarObjectUrlRef.current) {
        URL.revokeObjectURL(avatarObjectUrlRef.current);
      }
    };
  }, []);

  const startEditing = (field) => {
    setEditingField(field);
    setDraftValue(formData[field]);
    setStatusMessage("");
  };

  const confirmEditing = () => {
    if (!editingField) return;

    const nextValue = draftValue.trim();
    if (!nextValue) {
      setStatusType("error");
      setStatusMessage("ユーザー名を入力してください。");
      return;
    }
    if (nextValue.length > 20) {
      setStatusType("error");
      setStatusMessage("ユーザー名は20文字以内で入力してください。");
      return;
    }

    setFormData((prev) => ({ ...prev, [editingField]: nextValue }));
    setEditingField(null);
  };

  const handleSaveClick = () => {
    if (!hasChanges || isSaving) return;
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirm(false);

    const displayName = formData.displayName.trim();
    if (!displayName) {
      setStatusType("error");
      setStatusMessage("ユーザー名を入力してください。");
      return;
    }
    if (displayName.length > 20) {
      setStatusType("error");
      setStatusMessage("ユーザー名は20文字以内で入力してください。");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");

    try {
      const result = await updateDisplayName(displayName);
      const updatedUser = { ...user, displayName };

      setFormData(updatedUser);
      setSavedData(updatedUser);
      setAuthenticatedUser(updatedUser);
      setStatusType("success");
      setStatusMessage(result.message || "プロフィールを更新しました！");
    } catch (err) {
      setStatusType("error");
      setStatusMessage(err.message || "プロフィールの更新に失敗しました。");
    } finally {
      setIsSaving(false);
    }
  };
  const setAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setStatusType("error");
      setStatusMessage("JPG、PNG、WEBP形式の画像を選択してください。");
      event.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      setStatusType("error");
      setStatusMessage("画像サイズは5MB以下にしてください。");
      event.target.value = "";
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    if (avatarObjectUrlRef.current) {
      URL.revokeObjectURL(avatarObjectUrlRef.current);
    }

    avatarObjectUrlRef.current = nextPreview;
    setAvatarPreview(nextPreview);
    setAvatarLoadError(false);
    setStatusMessage("");
    event.target.value = "";
  };
  const handleCancelSave = () => setShowConfirm(false);

  const handleBack = () => navigate(-1);
  const handleMenuClick = () => {};

  const handleLogout = async () => {
    // セッション破棄とローカル状態のクリアを行い、トップへ戻る
    await logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-white min-h-full flex flex-col relative">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-4">
        <button onClick={handleBack} className="text-slate-700 p-1 -ml-1">
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-[15px] font-semibold text-slate-800">アカウント</h1>
        <button className="text-slate-500 p-1 -mr-1">
          <HelpCircle size={20} />
        </button>
      </div>

      {/* アバター */}
      <div className="flex flex-col items-center pt-4 pb-6">
        <div className="relative">
          {displayedAvatar && !avatarLoadError ? (
            <img className="w-20 h-20 rounded-full object-cover" src={displayedAvatar} alt="プロフィール画像" onError={() => setAvatarLoadError(true)} />
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
              <User size={32} />
            </div>
          )}
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={setAvatar}
            className="hidden"
          />
          <button
            type="button"
            aria-label="プロフィール画像を変更"
            className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-sky-400 text-white flex items-center justify-center border-2 border-white p-0"
            onClick={() => avatarInputRef.current?.click()}
          >
            <Camera size={12} />
          </button>
        </div>
        <h2 className="mt-3 text-[17px] font-semibold text-slate-800">{formData.displayName}</h2>
        <p className="text-[13px] text-slate-400 mt-0.5">週末の散歩が好き</p>
      </div>

      {/* フィールド */}
      <div className="px-4 flex flex-col divide-y divide-slate-100 border-y border-slate-100">
        {/* 表示名：編集可能 */}
        <EditableField
          label="表示名"
          value={formData.displayName}
          isEditing={editingField === "displayName"}
          draftValue={draftValue}
          onDraftChange={setDraftValue}
          onStartEdit={() => startEditing("displayName")}
          onConfirm={confirmEditing}
        />
        {/* メールアドレス：表示のみ */}
        <div className="py-3">
          <label className="text-[12px] text-slate-400 mb-1 block">メールアドレス</label>
          <span className="text-[14px] text-slate-400">{formData.email ?? "メールアドレス"}</span>
        </div>
      </div>

      {/* メニュー */}
      <div className="px-4 mt-5">
        <div className="flex flex-col divide-y divide-slate-100 border-y border-slate-100">
          <div onClick={() => handleMenuClick("パスワード変更")} className="flex items-center justify-between py-3 cursor-pointer">
            <span className="flex items-center gap-2 text-[14px] text-slate-700">
              <Lock size={16} className="text-slate-400" />
              パスワード変更
            </span>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
          <div onClick={() => handleMenuClick("通知設定")} className="flex items-center justify-between py-3 cursor-pointer">
            <span className="flex items-center gap-2 text-[14px] text-slate-700">
              <Bell size={16} className="text-slate-400" />
              通知設定
            </span>
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
      </div>

      {/* アクションエリア */}
      <div className="px-4 pb-8 flex flex-col items-center mt-auto">
        <div
          className={`text-[13px] mb-2 h-5 transition-opacity ${
            statusMessage
              ? statusType === "error"
                ? "opacity-100 text-rose-500"
                : "opacity-100 text-emerald-500"
              : "opacity-0"
          }`}
        >
          {statusMessage || "\u00A0"}
        </div>

        <button
          onClick={handleSaveClick}
          disabled={!hasChanges || isSaving}
          className={`w-full h-12 rounded-xl text-[15px] font-medium transition-colors active:scale-[0.98] ${
            hasChanges ? "bg-sky-400 text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          } ${isSaving ? "opacity-70" : ""}`}
        >
          {isSaving ? "保存中..." : "変更を保存"}
        </button>
        <button onClick={handleLogout} className="mt-3 text-[13px] text-rose-400">
          ログアウト
        </button>
      </div>

      {/* 保存確認ダイアログ */}
      {showConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 px-6">
          <div className="w-full max-w-[280px] bg-white rounded-2xl p-5 text-center shadow-lg">
            <p className="text-[15px] font-medium text-slate-800 mb-1">本当に変更しますか？</p>
            <p className="text-[13px] text-slate-400 mb-4">プロフィールの内容を更新します。</p>
            <div className="flex gap-2">
              <button onClick={handleCancelSave} className="flex-1 h-10 rounded-xl border border-slate-200 text-[14px] text-slate-600">
                キャンセル
              </button>
              <button onClick={handleConfirmSave} className="flex-1 h-10 rounded-xl bg-sky-400 text-white text-[14px] font-medium">
                保存する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditableField({ label, value, isEditing, draftValue, onDraftChange, onStartEdit, onConfirm, type = "text" }) {
  return (
    <div className="py-3">
      <label className="text-[12px] text-slate-400 mb-1 block">{label}</label>
      {isEditing ? (
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={draftValue}
            autoFocus
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onConfirm()}
            className="flex-1 h-9 border-b border-sky-300 text-[14px] text-slate-800 outline-none bg-transparent"
          />
          <button onClick={onConfirm} className="text-sky-400 p-1" aria-label="確定">
            <Check size={18} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-slate-800">{value}</span>
          <button onClick={onStartEdit} className="text-slate-400 p-1" aria-label={`${label}を変更`}>
            <Pencil size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
