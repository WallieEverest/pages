# iPhone Web App: Boating

A home-screen app for iPhone, hosted free on GitHub Pages at **https://wallieeverest.github.io/pages/**. No App Store, no build step, no API keys.

- **Boating**: local wind, weather and the National Weather Service marine forecast for your ZIP code.

The **Slideshow** and **Manager** apps were removed on 12 November 2026 (see **Removed apps** below).

```
index.html                      launcher page ("My Apps") linking the app; manifest.json, icons/
weather/                        Boating app (Open-Meteo + National Weather Service data)
slideshow/, manager/            "removed" pages that clear the old apps from devices (see Removed apps)
```

The app has its own `manifest.json`, service worker and icon, so it becomes its own icon on the home screen. **Boating** opens full screen. **My Apps** opens in Safari, as a normal page.

Boating shows its version number at the bottom of the page; My Apps shows its own in its footer and Boating's on the app card.

## 1. Publish to GitHub Pages

1. Create a new **public** repository on GitHub, e.g. `pages` (all lowercase: the name becomes part of the URL, which is case-sensitive).
2. Upload the contents of this folder (keep the folder structure).
   On github.com: **Add file → Upload files**, drag everything in, commit.
3. **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, folder `/ (root)`. Save.
4. After about a minute the site is live at `https://wallieeverest.github.io/pages/`.

## 2. Install on iPhone

Type addresses exactly as shown: they are case-sensitive (`pages` and `weather` are lowercase).

**Boating**

1. In **Safari**, open `https://wallieeverest.github.io/pages/weather/`.
2. Type your ZIP code in the search box. The app uses it to find your marine forecast zone. It never asks for your location.
3. Tap **Share → Add to Home Screen**. The recommended name is **Boating** (it is filled in for you).
4. Keep **Open as Web App** on and tap **Add**.

**My Apps** (optional: the launcher page)

1. In **Safari**, open `https://wallieeverest.github.io/pages/`.
2. Tap **Share → Add to Home Screen**, turn **Open as Web App** **off**, and tap **Add**.

An icon keeps the mode it was added with. To change it, delete the icon and add it again.

Open the app once while online so it can save itself for offline use.

If you had an older home-screen icon (for example one named *Weather*, or one added from an address with a capital *P*), delete it and add the app again from the address above.

## Boating

**What it shows**, top to bottom:

- **Now:** temperature and conditions for your ZIP code.
- **Hourly** (next 24 hours): conditions, chance of rain, temperature, and **wind**: the arrow points the way the wind is blowing, with the direction it comes from (N, NE, …), speed in knots, and gusts (*G18* = gusts to 18 kt).
- **7-Day Forecast**: daily lows and highs. The bar colors run from blue at the week's lowest temperature to red at its highest.
- **Wind** (speed, direction and gusts), feels-like temperature, humidity, UV index, sunrise and sunset.
- **Marine Forecast** from the National Weather Service, at the bottom because it takes longest to load (it says *Loading marine forecast…* until it arrives):
  - **Alerts** for your marine zone and area, such as Small Craft Advisories, Gale Warnings, Special Marine Warnings, High Surf and Rip Currents. Tap one for the full details. The stripe color shows severity: red (severe), orange (moderate), yellow (minor).
  - **Zone forecast**: the official wind, seas and wave forecast for the next few days. The marine zone is picked automatically: the zone you are in, or from shore the nearest one within about 50 km.
  - **Boating briefings**: the local NWS office's graphics about boating, wind and waves, when it has posted any. Swipe for more; tap one to see it full size.

**Controls**

- **ZIP code** (top left): type a 5-digit US ZIP code, such as *32931*. It searches as soon as you type the fifth digit (or tap **Go**). Enter a new one when you move to a different area.
- **°F/°C** changes temperature units. Wind is always in knots.
- Tap the **Marine Forecast** heading to open the full forecast on weather.gov.

**Good to know**

- Marine forecasts cover US coastal waters and the Great Lakes. Elsewhere, the app shows the weather and wind only.
- Everything is saved on the phone and shown instantly when you open the app, even with no signal on the water. It refreshes when you open the app if the saved copy is older than 10 minutes. On a weak signal the app gives up waiting after a few seconds, keeps showing the saved copy, and tries again by itself (the line under the temperature shows *Updating…* or *retrying*, and how old the data is). It also refreshes every 10 minutes while left open. Check the **Updated** and **issued** times before relying on it.
- This app is a convenience, not a navigation or safety device. Always check official forecasts and NOAA Weather Radio before going out.
- Weather data: [Open-Meteo](https://open-meteo.com) (free, non-commercial use). Marine forecasts, alerts and briefings: [National Weather Service](https://www.weather.gov/marine/). Place names from ZIP codes: Open-Meteo.

## Removed apps

The **Slideshow** (photo player and iPad kiosk) and the **Manager** (added, captioned and encrypted its photos) were removed on 12 November 2026, together with the encrypted photos, the photo tools and the photo-list workflow. The photos were also removed from the repository's history.

- **Devices that had them:** open the old Slideshow or Manager icon once. It shows "This app has been removed" and clears what it saved on that device: settings, the remembered passphrase, the GitHub token and the saved photos. A slideshow left running does this by itself within about a minute. Then delete the icon (touch and hold it, **Remove App**). Boating's saved ZIP code and forecast are kept.
- **GitHub token:** delete the Manager's token on github.com (**Settings → Developer settings → Fine-grained tokens**).
- **The code** is still in the git history before 12 November 2026 (without the photos), if it's ever wanted again.

## Updating the app

iPhone caches the app. After changing Boating's code (`weather/index.html`, `weather/sw.js`), bump `VERSION` at the top of `weather/sw.js` (now `weather-v11`; increase the number). The number shows in the app, so you can check a device has the latest. The launcher (`index.html`) has no service worker; bump `VERSION` in its script (`my-apps-v3`) when you change it. Then close and reopen the app on your phone, twice if needed.

## Limitations (iOS web apps)

- No home-screen widgets and no background refresh; data updates when you open the app.
- Storage for a site can be cleared by iOS if the app goes unused for a long time; it simply re-downloads.
