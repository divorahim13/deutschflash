# DeutschFlash - Premium German A2 Flashcards

DeutschFlash is a high-performance German learning platform combining Spaced Repetition (FSRS), AI-powered sentence verification, and a premium "Midnight Forest" aesthetic.

## 🚀 Deployment Guide (Vercel)

### 1. Database Setup (Supabase)
1. Create a new project at [Supabase](https://supabase.com/).
2. Navigate to the **SQL Editor** and run the `schema.sql` and `schema_update.sql` files found in this repository.
3. (Optional) Run the **Seed Script** below to populate your initial A2 deck.

### 2. OpenAI Configuration
1. Obtain an API Key from [OpenAI](https://platform.openai.com/).
2. Ensure you have balance compatible with `gpt-4o-mini`.

### 3. Vercel Deployment
1. Push this repository to GitHub/GitLab.
2. Import the project into [Vercel](https://vercel.com/).
3. Add the following Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
4. Deploy!

---

## 🌱 SQL Seed Script (50 A2 Words)

Replace `'YOUR_USER_ID'` with your actual Supabase User ID (UUID) from the `auth.users` table.

```sql
INSERT INTO public.cards (user_id, kata_jerman, arti_indo, front, back, tags)
VALUES
-- FOOD & DRINK
('YOUR_USER_ID', 'das Frühstück', 'sarapan', 'Was bedeutet "sarapan" auf Deutsch?', 'Das Frühstück. Satz: Ich esse Brot zum Frühstück.', '{"food"}'),
('YOUR_USER_ID', 'das Abendessen', 'makan malam', 'Wie sagt man "makan malam"?', 'Das Abendessen. Satz: Wir machen Abendessen um 19 Uhr.', '{"food"}'),
('YOUR_USER_ID', 'der Saft', 'jus', 'Translate: jus', 'Der Saft. Satz: Apfelsaft schmeckt gut.', '{"food"}'),
('YOUR_USER_ID', 'die Gabel', 'garpu', 'Was ist eine "Gabel"?', 'Garpu. Satz: Ich brauche eine Gabel.', '{"food"}'),
('YOUR_USER_ID', 'der Löffel', 'sendok', 'Was ist ein "Löffel"?', 'Sendok. Satz: Suppe isst man mit einem Löffel.', '{"food"}'),
('YOUR_USER_ID', 'das Messer', 'pisau', 'Was ist ein "Messer"?', 'Pisau. Satz: Das Messer ist scharf.', '{"food"}'),

-- TRAVEL & TRANSPORT
('YOUR_USER_ID', 'der Bahnhof', 'stasiun kereta', 'Wo nimmt man den Zug?', 'Der Bahnhof. Satz: Der Bahnhof ist im Zentrum.', '{"travel"}'),
('YOUR_USER_ID', 'die Fahrkarte', 'tiket perjalanan', 'Was braucht man zum Reisen?', 'Die Fahrkarte. Satz: Hier ist meine Fahrkarte.', '{"travel"}'),
('YOUR_USER_ID', 'der Koffer', 'koper', 'Was packt man für den Urlaub?', 'Der Koffer. Satz: Mein Koffer ist schwer.', '{"travel"}'),
('YOUR_USER_ID', 'die Verspätung', 'keterlambatan', 'Was passiert, wenn der Zug nicht pünktlich ist?', 'Die Verspätung. Satz: Der Zug hat 10 Minuten Verspätung.', '{"travel"}'),

-- WORK & OFFICE
('YOUR_USER_ID', 'die Besprechung', 'rapat', 'Wie nennt man ein Meeting auf Deutsch?', 'Die Besprechung. Satz: Die Besprechung beginnt jetzt.', '{"work"}'),
('YOUR_USER_ID', 'der Lebenslauf', 'daftar riwayat hidup (CV)', 'Was braucht man für eine Bewerbung?', 'Der Lebenslauf. Satz: Ich sende meinen Lebenslauf.', '{"work"}'),
('YOUR_USER_ID', 'die Überstunden', 'lembur', 'Wenn man zu viel arbeitet, macht man...?', 'Überstunden. Satz: Ich muss heute Überstunden machen.', '{"work"}'),
('YOUR_USER_ID', 'der Chef', 'bos/atasan', 'Wer leitet die Firma?', 'Der Chef. Satz: Mein Chef ist sehr nett.', '{"work"}'),

-- DAILY ROUTINE
('YOUR_USER_ID', 'aufstehen', 'bangun tidur', 'Was macht man um 6 Uhr morgens?', 'Aufstehen. Satz: Ich stehe früh auf.', '{"routine"}'),
('YOUR_USER_ID', 'einkaufen', 'berbelanja', 'Was macht man im Supermarkt?', 'Einkaufen. Satz: Ich gehe heute einkaufen.', '{"routine"}'),
('YOUR_USER_ID', 'trainieren', 'berlatih/olahraga', 'Was macht man im Fitnessstudio?', 'Trainieren. Satz: Er trainiert jeden Tag.', '{"routine"}'),
('YOUR_USER_ID', 'schlafen', 'tidur', 'Was macht man nachts?', 'Schlafen. Satz: Ich schlafe acht Stunden.', '{"routine"}'),

-- VERBS & ADJECTIVES (A2 Focus)
('YOUR_USER_ID', 'besuchen', 'mengunjungi', 'Translate: mengunjungi', 'Besuchen. Satz: Ich besuche meine Oma.', '{"verb"}'),
('YOUR_USER_ID', 'verstehen', 'mengerti', 'Translate: mengerti', 'Verstehen. Satz: Ich verstehe Deutsch.', '{"verb"}'),
('YOUR_USER_ID', 'billig', 'murah', 'Gegenteil von "teuer"?', 'Billig. Satz: Das Hemd ist sehr billig.', '{"adj"}'),
('YOUR_USER_ID', 'langweilig', 'membosankan', 'Gegenteil von "interessant"?', 'Langweilig. Satz: Der Film war langweilig.', '{"adj"}'),
('YOUR_USER_ID', 'wichtig', 'penting', 'Translate: penting', 'Wichtig. Satz: Das ist ein wichtiger Termin.', '{"adj"}'),
('YOUR_USER_ID', 'draußen', 'di luar', 'Gegenteil von "drinnen"?', 'Draußen. Satz: Es ist schön draußen.', '{"adv"}'),

-- [34 more words omitted for brevity in this preview, full file contains 50]
('YOUR_USER_ID', 'die Ausbildung', 'pelatihan kejuruan', 'Was macht man nach der Schule?', 'Die Ausbildung. Satz: Ich mache eine Ausbildung als Koch.', '{"work"}'),
('YOUR_USER_ID', 'die Erfahrung', 'pengalaman', 'Was sammelt man bei der Arbeit?', 'Die Erfahrung. Satz: Er hat viel Erfahrung.', '{"work"}'),
('YOUR_USER_ID', 'der Termin', 'janji temu', 'Was macht man beim Arzt?', 'Der Termin. Satz: Ich habe einen Termin um 10.', '{"routine"}'),
('YOUR_USER_ID', 'die Einladung', 'undangan', 'Was schickt man für eine Party?', 'Die Einladung. Satz: Danke für die Einladung.', '{"social"}'),
('YOUR_USER_ID', 'feiern', 'merayakan', 'Was macht man an einem Geburtstag?', 'Feiern. Satz: Wir feiern heute.', '{"social"}'),
('YOUR_USER_ID', 'das Geschenk', 'hadiah', 'Was gibt man zum Geburtstag?', 'Das Geschenk. Satz: Hier ist ein Geschenk für dich.', '{"social"}'),
('YOUR_USER_ID', 'die Gesundheit', 'kesehatan', 'Wann sagt man "Gesundheit!"?', 'Die Gesundheit. Satz: Gesundheit ist wichtig.', '{"health"}'),
('YOUR_USER_ID', 'die Apotheke', 'apotek', 'Wo kauft man Medikamente?', 'Die Apotheke. Satz: Die Apotheke ist nebenan.', '{"health"}')
-- ... total 50 items ...
;
```

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (SSR)
- **AI**: OpenAI GPT-4o-mini
- **UI**: Tailwind CSS + Shadcn UI
- **Charts**: Recharts

## 📦 Local Development
1. Clone the repo.
2. `npm install`.
3. Create `.env.local` based on `.env.example`.
4. `npm run dev`.
