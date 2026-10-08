/* Beta sign-up dialog: buttons with [data-signup] open it (their mailto: href is the fallback without JavaScript).
   Sends the form to the Supabase function beta_signup() – nothing is sent before "Sign up". No cookies, no tracking. */
(() => {
  const dlg = document.getElementById("signup");
  if (!dlg || typeof dlg.showModal !== "function") return;   // old browsers keep the mailto links
  const form = dlg.querySelector("form"), err = dlg.querySelector(".signup-err"), btn = form.querySelector('button[type="submit"]');
  const label = btn.textContent;
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-signup]"); if (!a) return;
    e.preventDefault(); dlg.showModal(); setTimeout(() => form.first.focus(), 50);
  });
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });   // tap outside closes
  const mail = '<a href="mailto:hello@flydownwind.ch">hello@flydownwind.ch</a>.';
  const fail = busy => { err.innerHTML = (busy ? err.dataset.busy : err.dataset.err) + " " + mail; err.hidden = false; };
  form.addEventListener("submit", async e => {
    if (e.submitter && e.submitter.value === "cancel") return;
    e.preventDefault(); err.hidden = true;
    if (!form.reportValidity()) return;
    if (form.website.value) { done(); return; }   // honeypot: bots fill every field
    btn.disabled = true; btn.textContent = btn.dataset.sending;
    try {
      const r = await fetch(dlg.dataset.url + "/rest/v1/rpc/beta_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: dlg.dataset.key, Authorization: "Bearer " + dlg.dataset.key },
        body: JSON.stringify({ p_first: form.first.value.trim(), p_last: form.last.value.trim(), p_email: form.email.value.trim(),
          p_source: form.source.value, p_note: form.note.value.trim(), p_lang: dlg.dataset.lang })
      });
      if (r.ok) {
        const id = await r.json().catch(() => null);   // tell the Downwind team (push to the admins, once per sign-up)
        if (typeof id === "string") fetch(dlg.dataset.url + "/functions/v1/push", { method: "POST", keepalive: true,
          headers: { "Content-Type": "application/json", apikey: dlg.dataset.key, Authorization: "Bearer " + dlg.dataset.key },
          body: JSON.stringify({ beta_signup: id }) }).catch(() => {});
        done();
      } else { const j = await r.json().catch(() => ({})); fail(j.code === "54000"); }
    } catch { fail(false); }
    btn.disabled = false; btn.textContent = label;
  });
  function done() { form.querySelector(".signup-body").hidden = true; form.querySelector(".signup-ok").hidden = false; form.reset(); }
  dlg.addEventListener("close", () => { form.querySelector(".signup-body").hidden = false; form.querySelector(".signup-ok").hidden = true; err.hidden = true; });
})();
