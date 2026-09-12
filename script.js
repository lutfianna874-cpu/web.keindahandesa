/* =====================================================
   DESA SEPINGGAN GELIK
   SCRIPT.JS
===================================================== */
/* =====================================================
   DARK MODE
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("desaTheme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }
    }
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark =
                document.body.classList.contains("dark");
            localStorage.setItem(
                "desaTheme",
                isDark ? "dark" : "light"
            );
            themeToggle.textContent =
                isDark ? "☀️" : "🌙";
        });
    }
    /* =================================================
       MENU HP
    ================================================= */
    const menuToggle =
        document.getElementById("menuToggle");
    const navMenu =
        document.getElementById("navMenu");
    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", () => {
            navMenu.classList.toggle("show");
        });
    }
    /* =================================================
       ANIMASI SCROLL
    ================================================= */
    const revealElements =
        document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("show");
                        }
                    });
                },
                {
                    threshold: 0.15
                }
            );
        revealElements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("show");
        });
    }
    /* =================================================
       MUSIK DESA
    ================================================= */
    const music =
        document.getElementById("musikDesa");
    const playButton =
        document.getElementById("playMusic");
    if (music) {
        const savedTime =
            localStorage.getItem("musicTime");
        if (savedTime) {
            music.currentTime =
                parseFloat(savedTime);
        }
        const wasPlaying =
            localStorage.getItem("musicPlaying");
        /*
           Browser biasanya memblokir autoplay
           sebelum user berinteraksi.
           Kalau sebelumnya musik sedang aktif,
           kita coba jalankan kembali.
        */
        if (wasPlaying === "true") {
            music.play().catch(() => {
                console.log(
                    "Autoplay diblokir browser."
                );
            });
        }
        /* SIMPAN POSISI MUSIK */
        setInterval(() => {
            if (!music.paused) {
                localStorage.setItem(
                    "musicTime",
                    music.currentTime
                );
                localStorage.setItem(
                    "musicPlaying",
                    "true"
                );
            }
        }, 1000);
        window.addEventListener(
            "beforeunload",
            () => {
                localStorage.setItem(
                    "musicTime",
                    music.currentTime
                );
                localStorage.setItem(
                    "musicPlaying",
                    String(!music.paused)
                );
            }
        );
    }
    /* =================================================
       TOMBOL MUSIK
    ================================================= */
    if (playButton && music) {
        playButton.addEventListener("click", () => {
            if (music.paused) {
                music.play()
                    .then(() => {
                        localStorage.setItem(
                            "musicPlaying",
                            "true"
                        );
                        playButton.innerHTML =
                            "⏸️ Jeda Musik";
                    })
                    .catch(() => {
                        alert(
                            "Silakan tekan tombol musik kembali."
                        );
                    });
            } else {
                music.pause();
                localStorage.setItem(
                    "musicPlaying",
                    "false"
                );
                playButton.innerHTML =
                    "🎵 Putar Musik";
            }
        });
    }
    /* =================================================
       PINDAH HALAMAN
    ================================================= */
    document.querySelectorAll("nav a").forEach((link) => {
        link.addEventListener("click", () => {
            if (!music) return;
            localStorage.setItem(
                "musicTime",
                music.currentTime
            );
            localStorage.setItem(
                "musicPlaying",
                String(!music.paused)
            );
        });
    });
    /* =================================================
       COBA PUTAR MUSIK SETELAH INTERAKSI USER
    ================================================= */
    document.addEventListener(
        "click",
        () => {
            if (!music) return;
            const wasPlaying =
                localStorage.getItem("musicPlaying");
            if (
                wasPlaying === "true" &&
                music.paused
            ) {
                music.play().catch(() => {});
            }
        },
        {
            once: true
        }
    );
    /* =================================================
       DATABASE GOOGLE SHEETS
    ================================================= */
    tampilkanKegiatan();
});
/* =====================================================
   URL DATABASE GOOGLE APPS SCRIPT
===================================================== */
const DATABASE_URL =
"https://script.google.com/macros/s/AKfycbzE-SlHBHIZhP6cX6MnZpdM5zauirTyDIJ8ANa0i230Vrr4_o_n6eKJgroouCRW3cvXVQ/exec";
/* =====================================================
   DATA CADANGAN
   Akan muncul kalau Google Sheets gagal dibuka.
===================================================== */
const kegiatanCadangan = [
    {
        Judul: "Kegiatan Posyandu",
        Deskripsi:
        "Kegiatan pelayanan kesehatan masyarakat desa yang dilaksanakan secara rutin untuk membantu memantau kesehatan ibu dan anak.",
        Tanggal: "2026-01-15",
        Lokasi: "Desa Sepinggan Gelik",
        Gambar: "masyarakat.jpg"
    },
    {
        Judul: "Gotong Royong Desa",
        Deskripsi:
        "Masyarakat bersama-sama menjaga kebersihan lingkungan dan fasilitas umum desa.",
        Tanggal: "2026-02-10",
        Lokasi: "Desa Sepinggan Gelik",
        Gambar: "masyarakat.jpg"
    },
    {
        Judul: "Kegiatan Keamanan Lingkungan",
        Deskripsi:
        "Kegiatan menjaga keamanan dan ketertiban lingkungan melalui ronda malam dan poskamling.",
        Tanggal: "2026-02-20",
        Lokasi: "Poskamling Desa Sepinggan Gelik",
        Gambar: "poskamling.jpg"
    }
];
/* =====================================================
   FUNGSI MENAMPILKAN KEGIATAN
===================================================== */
async function tampilkanKegiatan() {
    const container =
        document.getElementById("kegiatanContainer");
    /*
       Kalau halaman bukan halaman kegiatan,
       fungsi langsung berhenti.
    */
    if (!container) return;
    /*
       Tampilkan loading
    */
    container.innerHTML = `
        <div class="loading-kegiatan">
            <span>🌿</span>
            <p>Memuat kegiatan desa...</p>
        </div>
    `;
    try {
        const response =
            await fetch(DATABASE_URL);
        if (!response.ok) {
            throw new Error(
                "Server database tidak merespons."
            );
        }
        const data =
            await response.json();
        /*
           Pastikan data berupa array
        */
        if (!Array.isArray(data)) {
            throw new Error(
                "Format data Google Sheets tidak sesuai."
            );
        }
        /*
           Kalau database kosong,
           gunakan data cadangan.
        */
        if (data.length === 0) {
            tampilkanDataKegiatan(
                container,
                kegiatanCadangan
            );
            return;
        }
        /*
           Kalau database berhasil,
           tampilkan data Google Sheets.
        */
        tampilkanDataKegiatan(
            container,
            data
        );
    } catch (error) {
        console.error(
            "Gagal mengambil data kegiatan:",
            error
        );
        /*
           JANGAN membuat halaman kosong.
           Kalau Google Sheets bermasalah,
           tampilkan data cadangan.
        */
        tampilkanDataKegiatan(
            container,
            kegiatanCadangan
        );
    }
}
/* =====================================================
   MEMBUAT CARD KEGIATAN
===================================================== */
function tampilkanDataKegiatan(
    container,
    data
) {
    container.innerHTML = "";
    data.forEach((kegiatan) => {
        const card =
            document.createElement("article");
        card.className =
            "activity-card reveal";
        /*
           Ambil data dengan aman
        */
        const judul =
            kegiatan.Judul ||
            kegiatan.judul ||
            "Kegiatan Desa";
        const deskripsi =
            kegiatan.Deskripsi ||
            kegiatan.deskripsi ||
            "Belum ada deskripsi kegiatan.";
        const lokasi =
            kegiatan.Lokasi ||
            kegiatan.lokasi ||
            "Desa Sepinggan Gelik";
        const gambar =
            kegiatan.Gambar ||
            kegiatan.gambar ||
            "masyarakat.jpg";
        let tanggal =
            kegiatan.Tanggal ||
            kegiatan.tanggal ||
            "";
        /*
           Format tanggal
        */
        let tanggalFormat =
            "Tanggal belum tersedia";
        if (tanggal) {
            const date =
                new Date(tanggal);
            if (!isNaN(date.getTime())) {
                tanggalFormat =
                    date.toLocaleDateString(
                        "id-ID",
                        {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                        }
                    );
            } else {
                tanggalFormat = tanggal;
            }
        }
        /*
           Buat card
        */
        card.innerHTML = `
            <img
                src="${gambar}"
                alt="${judul}"
                onerror="this.src='masyarakat.jpg'"
            >
            <div class="activity-content">
                <span class="activity-icon">
                    🌿
                </span>
                <h2>
                    ${judul}
                </h2>
                <p>
                    ${deskripsi}
                </p>
                <div class="activity-info">
                    <small>
                        📅 ${tanggalFormat}
                    </small>
                    <small>
                        📍 ${lokasi}
                    </small>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    /*
       Jalankan animasi
    */
    setTimeout(() => {
        container
            .querySelectorAll(".reveal")
            .forEach((element) => {
                element.classList.add("show");
            });
    }, 50);
}
