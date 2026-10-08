// Open Graph image (1200 × 630) for link previews: node tools/og.cjs (needs sharp, e.g. from the app repo's node_modules)
const fs = require("fs"), path = require("path");
const sharp = require(process.env.SHARP || "sharp");
const root = path.join(__dirname, "..");
const icon = fs.readFileSync(path.join(root, "assets/icon.svg"), "utf8").replace(/^<\?xml[^>]*>/, "");
const inner = icon.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE8FB"/><stop offset="1" stop-color="#F7FBFE"/></linearGradient>
<clipPath id="r"><rect x="0" y="0" width="1024" height="1024" rx="230"/></clipPath></defs>
<rect width="1200" height="630" fill="url(#g)"/>
<g transform="translate(96 175) scale(0.27)"><g clip-path="url(#r)">${inner}</g></g>
<text x="420" y="300" font-family="Arial Narrow, Arial, Helvetica, sans-serif" font-weight="700" font-size="128" fill="#12243D">Downwind</text>
<text x="424" y="370" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="40" letter-spacing="4" fill="#1673BD">FLY / LOG / SHARE</text>
<text x="424" y="440" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#5E7390">The social logbook for private pilots</text>
<text x="96" y="575" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#5E7390">flydownwind.ch · Downwind is not for navigation.</text>
</svg>`;
sharp(Buffer.from(svg)).png().toFile(path.join(root, "assets/og.png")).then(i => console.log("assets/og.png", i.width + "×" + i.height));
