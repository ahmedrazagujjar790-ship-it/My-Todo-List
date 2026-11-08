var KEY = "todo-sample-tasks", tasks = [], editing = null;

try { tasks = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { tasks = []; }

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch (e) {}
}

function el(t, props, kids) {
  var n = document.createElement(t);
  Object.assign(n, props || {});
  (kids || []).forEach(function (k) { n.append(k); });
  return n;
}

function render() {
  var ul = document.getElementById("list");
  ul.innerHTML = "";

  if (!tasks.length) {
    ul.append(el("li", { className: "empty" }, ["No tasks yet. Type one above and press Add task."]));
  }

  tasks.forEach(function (t) {
    var li = el("li", { className: t.done ? "done" : "" });

    var cb = el("input", { type: "checkbox", checked: t.done });
    cb.setAttribute("aria-label", "Mark done");
    cb.onchange = function () { t.done = cb.checked; save(); render(); };
    li.append(cb);

    if (editing === t.id) {
      var inp = el("input", { type: "text", value: t.text });
      var ok = el("button", { className: "primary", textContent: "Save changes" });
      var commit = function () {
        var v = inp.value.trim();
        if (v) t.text = v;
        editing = null; save(); render();
      };
      ok.onclick = commit;
      inp.onkeydown = function (e) {
        if (e.key === "Enter") commit();
        if (e.key === "Escape") { editing = null; render(); }
      };
      li.append(inp, ok);
      setTimeout(function () { inp.focus(); }, 0);
    } else {
      var ed = el("button", { textContent: "Edit" });
      ed.onclick = function () { editing = t.id; render(); };
      var rm = el("button", { className: "del", textContent: "Delete" });
      rm.onclick = function () {
        tasks = tasks.filter(function (x) { return x.id !== t.id; });
        save(); render();
      };
      li.append(el("span", { textContent: t.text }), ed, rm);
    }
    ul.append(li);
  });

  var left = tasks.filter(function (t) { return !t.done; }).length;
  document.getElementById("count").textContent =
    tasks.length ? left + " of " + tasks.length + " tasks left" : "";
}

function add() {
  var i = document.getElementById("new"), v = i.value.trim();
  if (!v) return;
  tasks.push({ id: Date.now(), text: v, done: false });
  i.value = "";
  save(); render();
}

document.getElementById("addBtn").onclick = add;
document.getElementById("new").onkeydown = function (e) { if (e.key === "Enter") add(); };

render();