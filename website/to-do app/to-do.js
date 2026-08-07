/* ==========================================================================
   LEDGER — to-do app logic
   Plain JavaScript, no framework. Everything lives in one State object
   that is the single source of truth, persisted to localStorage on
   every change and re-rendered from scratch (simple + easy to follow).
   ========================================================================== */

   (function () {
    "use strict";
  
    /* ---------------------------------------------------------------------
       Constants & DOM references
       --------------------------------------------------------------------- */
    const STORAGE_KEY = "ledger.tasks";
    const THEME_KEY = "ledger.theme";
  
    const form = document.getElementById("taskForm");
    const input = document.getElementById("taskInput");
    const list = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");
    const activeCountEl = document.getElementById("activeCount");
    const completedCountEl = document.getElementById("completedCount");
    const totalCountEl = document.getElementById("totalCount");
    const clearCompletedBtn = document.getElementById("clearCompleted");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const themeToggle = document.getElementById("themeToggle");
  
    /* ---------------------------------------------------------------------
       State
       --------------------------------------------------------------------- */
    let tasks = loadTasks();          // Array<{id, text, completed, createdAt}>
    let currentFilter = "all";        // "all" | "active" | "completed"
  
    /* ---------------------------------------------------------------------
       Persistence helpers
       --------------------------------------------------------------------- */
    function loadTasks() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (err) {
        console.error("Could not read saved tasks, starting fresh.", err);
        return [];
      }
    }
  
    function saveTasks() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (err) {
        console.error("Could not save tasks to localStorage.", err);
      }
    }
  
    /* ---------------------------------------------------------------------
       Task operations
       --------------------------------------------------------------------- */
    function addTask(text) {
      const trimmed = text.trim();
      if (!trimmed) return;
  
      tasks.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        text: trimmed,
        completed: false,
        createdAt: Date.now(),
      });
  
      saveTasks();
      render();
    }
  
    function toggleTask(id) {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      task.completed = !task.completed;
      saveTasks();
      render();
    }
  
    function deleteTask(id) {
      const el = list.querySelector(`[data-id="${id}"]`);
      // Play the removal animation, then actually remove from state.
      if (el) {
        el.classList.add("is-removing");
        el.addEventListener(
          "animationend",
          () => {
            tasks = tasks.filter((t) => t.id !== id);
            saveTasks();
            render();
          },
          { once: true }
        );
      } else {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        render();
      }
    }
  
    function editTask(id, newText) {
      const trimmed = newText.trim();
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
  
      if (!trimmed) {
        // Editing down to nothing removes the task, same as most list apps.
        deleteTask(id);
        return;
      }
      task.text = trimmed;
      saveTasks();
      render();
    }
  
    function clearCompleted() {
      tasks = tasks.filter((t) => !t.completed);
      saveTasks();
      render();
    }
  
    /* ---------------------------------------------------------------------
       Rendering
       --------------------------------------------------------------------- */
    function getFilteredTasks() {
      if (currentFilter === "active") return tasks.filter((t) => !t.completed);
      if (currentFilter === "completed") return tasks.filter((t) => t.completed);
      return tasks;
    }
  
    function render() {
      const visible = getFilteredTasks();
  
      list.innerHTML = "";
  
      if (visible.length === 0) {
        emptyState.hidden = false;
        emptyState.querySelector(".empty-line").textContent =
          tasks.length === 0
            ? "— nothing here yet —"
            : currentFilter === "completed"
            ? "— nothing completed yet —"
            : "— all clear —";
      } else {
        emptyState.hidden = true;
        visible.forEach((task) => list.appendChild(buildTaskElement(task)));
      }
  
      updateCounts();
      updateClearButtonState();
    }
  
    function buildTaskElement(task) {
      const li = document.createElement("li");
      li.className = "task-item" + (task.completed ? " is-completed" : "");
      li.dataset.id = task.id;
  
      li.innerHTML = `
        <button class="task-check" type="button" aria-pressed="${task.completed}" aria-label="Mark task ${
        task.completed ? "incomplete" : "complete"
      }">
          <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7"/>
          </svg>
        </button>
        <div class="task-body">
          <span class="task-text">${escapeHtml(task.text)}</span>
        </div>
        <div class="task-actions">
          <button class="icon-btn edit-btn" type="button" aria-label="Edit task">
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M12.5 6.5l5 5L8 21H3v-5l9.5-9.5Z"/>
              <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" d="M11 8l5 5"/>
            </svg>
          </button>
          <button class="icon-btn icon-btn-danger delete-btn" type="button" aria-label="Delete task">
            <svg class="icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>
            </svg>
          </button>
        </div>
      `;
  
      // Wire up interactions
      li.querySelector(".task-check").addEventListener("click", () => toggleTask(task.id));
      li.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));
      li.querySelector(".edit-btn").addEventListener("click", () => startEditing(li, task));
  
      // Double-click on the text is a fast shortcut for editing.
      li.querySelector(".task-text").addEventListener("dblclick", () => startEditing(li, task));
  
      return li;
    }
  
    function startEditing(li, task) {
      const body = li.querySelector(".task-body");
      body.innerHTML = `<input type="text" class="task-edit-input" maxlength="140" value="${escapeHtml(task.text)}" />`;
      const editInput = body.querySelector(".task-edit-input");
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);
  
      const commit = () => editTask(task.id, editInput.value);
      const cancel = () => render();
  
      editInput.addEventListener("blur", commit);
      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); editInput.blur(); }
        if (e.key === "Escape") { e.preventDefault(); editInput.removeEventListener("blur", commit); cancel(); }
      });
    }
  
    function updateCounts() {
      const activeCount = tasks.filter((t) => !t.completed).length;
      const completedCount = tasks.length - activeCount;
  
      activeCountEl.textContent = activeCount;
      completedCountEl.textContent = completedCount;
      totalCountEl.textContent = tasks.length;
    }
  
    function updateClearButtonState() {
      const hasCompleted = tasks.some((t) => t.completed);
      clearCompletedBtn.disabled = !hasCompleted;
    }
  
    // Basic HTML-escaping so task text can never break the markup or inject scripts.
    function escapeHtml(str) {
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
  
    /* ---------------------------------------------------------------------
       Filters
       --------------------------------------------------------------------- */
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
        render();
      });
    });
  
    /* ---------------------------------------------------------------------
       Form + clear-completed events
       --------------------------------------------------------------------- */
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      addTask(input.value);
      input.value = "";
      input.focus();
    });
  
    clearCompletedBtn.addEventListener("click", clearCompleted);
  
    /* ---------------------------------------------------------------------
       Theme (light / dark) — persisted, and defaults to system preference
       --------------------------------------------------------------------- */
    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  
    function initTheme() {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        applyTheme(saved);
        return;
      }
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  
    /* ---------------------------------------------------------------------
       Init
       --------------------------------------------------------------------- */
    initTheme();
    render();
  })();