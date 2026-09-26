# Rode Kruis Inzetkaart

React + Vite front-end voor een inzetoverzicht, gekoppeld aan Firebase-project `rodekruistracker`. De bijbehorende Firebase webapp is geregistreerd. De lokale `.env.local` is al aangemaakt en genegeerd door Git.

## Lokaal starten

1. Installeer Node.js 20.19+ of 22.12+.
2. Voer `npm install` uit.
3. Installeer de testbrowser met `npx playwright install chromium`.
4. Zet Google als provider aan in Firebase Authentication.
5. Voer `npm run dev` uit.

Zonder `.env.local` blijft de site in demo-modus. Demo-interventies worden niet naar Firebase opgeslagen. De Firestore-database is aangemaakt in `europe-west1` en de regels zijn naar het project gepubliceerd.

## Automatische UI-tests

Playwright controleert de dashboard-, interventie-, zoek-, statusfilter-, detail- en registratiestromen in desktop Chromium en mobiel Chromium.

- `npm run test:e2e` voert de end-to-endtests uit.
- `npm run test:ui` opent Playwright UI Mode om acties, screenshots en fouten visueel te bekijken.
- Elke test voegt een screenshot toe aan het HTML-rapport. Lokale resultaten staan onder `test-results/`; open het rapport met `npx playwright show-report`.
- GitHub Actions voert tests uit op pushes naar `main` en pull requests en bewaart de rapporten/screenshots 30 dagen.
- Firebase Hosting voert de tests en productiebuild uit vóór elke hosting-deploy.

Verander visuele verwachtingen door de screenshots in het rapport te bekijken. Dit project bewaart uitvoerscreenshots bij elke run en gebruikt ze als visuele review-artifacts.

## Firebase-data

Voeg documenten toe aan de Firestore-collecties `responders` en `interventions`. Een hulpverlenerdocument bevat bijvoorbeeld `name`, `initials`, `location` en `status`. Een interventiedocument bevat `title`, `place`, `team`, `status`, `createdBy`, `createdAt` en `updatedAt`.

De frontend en de gepubliceerde `firestore.rules` vereisen een custom auth claim `dispatcher: true`. Ken die claim uitsluitend toe via een vertrouwde serveromgeving / Firebase Admin SDK. Schakel Google als provider in Firebase Authentication in. Firebase webconfiguratie identificeert het project maar is geen autorisatie; Firestore-regels blijven verplicht.

## Locatiegegevens

Deze demo verstuurt geen GPS-coördinaten. De kaart is schematisch en bevat voorbeeldlocaties. Voor operationeel gebruik is een aparte mobiele app of goedgekeurde locatiebron nodig, met zichtbare actieve-shift status, beperkte toegang, bewaartermijn en expliciete organisatie-afspraken. Bluetooth item-trackers zijn geen live personeelsvolgsysteem.
