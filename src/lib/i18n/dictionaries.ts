export type Language = 'id' | 'de'

export const dictionaries = {
  id: {
    nav: {
      dashboard: 'Beranda',
      add: 'Tambah Kata',
      review: 'Belajar',
      logout: 'Keluar'
    },
    dashboard: {
      title: 'Dasbor Saya',
      subtitle: 'Selamat datang kembali! Saatnya belajar bahasa Jerman.',
      addCard: 'Tambah Kartu',
      studyNow: 'Belajar Sekarang',
      totalVocab: 'Total Kosakata',
      dueToday: 'Jatuh Tempo',
      accuracy: 'Akurasi Rata-rata',
      streak: 'Hari Beruntun',
      dailyGoal: 'Target Harian',
      goalAchieved: 'Target harian tercapai! Pertahankan momentum.',
      problemWords: 'Kata yang Sulit',
      proTip: 'Tips Pro',
      proTipContent: 'Meninjau kartu di pagi hari meningkatkan retensi hingga 20%.',
      masterLevel: 'Kuasai Level Ini',
      curriculum: 'Lihat Kurikulum'
    },
    login: {
      title: 'Selamat Datang!',
      subtitle: 'Masukkan kredensial Anda untuk mengakses kartu belajar.',
      loginTab: 'Masuk',
      registerTab: 'Daftar',
      email: 'Email',
      password: 'Kata Sandi',
      processing: 'Memproses...',
      signInEmail: 'Masuk dengan Email',
      createAccount: 'Buat Akun',
      orContinue: 'Atau lanjutkan dengan',
      configRequired: 'Konfigurasi Diperlukan',
      missingUrl: 'NEXT_PUBLIC_SUPABASE_URL tidak ditemukan. Harap buat file .env.local.'
    },
    add: {
      title: 'Tambah Kosakata Baru',
      subtitle: 'Masukkan kata Jerman, dan AI kami akan membuat kartu lengkap untuk Anda.',
      germanWord: 'Kata Jerman',
      context: 'Konteks (Opsional)',
      generate: 'Buat Kartu',
      generating: 'Sedang Membuat...',
      duplicate: 'Kata ini sudah ada di koleksi Anda!',
      previewTitle: 'Pratinjau Kartu Kreatif',
      save: 'Simpan ke Koleksi',
      saving: 'Menyimpan...',
      backToDashboard: 'Kembali ke Dasbor'
    },
    review: {
      loading: 'Memuat kartu dari daftar Anda...',
      finished: {
        title: 'Sesi Selesai!',
        subtitle: 'Bagus! Anda telah meninjau {count} kartu hari ini.',
        accuracy: 'Akurasi',
        vocab: 'Kosakata',
        back: 'Kembali ke Dasbor'
      },
      empty: {
        title: 'Semua Selesai!',
        subtitle: 'Anda sudah mutakhir. Tidak ada kartu yang perlu diulang saat ini. Kerja bagus!',
        back: 'Kembali ke Dasbor',
        addNew: 'Tambah Kata Baru'
      },
      sentenceMode: {
        title: 'Mode Bonus: Pembentukan Kalimat',
        subtitle: 'Buat kalimat dengan kata:',
        placeholder: 'Tulis kalimat Anda di sini...',
        check: 'Periksa dengan AI',
        checking: 'Sedang Memeriksa...',
        correct: 'Benar!',
        almost: 'Hampir Benar!',
        correction: 'Versi Benar:',
        next: 'Kartu Berikutnya'
      },
      again: 'Lagi',
      hard: 'Sulit',
      good: 'Bagus',
      easy: 'Mudah'
    },
    grammar: {
      article: 'Artikel',
      plural: 'Jamak',
      verbType: 'Tipe Kata Kerja',
      regular: 'Reguler',
      irregular: 'Tidak Reguler',
      separable: 'Terpisah (Trennbar)',
      inseparable: 'Tidak Terpisah',
      transitive: 'Transitif',
      intransitive: 'Intransitif',
      grammarNote: 'Catatan Tata Bahasa',
      infinitiv: 'Infinitif'
    },
    browse: {
      title: 'Koleksi Kosakata',
      empty: 'Kamu belum mempunyai flashcard. Tambahkan kata baru untuk mulai membangun koleksi kamu.',
      next: 'Selanjutnya',
      prev: 'Sebelumnya',
      backToDashboard: 'Kembali',
      flip: 'Balik Kartu'
    }
  },
  de: {
    nav: {
      dashboard: 'Dashboard',
      add: 'Karte hinzufügen',
      review: 'Wiederholen',
      logout: 'Abmelden'
    },
    dashboard: {
      title: 'Mein Dashboard',
      subtitle: 'Willkommen zurück! Zeit für dein tägliches Deutsch.',
      addCard: 'Karte hinzufügen',
      studyNow: 'Jetzt lernen',
      totalVocab: 'Gesamtvokabular',
      dueToday: 'Heute fällig',
      accuracy: 'Genauigkeit',
      streak: 'Tagesserie',
      dailyGoal: 'Tagesziel',
      goalAchieved: 'Tagesziel erreicht! Bleib am Ball.',
      problemWords: 'Problemwörter',
      proTip: 'Pro-Tipp',
      proTipContent: 'Das Wiederholen am Morgen erhöht die Merkfähigkeit um 20%.',
      masterLevel: 'Das Level meistern',
      curriculum: 'Lehrplan ansehen'
    },
    login: {
      title: 'Willkommen!',
      subtitle: 'Gib deine Zugangsdaten ein, um auf deine Karten zuzugreifen.',
      loginTab: 'Anmelden',
      registerTab: 'Registrieren',
      email: 'E-Mail',
      password: 'Passwort',
      processing: 'Verarbeitung...',
      signInEmail: 'Mit E-Mail anmelden',
      createAccount: 'Konto erstellen',
      orContinue: 'Oder weiter mit',
      configRequired: 'Konfiguration erforderlich',
      missingUrl: 'Das System ist nicht konfiguriert. Bitte erstelle eine .env.local Datei.'
    },
    add: {
      title: 'Vokabeln hinzufügen',
      subtitle: 'Gib ein deutsches Wort ein, und unsere KI erstellt eine Karte für dich.',
      germanWord: 'Deutsches Wort',
      context: 'Kontext (Optional)',
      generate: 'Karte erstellen',
      generating: 'Generiere...',
      duplicate: 'Bereits vorhanden!',
      previewTitle: 'Smart-Vorschau',
      save: 'In Sammlung speichern',
      saving: 'Speichere...',
      backToDashboard: 'Zurück zum Dashboard'
    },
    review: {
      loading: 'Lade Karten aus deiner Merk-Liste...',
      finished: {
        title: 'Sitzung abgeschlossen!',
        subtitle: 'Super! Du hast heute {count} Karten wiederholt.',
        accuracy: 'Genauigkeit',
        vocab: 'Vokabeln',
        back: 'Zurück zum Dashboard'
      },
      empty: {
        title: 'Alles erledigt!',
        subtitle: 'Du bist auf dem neuesten Stand. Keine Karten zu wiederholen. Gute Arbeit!',
        back: 'Zurück zum Dashboard',
        addNew: 'Neue Karten hinzufügen'
      },
      sentenceMode: {
        title: 'Bonusmodus: Satzbildung',
        subtitle: 'Bilde einen Satz mit dem Wort:',
        placeholder: 'Schreibe deinen Satz hier...',
        check: 'Mit KI prüfen',
        checking: 'Prüfe...',
        correct: 'Richtig!',
        almost: 'Fast richtig!',
        correction: 'Korrekte Version:',
        next: 'Nächste Karte'
      },
      again: 'Nochmal',
      hard: 'Schwer',
      good: 'Gut',
      easy: 'Einfach'
    },
    grammar: {
      article: 'Artikel',
      plural: 'Plural',
      verbType: 'Verbtyp',
      regular: 'Regelmäßig',
      irregular: 'Unregelmäßig',
      separable: 'Trennbar',
      inseparable: 'Untrennbar',
      transitive: 'Transitiv',
      intransitive: 'Intransitiv',
      grammarNote: 'Grammatik-Hinweis',
      infinitiv: 'Infinitiv'
    },
    browse: {
      title: 'Vokabelsammlung',
      empty: 'Du hast keine Karten. Füge neue Wörter hinzu, um deine Sammlung aufzubauen.',
      next: 'Nächste',
      prev: 'Vorherige',
      backToDashboard: 'Zurück',
      flip: 'Karte umdrehen'
    }
  }
}
