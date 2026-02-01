"use client";

export default function Home() {
  async function createPaste() {
    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: "Hello from Pastebin Lite",
        ttl_seconds: 60,
        max_views: 3,
      }),
    });

    const text = await res.text();

    try {
      const data = JSON.parse(text);
      alert(JSON.stringify(data, null, 2));
    } catch {
      alert("Server did not return JSON:\n\n" + text);
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Pastebin Lite</h1>
      <button onClick={createPaste}>Create Paste</button>
    </main>
  );
}
