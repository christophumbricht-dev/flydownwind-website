// flydownwind.ch – static site generator (no dependencies): node build.mjs
// Writes plain HTML next to this file, so GitHub Pages needs no build step. English at /, German at /de/.
// Edit the texts below, run the script again, commit the result.
import fs from "node:fs";
import path from "node:path";

const SITE = "https://flydownwind.ch";
const UPDATED = { en: "8 October 2026", de: "8. Oktober 2026" };
const POLICY_VERSION = { en: "0.9 (draft)", de: "0.9 (Entwurf)" };
const MAIL = { hello: "hello@flydownwind.ch", beta: "beta@flydownwind.ch" };
const BETA_LINK = "";   // public TestFlight link, e.g. https://testflight.apple.com/join/XXXXXXXX – empty until the external beta starts

const T = {
  en: {
    nav: { home: "Home", beta: "Beta", support: "Support", privacy: "Privacy" }, other: "Deutsch",
    foot: { nav: "Downwind is not for navigation.", privacy: "Privacy", support: "Support", imprint: "Imprint", made: "Made in Switzerland" },
    skip: "Skip to content",
  },
  de: {
    nav: { home: "Start", beta: "Beta", support: "Hilfe", privacy: "Datenschutz" }, other: "English",
    foot: { nav: "Downwind ist nicht zur Navigation bestimmt.", privacy: "Datenschutz", support: "Hilfe", imprint: "Impressum", made: "Gemacht in der Schweiz" },
    skip: "Zum Inhalt",
  },
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const url = (lang, p) => (lang === "de" ? "/de" : "") + (p ? `/${p}/` : "/");

function layout({ lang, page, title, desc, body, noindex }) {
  const t = T[lang], other = lang === "en" ? "de" : "en", rel = page === "404" ? "" : page;
  const canon = SITE + url(lang, rel);
  const nav = ["", "beta", "support", "privacy"].map(p => `<a href="${url(lang, p)}"${p === page || (p === "" && page === "home") ? ' aria-current="page"' : ""}>${t.nav[p || "home"]}</a>`).join("");
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${canon}">
<link rel="alternate" hreflang="en" href="${SITE + url("en", rel)}">
<link rel="alternate" hreflang="de" href="${SITE + url("de", rel)}">
<link rel="alternate" hreflang="x-default" href="${SITE + url("en", rel)}">`}
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#CFE8FB">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Downwind">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${SITE}/assets/og.png">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body class="${page === "home" ? "is-home" : ""}">
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap"><a class="brand" href="${url(lang, "")}"><img src="/assets/icon.svg" alt="" width="30" height="30">Downwind</a>
<nav class="main" aria-label="Main">${nav}<a class="lang" href="${url(other, rel)}" hreflang="${other}" lang="${other}">${T[other].other === "English" ? "Deutsch" : "English"}</a></nav></div></header>
<main id="main">
${body}
</main>
<footer class="foot"><div class="wrap"><b>${t.foot.nav}</b><a href="${url(lang, "privacy")}">${t.foot.privacy}</a><a href="${url(lang, "support")}">${t.foot.support}</a><a href="${url(lang, "imprint")}">${t.foot.imprint}</a><span>© 2026 Downwind · ${t.foot.made}</span></div></footer>
</body>
</html>
`;
}

/* ---------- pages ---------- */
// Photos: Jürg Umbricht (@exploring_the_skies) – registrations retouched out; credit on every picture
const CREDIT = { en: "Photo: Jürg Umbricht", de: "Foto: Jürg Umbricht" };
const credit = lang => `<a class="credit" href="https://www.instagram.com/exploring_the_skies" rel="noopener">${CREDIT[lang]} · @exploring_the_skies</a>`;
const hero = (lang, t) => `<section class="hero-photo">
  <picture><source media="(max-width: 700px)" srcset="/assets/photos/hero-tall.webp"><img src="/assets/photos/hero-wide.webp" alt="" width="1800" height="1155" fetchpriority="high"></picture>
  <div class="hero-shade"></div>
  <div class="wrap hero-in">
    <div class="hero-brand"><img src="/assets/icon.svg" alt="" width="56" height="56"><span>Fly / Log / Share</span></div>
    <h1>${t.h1}</h1>
    <p class="lead">${t.lead}</p>
    <div class="row"><a class="btn" href="mailto:${MAIL.beta}?subject=Downwind%20beta">${t.cta}</a><a class="btn glass" href="${lang === "de" ? "/de/beta/" : "/beta/"}">${t.how}</a></div>
    <span class="badge glass">${t.soon}</span>
  </div>${credit(lang)}</section>`;
const feature = (lang, img, kicker, title, text, flip) => `<section class="feature${flip ? " flip" : ""}">
  <figure><img src="/assets/photos/${img}.webp" alt="" width="960" height="720" loading="lazy">${credit(lang)}</figure>
  <div class="ft"><div class="kicker">${kicker}</div><h2>${title}</h2><p>${text}</p></div></section>`;
const band = (lang, text) => `<section class="band"><img src="/assets/photos/band.webp" alt="" width="1800" height="838" loading="lazy"><div class="band-shade"></div>
  <div class="wrap band-in"><p>${text}</p></div>${credit(lang)}</section>`;

const home = {
  en: () => ({
    title: "Downwind – Fly / Log / Share", desc: "The social logbook for private pilots: automatic flight recording, your flights on the Swiss national map, logbook and wingmen.",
    body: hero("en", { h1: "Your flights.<br>Your logbook.<br>Your wingmen.", lead: "The social logbook for private pilots. Your phone records the flight – Downwind turns it into a logbook entry and a flight you can share with your wingmen.", cta: "Join the beta", how: "How the beta works", soon: "Coming to the App Store in January 2027" }) +
      `<div class="wrap features">` +
      feature("en", "record", "Auto-record", "Just fly.", "Downwind notices take-off and landing near an airfield and records block times and the track – even with the phone in your pocket. After landing you review and share.") +
      feature("en", "map", "Swiss national map", "Every flight on the map.", "Your tracks on the swisstopo map, in 2D or 3D, with a replay, a short video to share – and GAFOR routes and classics to collect.", true) +
      feature("en", "logbook", "Logbook", "Current and valid at a glance.", "Times, landings, night and PIC as CSV and printable PDF. The 90-day rule, your expiry dates and reminders before they run out.") +
      feature("en", "wingmen", "Wingmen & club", "Share with the people you fly with.", "Flights are visible only to wingmen you confirm. Club page, fly-outs and fly-ins, chat – and friendly collecting, never racing.", true) +
      `</div>` +
      band("en", "Downwind is not for navigation. Plan and fly with official charts, AIP, VAC and NOTAM.") +
      `<div class="wrap"><section class="cta-card"><h2>Fly with us in the beta</h2><p>Want to try Downwind before the launch? Write to <a href="mailto:${MAIL.beta}?subject=Downwind%20beta">${MAIL.beta}</a> or read <a href="/beta/">how the TestFlight beta works</a>.</p></section></div>`,
  }),
  de: () => ({
    title: "Downwind – Fly / Log / Share", desc: "Das soziale Flugbuch für Privatpilotinnen und -piloten: automatische Aufzeichnung, Flüge auf der Landeskarte, Flugbuch und Wingmen.",
    body: hero("de", { h1: "Deine Flüge.<br>Dein Flugbuch.<br>Deine Wingmen.", lead: "Das soziale Flugbuch für Privatpilotinnen und -piloten. Dein Handy zeichnet den Flug auf – Downwind macht daraus einen Flugbucheintrag und einen Flug, den du mit deinen Wingmen teilst.", cta: "Bei der Beta mitmachen", how: "So funktioniert die Beta", soon: "Ab Januar 2027 im App Store" }) +
      `<div class="wrap features">` +
      feature("de", "record", "Automatische Aufzeichnung", "Einfach fliegen.", "Downwind erkennt Start und Landung bei einem Flugplatz und zeichnet Blockzeiten und Track auf – auch mit dem Handy in der Tasche. Nach der Landung prüfen und teilen.") +
      feature("de", "map", "Landeskarte", "Jeder Flug auf der Karte.", "Deine Tracks auf der swisstopo-Karte, in 2D oder 3D, mit Wiedergabe, kurzem Video zum Teilen – und GAFOR-Routen und Klassikern zum Sammeln.", true) +
      feature("de", "logbook", "Flugbuch", "Aktuell und gültig auf einen Blick.", "Zeiten, Landungen, Nacht und PIC als CSV und druckbares PDF. Die 90-Tage-Regel, deine Ablaufdaten und Erinnerungen, bevor etwas abläuft.") +
      feature("de", "wingmen", "Wingmen & Club", "Teilen mit denen, mit denen du fliegst.", "Flüge sehen nur Wingmen, die du bestätigst. Clubseite, Ausflüge und Fly-ins, Chat – und ein bisschen Sammeln, nie Wettrennen.", true) +
      `</div>` +
      band("de", "Downwind ist nicht zur Navigation bestimmt. Plane und fliege mit offiziellen Karten, AIP, VAC und NOTAM.") +
      `<div class="wrap"><section class="cta-card"><h2>Flieg mit in der Beta</h2><p>Möchtest du Downwind vor dem Start ausprobieren? Schreib an <a href="mailto:${MAIL.beta}?subject=Downwind%20Beta">${MAIL.beta}</a> oder lies, <a href="/de/beta/">wie die TestFlight-Beta funktioniert</a>.</p></section></div>`,
  }),
};

const beta = {
  en: () => ({
    title: "Downwind beta – TestFlight", desc: "How to join the Downwind beta on your iPhone with Apple TestFlight.",
    body: `<div class="wrap prose"><h1>Join the beta</h1>
<p>Downwind is tested with <b>TestFlight</b>, Apple's app for beta versions. You need an iPhone with iOS 15 or newer.</p>
<ol>
<li>Install <b>TestFlight</b> from the App Store (free, by Apple).</li>
<li>${BETA_LINK ? `Open the invitation link on your iPhone: <a href="${BETA_LINK}">${BETA_LINK}</a>` : `Tap the invitation link. <span class="muted">(The public link follows when the external beta starts – until then write to <a href="mailto:${MAIL.beta}">${MAIL.beta}</a>.)</span>`}</li>
<li>In TestFlight tap <b>Accept</b> and then <b>Install</b>. Downwind appears on your home screen.</li>
<li>Updates come through TestFlight; turn on automatic updates there.</li>
</ol>
<h2>Feedback</h2>
<ul><li>In Downwind: <b>Settings → Help &amp; legal → Send feedback</b> (text and an optional screenshot).</li>
<li>Or take a screenshot and choose <b>Share Beta Feedback</b> in the share sheet, or open TestFlight → Downwind → <b>Send Beta Feedback</b>.</li>
<li>Or write to <a href="mailto:${MAIL.hello}">${MAIL.hello}</a>.</li></ul>
<div class="note">Beta versions can contain errors. Downwind is not for navigation – please keep your official logbook as well.</div></div>`,
  }),
  de: () => ({
    title: "Downwind Beta – TestFlight", desc: "So machst du mit Apple TestFlight bei der Downwind-Beta mit.",
    body: `<div class="wrap prose"><h1>Bei der Beta mitmachen</h1>
<p>Downwind wird mit <b>TestFlight</b> getestet, Apples App für Beta-Versionen. Du brauchst ein iPhone mit iOS 15 oder neuer.</p>
<ol>
<li>Installiere <b>TestFlight</b> aus dem App Store (gratis, von Apple).</li>
<li>${BETA_LINK ? `Öffne den Einladungslink auf dem iPhone: <a href="${BETA_LINK}">${BETA_LINK}</a>` : `Tippe auf den Einladungslink. <span class="muted">(Der öffentliche Link folgt mit dem Start der externen Beta – bis dahin schreib an <a href="mailto:${MAIL.beta}">${MAIL.beta}</a>.)</span>`}</li>
<li>Tippe in TestFlight auf <b>Annehmen</b> und dann <b>Installieren</b>. Downwind erscheint auf dem Home-Bildschirm.</li>
<li>Updates kommen über TestFlight; schalte dort automatische Updates ein.</li>
</ol>
<h2>Feedback</h2>
<ul><li>In Downwind: <b>Einstellungen → Hilfe &amp; Rechtliches → Feedback senden</b> (Text und optional ein Bildschirmfoto).</li>
<li>Oder ein Bildschirmfoto machen und im Teilen-Menü <b>Beta-Feedback teilen</b> wählen, oder TestFlight → Downwind → <b>Beta-Feedback senden</b>.</li>
<li>Oder schreib an <a href="mailto:${MAIL.hello}">${MAIL.hello}</a>.</li></ul>
<div class="note">Beta-Versionen können Fehler enthalten. Downwind ist nicht zur Navigation bestimmt – führe bitte dein offizielles Flugbuch weiter.</div></div>`,
  }),
};

const faq = (items) => items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("\n");
const support = {
  en: () => ({
    title: "Downwind – Support", desc: "Questions and answers about Downwind: import, auto-record, 90-day rule, deleting your account, reporting content.",
    body: `<div class="wrap prose"><h1>Support</h1>
<p>Questions, problems or ideas: <a href="mailto:${MAIL.hello}">${MAIL.hello}</a> – or in the app under <b>Settings → Help &amp; legal → Send feedback</b>.</p>
<h2>Frequent questions</h2>
${faq([
  ["How do I import flights from ForeFlight or SkyDemon?", "Export the track as GPX (SkyDemon: Logbook → export track; ForeFlight: Track Logs → export GPX or KML) and open it in Downwind under <b>Settings → Data → Import a flight</b>. Garmin, IGC and Flightradar24 CSV work too. Older logbook entries without a track: <b>Settings → Data → Import logbook (CSV)</b>."],
  ["How does auto-record work?", "With location permission <b>Always</b>, Downwind only watches the areas of about 2 km around nearby airfields – it does not use GPS in between. Near an airfield it detects taxiing, take-off and landing and records the track. After landing the flight waits as a <b>private draft</b> until you review and share it. States: <i>off</i>, <i>waiting near airfields</i>, <i>recording</i>, <i>paused until midnight</i>. You can start and stop a recording by hand at any time."],
  ["What does the 90-day rule show?", "Downwind counts your logged landings of the last 90 days (passenger carrying needs 3 take-offs and landings, EASA FCL.060(b)) and shows until when that is met. It is information only – your official logbook and the regulations apply."],
  ["How do I delete my account?", "In the app: <b>Settings → Account → Delete account</b>. Your account, flights, tracks, photos, messages and all other data are deleted at once. Export first if you want to keep anything (<b>Settings → Data</b>: CSV, PDF, GPX, JSON)."],
  ["How do I report content or block a pilot?", "Tap <b>Report</b> on a flight, comment, chat message, review or profile. Moderators look at reports within 24 hours. On a pilot's profile you can also <b>Block pilot</b>."],
  ["Who sees my flights?", "Only confirmed wingmen (both of you agreed), passengers you tagged, or only you – you choose per flight. Start and end of the track can be hidden (500 m)."],
  ["Can I navigate with Downwind?", "<b>No. Downwind is not for navigation.</b> Traffic circuits and airfield data are shown for information and may be wrong or out of date. Use official charts, AIP, VAC and NOTAM."],
])}
</div>`,
  }),
  de: () => ({
    title: "Downwind – Hilfe", desc: "Fragen und Antworten zu Downwind: Import, automatische Aufzeichnung, 90-Tage-Regel, Konto löschen, Inhalte melden.",
    body: `<div class="wrap prose"><h1>Hilfe</h1>
<p>Fragen, Probleme oder Ideen: <a href="mailto:${MAIL.hello}">${MAIL.hello}</a> – oder in der App unter <b>Einstellungen → Hilfe &amp; Rechtliches → Feedback senden</b>.</p>
<h2>Häufige Fragen</h2>
${faq([
  ["Wie importiere ich Flüge aus ForeFlight oder SkyDemon?", "Exportiere den Track als GPX (SkyDemon: Logbook → Track exportieren; ForeFlight: Track Logs → GPX oder KML exportieren) und öffne ihn in Downwind unter <b>Einstellungen → Daten → Flug importieren</b>. Garmin, IGC und Flightradar24-CSV gehen auch. Ältere Flugbucheinträge ohne Track: <b>Einstellungen → Daten → Flugbuch importieren (CSV)</b>."],
  ["Wie funktioniert die automatische Aufzeichnung?", "Mit der Standortfreigabe <b>Immer</b> beobachtet Downwind nur Bereiche von etwa 2 km um nahe Flugplätze – dazwischen wird kein GPS verwendet. Beim Flugplatz erkennt es Rollen, Start und Landung und zeichnet den Track auf. Nach der Landung wartet der Flug als <b>privater Entwurf</b>, bis du ihn prüfst und teilst. Zustände: <i>aus</i>, <i>wartet bei Flugplätzen</i>, <i>zeichnet auf</i>, <i>pausiert bis Mitternacht</i>. Du kannst eine Aufzeichnung jederzeit von Hand starten und stoppen."],
  ["Was zeigt die 90-Tage-Regel?", "Downwind zählt deine erfassten Landungen der letzten 90 Tage (für Passagierflüge braucht es 3 Starts und Landungen, EASA FCL.060(b)) und zeigt, bis wann das erfüllt ist. Nur zur Information – massgebend sind dein offizielles Flugbuch und die Vorschriften."],
  ["Wie lösche ich mein Konto?", "In der App: <b>Einstellungen → Konto → Konto löschen</b>. Konto, Flüge, Tracks, Fotos, Nachrichten und alle anderen Daten werden sofort gelöscht. Exportiere vorher, was du behalten willst (<b>Einstellungen → Daten</b>: CSV, PDF, GPX, JSON)."],
  ["Wie melde ich Inhalte oder blockiere einen Piloten?", "Tippe bei einem Flug, Kommentar, einer Chatnachricht, Bewertung oder einem Profil auf <b>Melden</b>. Moderatoren schauen Meldungen innert 24 Stunden an. Im Profil eines Piloten kannst du ihn auch <b>blockieren</b>."],
  ["Wer sieht meine Flüge?", "Nur bestätigte Wingmen (ihr habt beide zugestimmt), markierte Passagiere oder nur du – du wählst pro Flug. Anfang und Ende des Tracks können ausgeblendet werden (500 m)."],
  ["Kann ich mit Downwind navigieren?", "<b>Nein. Downwind ist nicht zur Navigation bestimmt.</b> Platzrunden und Flugplatzdaten sind zur Information und können falsch oder veraltet sein. Verwende offizielle Karten, AIP, VAC und NOTAM."],
])}
</div>`,
  }),
};

// Impressum. Später ersetzt die GmbH diese Angaben (Firma, Sitz, UID, Handelsregister).
const imprint = {
  en: () => ({
    title: "Downwind – Imprint", desc: "Imprint of flydownwind.ch",
    body: `<div class="wrap prose"><!-- Later the GmbH replaces this (company name, seat, UID/commercial register). --><h1>Imprint</h1>
<p><b>Christoph Umbricht</b><br>Huebacherstrasse 18<br>5417 Untersiggenthal<br>Switzerland</p>
<p>E-mail: <a href="mailto:${MAIL.hello}">${MAIL.hello}</a></p>
<p class="muted">Responsible for the content of this website and the Downwind app. Map data in the app: © swisstopo, © OpenStreetMap contributors / OpenFreeMap.</p></div>`,
  }),
  de: () => ({
    title: "Downwind – Impressum", desc: "Impressum von flydownwind.ch",
    body: `<div class="wrap prose"><!-- Später ersetzt die GmbH diese Angaben (Firma, Sitz, UID/Handelsregister). --><h1>Impressum</h1>
<p><b>Christoph Umbricht</b><br>Huebacherstrasse 18<br>5417 Untersiggenthal<br>Schweiz</p>
<p>E-Mail: <a href="mailto:${MAIL.hello}">${MAIL.hello}</a></p>
<p class="muted">Verantwortlich für den Inhalt dieser Website und der App Downwind. Kartendaten in der App: © swisstopo, © OpenStreetMap-Mitwirkende / OpenFreeMap.</p></div>`,
  }),
};

/* privacy policy – written from what the app really does (code, migrations, Edge Functions, 8 Oct 2026) */
const privacy = {
  en: () => ({
    title: "Downwind – Privacy policy", desc: "How Downwind handles your data (Swiss revDSG and EU GDPR).",
    body: `<div class="wrap prose"><!-- ENTWURF von Claude, keine Rechtsberatung. Vor dem Veröffentlichen rechtlich prüfen lassen (revDSG/DSGVO). -->
<h1>Privacy policy</h1>
<p class="muted">Last updated: ${UPDATED.en} · Version ${POLICY_VERSION.en}</p>
<p>This policy explains which personal data the Downwind app and this website process, why, and what rights you have. It follows the Swiss Federal Act on Data Protection (revDSG/nDSG) and, for users in the EU/EEA, the General Data Protection Regulation (GDPR).</p>

<h2>1. Controller</h2>
<p>Christoph Umbricht, Huebacherstrasse 18, 5417 Untersiggenthal, Switzerland · <a href="mailto:${MAIL.hello}">${MAIL.hello}</a>. Questions about privacy: same address.</p>

<h2>2. Short version</h2>
<ul><li>No ads, no selling of data, no analytics, no tracking, no cookies on this website.</li>
<li>Your flights are visible only to the pilots you confirm as wingmen (or only to you).</li>
<li>Location is used only while a flight is recorded and, with auto-record, to notice that you are near an airfield.</li>
<li>You can export everything and delete your account in the app at any time.</li></ul>

<h2>3. Data we process</h2>
<ul>
<li><b>Account:</b> e-mail address (sign-in link). If you choose Sign in with Apple or Google, the identifier and e-mail address that service gives us.</li>
<li><b>Profile:</b> first name, last name, pilot name, profile photo, home airfield, licences and ratings, language, links to your social profiles, clubs you belong to.</li>
<li><b>Expiry dates</b> of ratings, medical and licences that you enter – private, visible only to you.</li>
<li><b>Flights:</b> date and times (block and flight), airfields, aircraft registration and type, role (e.g. PIC), landings, night time, notes, photos and the GPS track (position, altitude, speed, time).</li>
<li><b>Passengers:</b> pilots you tag as passengers, or first names of guests you enter; souvenir links you create for them (only first names; you can revoke them).</li>
<li><b>Social:</b> wingman requests and connections, likes, comments, chat and club chat messages and photos, fly-out events with answers and comments, airfield reviews, photos and links, aircraft directory entries, badges and collected routes, reports and blocked pilots.</li>
<li><b>Family and live link (optional):</b> people you link as family and positions you share with a live link while you fly.</li>
<li><b>Notifications:</b> a push token of your device and your notification settings.</li>
<li><b>Feedback</b> you send: text, optional screenshot, app version and device type.</li>
<li><b>Error reports:</b> error message, technical details, app version and platform, so we can fix problems.</li>
<li><b>Verification (optional):</b> if you ask to be shown as the official account of an airfield or club, or as a flight instructor: the contact e-mail and message you enter; for instructors also a photo of the licence page with the FI certificate and its expiry date. Only Downwind admins see the request. <b>The photo is deleted as soon as the request is decided.</b> The verified role (e.g. “official account of LSZG”, “FI”) and the date are visible to signed-in pilots. Airfield accounts can send feedback on traffic circuits, optionally with a photo or PDF of the official circuit chart (only admins see it).</li>
</ul>

<h2>4. Location</h2>
<ul>
<li><b>While recording</b> a flight (started by you or automatically), the app uses GPS to record the track – also in the background.</li>
<li><b>Auto-record</b> (optional, permission "Always"): outside airfields Downwind uses no GPS; iOS only tells the app when you enter an area of about 2 km around a nearby airfield (geofence). Near an airfield, GPS detects taxiing, take-off and landing.</li>
<li>After landing, a recorded flight stays a <b>private draft</b> on your phone until you review and share it. You can turn auto-record off or pause it at any time.</li>
</ul>

<h2>5. Who sees what</h2>
<ul>
<li>Flights, tracks, photos and statistics are visible to <b>confirmed wingmen</b> (both agreed), to tagged passengers, or only to you – you choose per flight. You can hide the first and last 500 m of every track.</li>
<li>Pilots who are not your wingmen see your name and profile photo, so they can send you a request. Earned badges and collected routes (not the flights behind them) can be seen by signed-in pilots.</li>
<li>Airfield reviews, airfield photos and aircraft directory entries are visible to all signed-in pilots, with your name. Club members see club content; fly-out events are visible according to the visibility you choose (club, wingmen or public).</li>
<li>A live link or souvenir link can be opened by anyone who has the link, until it ends or you revoke it.</li>
<li>Moderators see reported content to handle reports.</li>
<li><b>Chat messages are not end-to-end encrypted.</b> They are encrypted in transit and stored on our provider's servers; only the members of a chat can read them in the app.</li>
</ul>

<h2>6. Purposes and legal basis</h2>
<p>We process your data to provide the app (logbook, sharing, community features) – GDPR Art. 6(1)(b), contract; to keep the service safe and fix errors (moderation, error reports) – Art. 6(1)(f), legitimate interest; and for optional features such as auto-record, live link, push or ADS-B only with your consent – Art. 6(1)(a), which you can withdraw at any time in the app or in the iPhone settings.</p>

<h2>7. Service providers and third parties</h2>
<ul>
<li><b>Supabase</b> (database, sign-in, file storage, server functions) – servers in the <b>EU (Frankfurt, Germany)</b>. Supabase Inc. is based in the USA; data transfers are covered by the EU standard contractual clauses.</li>
<li><b>Apple</b> – App Store / TestFlight distribution, Apple Push Notification service, Sign in with Apple (if you use it).</li>
<li><b>Google Firebase Cloud Messaging</b> – delivers push notifications to your device (push token and the notification content). Sign in with Google (if offered and you use it).</li>
<li><b>Map tiles:</b> swisstopo (Swiss Federal Office of Topography), OpenFreeMap / OpenStreetMap, terrain data from AWS Open Data. Your device loads map images directly from these services, so they see your IP address and the map area.</li>
<li><b>Weather:</b> aviationweather.gov (NOAA) – queried by our server; only airfield codes are sent, no personal data.</li>
<li><b>ADS-B (optional, off by default):</b> if you turn it on, our server asks adsb.lol for the positions of the aircraft registrations you choose.</li>
<li><b>Links</b> to airfield websites and webcams open in your browser; those sites have their own privacy policies.</li>
<li>The app is built with Codemagic; Codemagic receives no user data.</li>
</ul>
<p>We do not sell personal data and do not share it for advertising.</p>

<h2>8. Retention and deletion</h2>
<ul>
<li>Your data is kept as long as you have an account.</li>
<li><b>Settings → Account → Delete account</b> deletes your account, profile, flights, tracks, photos, messages and all other personal data at once (and revokes Sign in with Apple). Reports and error reports you made remain without a link to you; backups of our provider are overwritten within at most 30 days.</li>
<li><b>Export:</b> Settings → Data – logbook as CSV and PDF, tracks as GPX, all your data as a JSON file.</li>
</ul>

<h2>9. Your rights</h2>
<p>You can request access to your data, correction, deletion, restriction, data portability, and object to processing. Most of it you can do directly in the app; otherwise write to <a href="mailto:${MAIL.hello}">${MAIL.hello}</a>. You can complain to the Swiss Federal Data Protection and Information Commissioner (FDPIC/EDÖB, <a href="https://www.edoeb.admin.ch">edoeb.admin.ch</a>) or to the data protection authority in your EU country.</p>

<h2>10. Children</h2>
<p>Downwind is meant for pilots and passengers aged <b>16 or older</b>.</p>

<h2>11. This website</h2>
<p>flydownwind.ch is a static website hosted by GitHub Pages (GitHub Inc., USA). GitHub processes technical access data (e.g. IP address) to deliver the pages and keep them secure. We use no cookies, no analytics and no external fonts or scripts.</p>

<h2>12. Not for navigation</h2>
<p>Downwind is a logbook and a way to share flights. It is not for navigation and not a flight tracking or alerting service.</p>

<h2>13. Changes</h2>
<p>We update this policy when the app changes and announce important changes in the app. The date at the top shows the current version.</p>
</div>`,
  }),
  de: () => ({
    title: "Downwind – Datenschutzerklärung", desc: "Wie Downwind mit deinen Daten umgeht (revDSG und DSGVO).",
    body: `<div class="wrap prose"><!-- ENTWURF von Claude, keine Rechtsberatung. Vor dem Veröffentlichen rechtlich prüfen lassen (revDSG/DSGVO). -->
<h1>Datenschutzerklärung</h1>
<p class="muted">Stand: ${UPDATED.de} · Version ${POLICY_VERSION.de}</p>
<p>Diese Erklärung zeigt, welche Personendaten die App Downwind und diese Website bearbeiten, wozu, und welche Rechte du hast. Sie richtet sich nach dem Schweizer Datenschutzgesetz (revDSG/nDSG) und für Nutzerinnen und Nutzer in der EU/im EWR nach der Datenschutz-Grundverordnung (DSGVO).</p>

<h2>1. Verantwortlich</h2>
<p>Christoph Umbricht, Huebacherstrasse 18, 5417 Untersiggenthal, Schweiz · <a href="mailto:${MAIL.hello}">${MAIL.hello}</a>. Fragen zum Datenschutz: gleiche Adresse.</p>

<h2>2. Kurz gesagt</h2>
<ul><li>Keine Werbung, kein Verkauf von Daten, keine Analyse, kein Tracking, keine Cookies auf dieser Website.</li>
<li>Deine Flüge sehen nur die Piloten, die du als Wingmen bestätigst (oder nur du).</li>
<li>Der Standort wird nur während der Aufzeichnung eines Flugs verwendet und – mit automatischer Aufzeichnung – um zu merken, dass du bei einem Flugplatz bist.</li>
<li>Du kannst jederzeit alles exportieren und dein Konto in der App löschen.</li></ul>

<h2>3. Welche Daten wir bearbeiten</h2>
<ul>
<li><b>Konto:</b> E-Mail-Adresse (Anmeldelink). Wenn du «Mit Apple anmelden» oder Google wählst, die Kennung und E-Mail-Adresse, die uns dieser Dienst übermittelt.</li>
<li><b>Profil:</b> Vorname, Nachname, Pilotenname, Profilbild, Heimatflugplatz, Lizenzen und Berechtigungen, Sprache, Links zu deinen Social-Media-Profilen, Clubs.</li>
<li><b>Ablaufdaten</b> von Berechtigungen, Medical und Lizenzen, die du eingibst – privat, nur für dich sichtbar.</li>
<li><b>Flüge:</b> Datum und Zeiten (Block- und Flugzeit), Flugplätze, Kennzeichen und Typ des Flugzeugs, Funktion (z. B. PIC), Landungen, Nachtzeit, Notizen, Fotos und der GPS-Track (Position, Höhe, Geschwindigkeit, Zeit).</li>
<li><b>Passagiere:</b> Piloten, die du als Passagiere markierst, oder Vornamen von Gästen, die du eingibst; Erinnerungs-Links, die du für sie erstellst (nur Vornamen, widerrufbar).</li>
<li><b>Community:</b> Wingman-Anfragen und -Verbindungen, Likes, Kommentare, Chat- und Club-Chat-Nachrichten und -Fotos, Ausflüge mit Zusagen und Kommentaren, Flugplatz-Bewertungen, -Fotos und -Links, Einträge im Flugzeugverzeichnis, Abzeichen und gesammelte Routen, Meldungen und blockierte Piloten.</li>
<li><b>Familie und Live-Link (freiwillig):</b> Personen, die du als Familie verknüpfst, und Positionen, die du während des Flugs mit einem Live-Link teilst.</li>
<li><b>Mitteilungen:</b> ein Push-Token deines Geräts und deine Einstellungen für Mitteilungen.</li>
<li><b>Feedback</b>, das du sendest: Text, optional ein Bildschirmfoto, App-Version und Gerätetyp.</li>
<li><b>Fehlerberichte:</b> Fehlermeldung, technische Angaben, App-Version und Plattform, damit wir Fehler beheben können.</li>
<li><b>Verifizierung (freiwillig):</b> Wenn du als offizielles Konto eines Flugplatzes oder Clubs oder als Fluglehrer angezeigt werden möchtest: die Kontakt-E-Mail und Nachricht, die du eingibst; bei Fluglehrern zusätzlich ein Foto der Lizenzseite mit der FI-Berechtigung und deren Ablaufdatum. Die Anfrage sehen nur die Downwind-Admins. <b>Das Foto wird gelöscht, sobald über die Anfrage entschieden ist.</b> Die bestätigte Rolle (z. B. «offizielles Konto von LSZG», «FI») und das Datum sehen angemeldete Piloten. Flugplatzkonten können Rückmeldungen zu Platzrunden senden, optional mit Foto oder PDF des offiziellen Platzrundenplans (nur für Admins sichtbar).</li>
</ul>

<h2>4. Standort</h2>
<ul>
<li><b>Während der Aufzeichnung</b> eines Flugs (von dir oder automatisch gestartet) verwendet die App GPS für den Track – auch im Hintergrund.</li>
<li><b>Automatische Aufzeichnung</b> (freiwillig, Freigabe «Immer»): Ausserhalb von Flugplätzen verwendet Downwind kein GPS; iOS meldet der App nur, wenn du einen Bereich von etwa 2 km um einen nahen Flugplatz betrittst (Geofence). Beim Flugplatz erkennt GPS Rollen, Start und Landung.</li>
<li>Nach der Landung bleibt ein aufgezeichneter Flug ein <b>privater Entwurf</b> auf deinem Handy, bis du ihn prüfst und teilst. Du kannst die automatische Aufzeichnung jederzeit ausschalten oder pausieren.</li>
</ul>

<h2>5. Wer was sieht</h2>
<ul>
<li>Flüge, Tracks, Fotos und Statistiken sehen <b>bestätigte Wingmen</b> (beide haben zugestimmt), markierte Passagiere oder nur du – du wählst pro Flug. Die ersten und letzten 500 m jedes Tracks kannst du ausblenden.</li>
<li>Piloten, die nicht deine Wingmen sind, sehen deinen Namen und dein Profilbild, damit sie dir eine Anfrage schicken können. Erreichte Abzeichen und gesammelte Routen (nicht die Flüge dahinter) können angemeldete Piloten sehen.</li>
<li>Flugplatz-Bewertungen, -Fotos und Einträge im Flugzeugverzeichnis sehen alle angemeldeten Piloten, mit deinem Namen. Clubmitglieder sehen die Inhalte des Clubs; Ausflüge sind so sichtbar, wie du es wählst (Club, Wingmen oder öffentlich).</li>
<li>Einen Live-Link oder Erinnerungs-Link kann öffnen, wer den Link hat – bis er endet oder du ihn widerrufst.</li>
<li>Moderatoren sehen gemeldete Inhalte, um Meldungen zu bearbeiten.</li>
<li><b>Chatnachrichten sind nicht Ende-zu-Ende-verschlüsselt.</b> Sie werden verschlüsselt übertragen und auf den Servern unseres Anbieters gespeichert; lesen können sie in der App nur die Mitglieder eines Chats.</li>
</ul>

<h2>6. Zwecke und Rechtsgrundlagen</h2>
<p>Wir bearbeiten deine Daten, um die App bereitzustellen (Flugbuch, Teilen, Community) – DSGVO Art. 6 Abs. 1 lit. b, Vertrag; um den Dienst sicher zu halten und Fehler zu beheben (Moderation, Fehlerberichte) – Art. 6 Abs. 1 lit. f, berechtigtes Interesse; und für freiwillige Funktionen wie automatische Aufzeichnung, Live-Link, Push oder ADS-B nur mit deiner Einwilligung – Art. 6 Abs. 1 lit. a, die du jederzeit in der App oder in den iPhone-Einstellungen widerrufen kannst.</p>

<h2>7. Dienstleister und Dritte</h2>
<ul>
<li><b>Supabase</b> (Datenbank, Anmeldung, Dateispeicher, Serverfunktionen) – Server in der <b>EU (Frankfurt, Deutschland)</b>. Supabase Inc. hat ihren Sitz in den USA; Übermittlungen sind durch die EU-Standardvertragsklauseln abgesichert.</li>
<li><b>Apple</b> – Verteilung über App Store / TestFlight, Apple Push Notification service, «Mit Apple anmelden» (wenn du es nutzt).</li>
<li><b>Google Firebase Cloud Messaging</b> – stellt Push-Mitteilungen auf dein Gerät zu (Push-Token und Inhalt der Mitteilung). Anmeldung mit Google (wenn angeboten und von dir genutzt).</li>
<li><b>Kartenkacheln:</b> swisstopo (Bundesamt für Landestopografie), OpenFreeMap / OpenStreetMap, Geländedaten von AWS Open Data. Dein Gerät lädt die Kartenbilder direkt bei diesen Diensten; sie sehen deine IP-Adresse und den Kartenausschnitt.</li>
<li><b>Wetter:</b> aviationweather.gov (NOAA) – Abfrage durch unseren Server; es werden nur Flugplatz-Codes übermittelt, keine Personendaten.</li>
<li><b>ADS-B (freiwillig, standardmässig aus):</b> Wenn du es einschaltest, fragt unser Server bei adsb.lol die Positionen der von dir gewählten Kennzeichen ab.</li>
<li><b>Links</b> zu Flugplatz-Websites und Webcams öffnen sich in deinem Browser; dort gelten deren Datenschutzerklärungen.</li>
<li>Die App wird mit Codemagic gebaut; Codemagic erhält keine Nutzerdaten.</li>
</ul>
<p>Wir verkaufen keine Personendaten und geben sie nicht für Werbung weiter.</p>

<h2>8. Aufbewahrung und Löschung</h2>
<ul>
<li>Deine Daten bleiben gespeichert, solange du ein Konto hast.</li>
<li><b>Einstellungen → Konto → Konto löschen</b> löscht Konto, Profil, Flüge, Tracks, Fotos, Nachrichten und alle anderen Personendaten sofort (und widerruft «Mit Apple anmelden»). Deine Meldungen und Fehlerberichte bleiben ohne Verbindung zu dir; Sicherungskopien unseres Anbieters werden innert höchstens 30 Tagen überschrieben.</li>
<li><b>Export:</b> Einstellungen → Daten – Flugbuch als CSV und PDF, Tracks als GPX, alle deine Daten als JSON-Datei.</li>
</ul>

<h2>9. Deine Rechte</h2>
<p>Du kannst Auskunft über deine Daten, Berichtigung, Löschung, Einschränkung und Datenherausgabe verlangen und der Bearbeitung widersprechen. Das meiste geht direkt in der App; sonst schreib an <a href="mailto:${MAIL.hello}">${MAIL.hello}</a>. Du kannst dich beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB, <a href="https://www.edoeb.admin.ch">edoeb.admin.ch</a>) oder bei der Datenschutzbehörde deines EU-Landes beschweren.</p>

<h2>10. Kinder</h2>
<p>Downwind ist für Piloten und Passagiere ab <b>16 Jahren</b> gedacht.</p>

<h2>11. Diese Website</h2>
<p>flydownwind.ch ist eine statische Website bei GitHub Pages (GitHub Inc., USA). GitHub bearbeitet technische Zugriffsdaten (z. B. IP-Adresse), um die Seiten auszuliefern und sicher zu halten. Wir verwenden keine Cookies, keine Analyse und keine externen Schriften oder Skripte.</p>

<h2>12. Nicht zur Navigation</h2>
<p>Downwind ist ein Flugbuch und eine Möglichkeit, Flüge zu teilen. Es ist nicht zur Navigation bestimmt und kein Dienst zur Flugverfolgung oder Alarmierung.</p>

<h2>13. Änderungen</h2>
<p>Wir passen diese Erklärung an, wenn sich die App ändert, und kündigen wichtige Änderungen in der App an. Das Datum oben zeigt den aktuellen Stand.</p>
</div>`,
  }),
};

const notFound = {
  en: () => ({ title: "Page not found – Downwind", desc: "Page not found", body: `<div class="wrap prose"><h1>Page not found</h1><p>This page does not exist (any more). <a href="/">Back to the start page</a> · <a href="/de/">Zur deutschen Startseite</a></p></div>` }),
};

/* ---------- write ---------- */
const ROOT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const out = (rel, html) => { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); };
const PAGES = { home, beta, support, privacy, imprint };
const urls = [];
for (const lang of ["en", "de"]) for (const [name, p] of Object.entries(PAGES)) {
  const slug = name === "home" ? "" : name, c = p[lang]();
  out(path.join(lang === "de" ? "de" : "", slug, "index.html"), layout({ lang, page: name === "home" ? "home" : name, ...c }));
  urls.push(SITE + url(lang, slug));
}
out("404.html", layout({ lang: "en", page: "404", noindex: true, ...notFound.en() }));
out("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
out("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
out("CNAME", "flydownwind.ch\n");
out(".nojekyll", "");
console.log(`written: ${urls.length} pages + 404, robots.txt, sitemap.xml, CNAME`);
