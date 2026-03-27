# Halo SDK Starter Kit

Tämä on viimeistelty GitHub + Vercel -starter kit, jonka avulla voit rakentaa oman SDK-kerroksen Brilliant Labs Halo -lasien ympärille.

## Mitä paketissa on

- Next.js 15 + TypeScript -pohja
- selkeä `lib/halo-sdk.ts` adapteri
- toimiva UI, jossa on connect / text / arrow / clear -toiminnot
- template-painikkeet nopeaan testaukseen
- Vercel-valmis rakenne
- hyvin erotettu mock-kerros, jotta oikean SDK:n vaihtaminen myöhemmin on helppoa

## Kansiorakenne

```txt
app/
  layout.tsx
  page.tsx
  globals.css
components/
  HaloStudio.tsx
lib/
  halo-sdk.ts
```

## Käynnistys

```bash
npm install
npm run dev
```

Avaa sitten selaimessa paikallinen kehityspalvelin.

## GitHub + Vercel

1. Luo uusi GitHub-repository.
2. Lataa tämän paketin tiedostot sinne.
3. Importtaa repo Verceliin.
4. Deploy.

## Mihin tämä on suunniteltu

Tämä ei sido UI:ta mihinkään tiettyyn laiteimplementaatioon. Kaikki laitekohtainen logiikka on yhdessä adapterissa:

```ts
createHaloAdapter()
```

Kun saat oikean Brilliant-integraation, vaihdat vain adapterin sisällön.

## Suositeltu seuraava askel

Lisää myöhemmin:

- oikea transport-kerros
- autentikointi / pairing
- command queue
- virhetilojen näkyvä käsittely
- erillinen docs-sivu tai API-reference Verceliin

## Huomio

Tämä on alustava kehityspohja. Tarkat laitekohtaiset kutsut kannattaa sitoa Brilliantin viralliseen dokumentaatioon, kun käytössäsi on lopullinen SDK-rajapinta.
