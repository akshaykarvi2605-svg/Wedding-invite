# Akshay & Yashada

The invitation is published at <https://akshaykarvi2605-svg.github.io/Wedding-invite/>. GitHub Pages serves the static files from the root of the main branch. The recoverable previous edition is on the branch `backup/pre-atelier-f8e49f3`.

## Guest blessings

The form sends the guest’s name, blessing and a randomly generated receipt over HTTPS to the separate **Akshay & Yashada Wedding Blessings** service. It confirms delivery only after the database acknowledges a write. Identical submission retries reuse the receipt. A failed submission keeps the guest’s text in the form so they can retry.

The owner can review the `blessings` table in the service’s D1 database, or ask ChatGPT to read the wedding blessings. Only the submission endpoint is public. There is no public guestbook feed. The entry named “Invitation delivery check” is a delivery test.

## Invitation assets

All visual layers, the original instrumental and fonts are hosted with the invitation. Asset and font credits are in `assets/CREDITS.txt`. The courtyard and door are artistic scenery. The address and Google Maps link identify the actual wedding venue.

The calendar file records 28 February 2027 at 06:44 UTC, equivalent to 12:14 PM IST. The countdown uses the same instant.
