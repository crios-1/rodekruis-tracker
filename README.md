# Rode Kruis Inzetkaart

React + Vite front-end voor een inzetoverzicht, gekoppeld aan Firebase-project `rodekruistracker`. De bijbehorende Firebase webapp is geregistreerd. De lokale `.env.local` is al aangemaakt en genegeerd door Git.

## Lokaal starten

1. Installeer Node.js 20.19+ of 22.12+.
2. Voer `npm install` uit.
3. Zet Google als provider aan in Firebase Authentication.
4. Voer `npm run dev` uit.

Zonder `.env.local` blijft de site in demo-modus. Demo-interventies worden niet naar Firebase opgeslagen. De Firestore-database moet nog aangemaakt worden; de vaste regio wordt na keuze ingesteld.

## Firebase-data

Maak in Firestore de collecties `responders` en `interventions`. Een hulpverlenerdocument bevat bijvoorbeeld `name`, `initials`, `location` en `status`. Een interventiedocument bevat `title`, `place`, `team`, `status`, `createdBy`, `createdAt` en `updatedAt`.

De frontend en de meegeleverde `firestore.rules` vereisen een custom auth claim `dispatcher: true`. Ken die claim uitsluitend toe via vertrouwde serveromgeving / Firebase Admin SDK. Publiceer de regels in Firebase Console voordat je echte data gebruikt. Firebase webconfiguratie identificeert het project maar is geen autorisatie; Firestore-regels blijven verplicht.

## Locatiegegevens

Deze demo verstuurt geen GPS-coördinaten. De kaart is schematisch en bevat voorbeeldlocaties. Voor operationeel gebruik is een aparte mobiele app of goedgekeurde locatiebron nodig, met zichtbare actieve-shift status, beperkte toegang, bewaartermijn en expliciete organisatie-afspraken. Bluetooth item-trackers zijn geen live personeelsvolgsysteem.
