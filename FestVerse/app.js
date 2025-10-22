document.addEventListener("DOMContentLoaded", () => {
  
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const personalizeBtn = document.getElementById("personalize");
  const signature = document.getElementById("signature");
  const senderSpan = document.getElementById("sender");
  const shareBtn = document.getElementById("share");
  if (!shareBtn) return;
  const page = (document.body.dataset.page || "").toLowerCase();
  

  // --- Helper: handle personalization ---
  if (personalizeBtn) {
    personalizeBtn.addEventListener("click", () => {
      const name = prompt("Enter your name (optional):")?.trim();
      if (name) {
        senderSpan.textContent = name;
        signature.hidden = false;
        // Update URL so it can be shared
        const p = new URLSearchParams(location.search);
        p.set("from", name);
        history.replaceState({}, "", location.pathname + "?" + p.toString());
      }
    });
  }

  // --- Helper: read ?from=Name ---
  const params = new URLSearchParams(location.search);
  const fromName = params.get("from");
  if (fromName) {
    senderSpan.textContent = fromName;
    signature.hidden = false;
  }

  // --- SHARE feature ---
  
  shareBtn.addEventListener("click", async () => {
    try {
      const u = new URL(location.origin + "/card.html");

      if (page === "diwali") {
        u.searchParams.set("theme", "diwali");
        u.searchParams.set("msg", "Happy Diwali");
        u.searchParams.set("sub", "May light, joy and kindness fill your home.");
      } else if (page === "newyear") {
        u.searchParams.set("theme", "newyear");
        u.searchParams.set("msg", "Happy New Year");
        u.searchParams.set("sub", "Wishing you peace, health, and new beginnings.");
      }

      // optional: include a name already shown on the page
      const nameEl = document.getElementById("sender") || document.getElementById("from");
      const from = nameEl ? (nameEl.textContent || "").trim() : "";
      if (from) u.searchParams.set("from", from);

      // recipients see a clean card with no controls
      u.searchParams.set("view", "card");
      const url = u.toString();

      // share/copy with fallbacks
      const shareData = {
        title: page === "newyear" ? "Happy New Year" : "Happy Diwali",
        text: "A greeting card for you",
        url,
      };

      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      } else {
        window.prompt("Copy this link:", url);
      }
    } catch (e) {
      console.error(e);
      alert("Sharing failed: " + (e?.message || e));
    }
  })



  // --- PAGE-SPECIFIC BEHAVIOR ---

  // 🪔 Diwali Page
  if (page === "diwali") {
    const diya = document.getElementById("diya");
    const lightBtn = document.getElementById("lightBtn");
    lightBtn.addEventListener("click", () => {
      diya.classList.add("lit");
      lightBtn.textContent = "✨ Diya Lit! ✨";
      if (!prefersReduced) {
        diya.animate([{ transform: "scale(1)" }, { transform: "scale(1.05)" }, { transform: "scale(1)" }],
                     { duration: 800 });
      }
    });
  }

  // 🎆 New Year Page
  if (page === "newyear") {
    const celebrateBtn = document.getElementById("celebrate");
    celebrateBtn.addEventListener("click", () => {
      celebrateBtn.textContent = "🎉 Happy New Year!";
      if (!prefersReduced && typeof Confetti !== "undefined") {
        Confetti.burst(innerWidth / 2, innerHeight * 0.35);
      }
    });
  }
});