// Website photos by Jürg Umbricht (@exploring_the_skies), registrations retouched out in the app repo
// (node scripts/retouch-photos.cjs <dir> there). Usage: SHARP=<path to sharp> node tools/photos.cjs <dir with retouched JPEGs>
// Writes assets/photos/*.webp: a wide hero, a tall hero for phones and 4:3 feature pictures.
const fs = require("fs"), path = require("path");
const sharp = require(process.env.SHARP || "sharp");
const src = process.argv[2], out = path.join(__dirname, "../assets/photos");
if (!src) { console.error("usage: node tools/photos.cjs <dir>"); process.exit(1); }
fs.mkdirSync(out, { recursive: true });
const S = n => path.join(src, n);
const jobs = [
  // hero: yellow high-wing on the grass strip, lots of sky for the headline
  ["02-hb-yiw-graspiste.jpg", "hero-wide.webp", { left: 0, top: 820, width: 1932, height: 1240 }, [1800, 1155]],
  ["02-hb-yiw-graspiste.jpg", "hero-tall.webp", { left: 120, top: 220, width: 1700, height: 2240 }, [900, 1186]],
  ["01-propeller-front.jpg", "record.webp", { left: 0, top: 380, width: 1932, height: 1449 }, [960, 720]],
  ["03-seeland-st-petersinsel.jpg", "map.webp", { left: 0, top: 120, width: 1932, height: 1449 }, [960, 720]],
  ["05-cockpit-alpen.jpg", "logbook.webp", { left: 0, top: 700, width: 1932, height: 1449 }, [960, 720]],
  ["04-experimental-pilatus-porter.jpg", "wingmen.webp", { left: 0, top: 820, width: 1932, height: 1449 }, [960, 720]],
  ["05-cockpit-alpen.jpg", "band.webp", { left: 0, top: 900, width: 1932, height: 900 }, [1800, 838]],
];
(async () => {
  for (const [file, name, crop, [w, h]] of jobs) {
    const i = await sharp(S(file)).extract(crop).resize(w, h, { fit: "cover" }).webp({ quality: 70, effort: 6 }).toFile(path.join(out, name));
    console.log(name, w + "×" + h, Math.round(i.size / 1024) + " KB");
  }
})();
