import { useCallback, useState } from "react";

/** GET /api/user/getAll への接続テスト（Vite の proxy 経由で同一オリジン） */
export default function ApiGetAllTest() {
  const [status, setStatus] = useState("idle");
  const [ms, setMs] = useState(null);
  const [body, setBody] = useState(null);
  const [err, setErr] = useState(null);

  const run = useCallback(async () => {
    setStatus("loading");
    setErr(null);
    setBody(null);
    setMs(null);
    const t0 = performance.now();
    try {
      const res = await fetch("/api/user/getAll", {
        method: "GET",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      const t1 = performance.now();
      setMs(Math.round(t1 - t0));
      if (!res.ok) {
        setStatus("error");
        setErr(`HTTP ${res.status} ${res.statusText}\n${text}`);
        return;
      }
      try {
        setBody(JSON.parse(text));
      } catch {
        setBody(text);
      }
      setStatus("ok");
    } catch (e) {
      setStatus("error");
      setErr(e instanceof Error ? e.message : String(e));
      setMs(Math.round(performance.now() - t0));
    }
  }, []);

  return (
    <section
      style={{
        margin: "1rem auto",
        maxWidth: 520,
        padding: "1rem 1.25rem",
        border: "1px solid #c8d6e5",
        borderRadius: 8,
        background: "#f8fafc",
        fontFamily: "system-ui, sans-serif",
        fontSize: 14,
      }}
    >
      <h2 style={{ margin: "0 0 0.75rem", fontSize: 16 }}>API 接続テスト</h2>
      <p style={{ margin: "0 0 0.75rem", color: "#576574" }}>
        <code>/api/user/getAll</code>（Vite proxy → nginx → Laravel）
      </p>
      <button
        type="button"
        onClick={run}
        disabled={status === "loading"}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 6,
          border: "1px solid #8395a7",
          background: status === "loading" ? "#dfe6e9" : "#fff",
          cursor: status === "loading" ? "wait" : "pointer",
        }}
      >
        {status === "loading" ? "リクエスト中…" : "接続を試す"}
      </button>
      {ms != null && (
        <p style={{ margin: "0.75rem 0 0", color: "#576574" }}>
          所要時間: <strong>{ms} ms</strong>
        </p>
      )}
      {status === "ok" && body != null && (
        <pre
          style={{
            margin: "0.75rem 0 0",
            padding: "0.75rem",
            background: "#1e272e",
            color: "#55efc4",
            borderRadius: 6,
            overflow: "auto",
            fontSize: 13,
          }}
        >
          {typeof body === "string" ? body : JSON.stringify(body, null, 2)}
        </pre>
      )}
      {status === "error" && err != null && (
        <pre
          style={{
            margin: "0.75rem 0 0",
            padding: "0.75rem",
            background: "#2d0a0a",
            color: "#fab1a0",
            borderRadius: 6,
            overflow: "auto",
            whiteSpace: "pre-wrap",
            fontSize: 13,
          }}
        >
          {err}
        </pre>
      )}
    </section>
  );
}
