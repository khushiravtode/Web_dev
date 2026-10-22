
const API_BASE = "http://localhost:3001";

window.startScreenTimeTracking = async function () {
  if (window.__screenTimeStarted) return;

  const token = localStorage.getItem("token");
  if (!token) return;

  window.__screenTimeStarted = true;
  let activeSeconds = 0;
  let locked = false;

  function lockWebsite() {
    if (locked) return;
    locked = true;

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:999999;
      background:#111827; color:white;
      display:flex; flex-direction:column;
      align-items:center; justify-content:center;
      text-align:center; padding:24px;
      font-family:Arial,sans-serif;
    `;

    overlay.innerHTML = `
      <h1>Time is up!</h1>
      <p>Your daily Digital Eddiction screen-time limit
      has been reached.</p>
      <p>Take a break, stretch, drink some water,
      or do something away from your screen.</p>
      <button id="timeLogout"
        style="padding:12px 22px;cursor:pointer">
        Log out
      </button>
    `;

    document.body.appendChild(overlay);

    document.getElementById("timeLogout").onclick = () => {
      localStorage.removeItem("token");
      window.location.reload();
    };
  }

  async function request(path, method = "GET", body) {
    const response = await fetch(API_BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      ...(body ? { body: JSON.stringify(body) } : {})
    });

    if (!response.ok) {
      throw new Error("Screen-time request failed");
    }

    return response.json();
  }

  try {
    const today = await request("/api/time/today");
    if (today.locked) {
      lockWebsite();
      return;
    }
  } catch (error) {
    console.error("Could not check screen time:", error);
    window.__screenTimeStarted = false;
    return;
  }

  setInterval(async () => {
    if (locked) return;

    // Count only while the tab is visible and focused.
    if (
      document.visibilityState === "visible" &&
      document.hasFocus()
    ) {
      activeSeconds++;
    }

    if (activeSeconds >= 30) {
      activeSeconds -= 30;

      try {
        const result = await request(
          "/api/time/heartbeat",
          "POST",
          { seconds: 30 }
        );

        if (result.locked) {
          lockWebsite();
        }
      } catch (error) {
        console.error("Could not save screen time:", error);
      }
    }
  }, 1000);
};

// Start tracking if the user is already logged in.
window.startScreenTimeTracking();

const response = await fetch(
    "http://localhost:3001/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    }
  );
  
  const data = await response.json();

  if (!response.ok) {
    alert(data.error || "Login failed");
    return;
  }
  
  localStorage.setItem("token", data.token);
  
  window.startScreenTimeTracking?.();
  
  console.log("Login successful. Screen-time tracking started.");