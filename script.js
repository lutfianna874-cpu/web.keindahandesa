/* =====================================================
   DESA SEPINGGAN GELIK
   SCRIPT.JS
===================================================== */


/* =====================================================
   DARK MODE
===================================================== */

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


/* =====================================================
   MENU HP
===================================================== */

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("show");

    });

}


/* =====================================================
   SCROLL ANIMATION
===================================================== */

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

}


/* =====================================================
   MUSIK DESA
===================================================== */

const music =
    document.getElementById("musikDesa");

const playButton =
    document.getElementById("playMusic");

if (music) {

    const savedTime =
        localStorage.getItem("musicTime");

    if (savedTime) {

        try {

            music.currentTime =
                parseFloat(savedTime);

        } catch (error) {

            console.log(
                "Gagal mengatur waktu musik."
            );

        }

    }

    const wasPlaying =
        localStorage.getItem("musicPlaying");

    if (wasPlaying === "true") {

        music.play().catch(() => {

            console.log(
                "Browser memblokir autoplay."
            );

        });

    }

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

}


/* =====================================================
   TOMBOL MUSIK DI BERANDA
===================================================== */

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
                        "Silakan izinkan suara pada browser terlebih dahulu."
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


/* =====================================================
   SIMPAN STATUS MUSIK SAAT PINDAH HALAMAN
===================================================== */

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


/* =====================================================
   COBA PUTAR SETELAH USER BERINTERAKSI
===================================================== */

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


/* =====================================================
   DATABASE KEGIATAN DESA
   GOOGLE APPS SCRIPT
===================================================== */

const DATABASE_URL =
    "https://script.google.com/macros/s/AKfycbwFrLgk1951I9nztG0bTE9ngL-iI6dODmTiWKYVTddyRLRQQsS3qXtd5sGt6hrP8YkO/exec";


/* =====================================================
   TAMPILKAN DATA KEGIATAN
===================================================== */

async function tampilkanKegiatan() {

    const container =
        document.getElementById("kegiatanContainer");

    if (!container) return;

    try {

        const response =
            await fetch(DATABASE_URL);

        if (!response.ok) {

            throw new Error(
                "Gagal menghubungi database."
            );

        }

        const data =
            await response.json();

        container.innerHTML = "";

        if (!Array.isArray(data) || data.length === 0) {

            container.innerHTML = `
                <div class="empty-kegiatan">
                    <p>🌿 Belum ada data kegiatan.</p>
                </div>
            `;

            return;

        }


        data.forEach(kegiatan => {

            const card =
                document.createElement("div");

            card.className =
                "activity-card";


            /* =========================================
               FORMAT TANGGAL
            ========================================= */

            let tanggal = "";

            if (kegiatan.tanggal) {

                const date =
                    new Date(kegiatan.tanggal);

                if (!isNaN(date.getTime())) {

                    tanggal =
                        date.toLocaleDateString(
                            "id-ID",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        );

                } else {

                    tanggal =
                        kegiatan.tanggal;

                }

            }


            /* =========================================
               GAMBAR
            ========================================= */

            const gambar =
                kegiatan.gambar || "";


            /* =========================================
               CARD KEGIATAN
            ========================================= */

            card.innerHTML = `

                ${
                    gambar
                    ? `
                        <img
                            src="${gambar}"
                            alt="${kegiatan.judul || "Kegiatan Desa"}"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >
                    `
                    : ""
                }

                <div class="activity-content">

                    <span class="activity-icon">
                        🌿
                    </span>

                    <h2>
                        ${kegiatan.judul || ""}
                    </h2>

                    <p>
                        ${kegiatan.deskripsi || ""}
                    </p>

                    ${
                        tanggal
                        ? `
                            <small>
                                📅 ${tanggal}
                            </small>
                        `
                        : ""
                    }

                    ${
                        kegiatan.lokasi
                        ? `
                            <small>
                                📍 ${kegiatan.lokasi}
                            </small>
                        `
                        : ""
                    }

                </div>

            `;

            container.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Gagal mengambil data kegiatan:",
            error
        );

        container.innerHTML = `
            <div class="error-kegiatan">

                <p>
                    ⚠️ Data kegiatan belum dapat dimuat.
                </p>

                <small>
                    Silakan coba refresh halaman.
                </small>

            </div>
        `;

    }

}


/* =====================================================
   TAMBAH KEGIATAN
   BUKA / TUTUP FORM
===================================================== */

const btnTambahKegiatan =
    document.getElementById("btnTambahKegiatan");

const formKegiatan =
    document.getElementById("formKegiatan");

const btnBatal =
    document.getElementById("btnBatal");

const kegiatanForm =
    document.getElementById("kegiatanForm");


/* =====================================================
   TOMBOL TAMBAH KEGIATAN
===================================================== */

if (btnTambahKegiatan && formKegiatan) {

    btnTambahKegiatan.addEventListener(
        "click",
        () => {

            if (formKegiatan.style.display === "none") {

                formKegiatan.style.display = "block";

                formKegiatan.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            } else {

                formKegiatan.style.display = "none";

            }

        }
    );

}


/* =====================================================
   TOMBOL BATAL
===================================================== */

if (btnBatal && formKegiatan) {

    btnBatal.addEventListener(
        "click",
        () => {

            formKegiatan.style.display = "none";

            if (kegiatanForm) {
                kegiatanForm.reset();
            }

        }
    );

}


/* =====================================================
   SIMPAN KEGIATAN KE GOOGLE SHEETS
===================================================== */

if (kegiatanForm) {

    kegiatanForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =========================================
               AMBIL DATA FORM
            ========================================= */

            const judul =
                document.getElementById("judul").value.trim();

            const deskripsi =
                document.getElementById("deskripsi").value.trim();

            const tanggal =
                document.getElementById("tanggal").value;

            const lokasi =
                document.getElementById("lokasi").value.trim();

            const gambar =
                document.getElementById("gambar").value.trim();


            /* =========================================
               CEK DATA
            ========================================= */

            if (
                !judul ||
                !deskripsi ||
                !tanggal ||
                !lokasi
            ) {

                alert(
                    "⚠️ Silakan lengkapi semua data kegiatan."
                );

                return;

            }


            /* =========================================
               TOMBOL SIMPAN
            ========================================= */

            const btnSimpan =
                document.getElementById("btnSimpan");

            const teksAwal =
                btnSimpan
                    ? btnSimpan.innerHTML
                    : "";


            if (btnSimpan) {

                btnSimpan.disabled = true;

                btnSimpan.innerHTML =
                    "⏳ Menyimpan...";

            }


            /* =========================================
               DATA YANG DIKIRIM
            ========================================= */

            const dataKegiatan = {

                judul: judul,

                deskripsi: deskripsi,

                tanggal: tanggal,

                lokasi: lokasi,

                gambar: gambar

            };


            try {

                /*
                 * text/plain digunakan agar POST
                 * tidak memicu preflight CORS.
                 */

                const response =
                    await fetch(
                        DATABASE_URL,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "text/plain;charset=utf-8"
                            },

                            body:
                                JSON.stringify(
                                    dataKegiatan
                                )
                        }
                    );


                const hasil =
                    await response.json();


                if (!hasil.success) {

                    throw new Error(
                        hasil.message ||
                        "Gagal menyimpan kegiatan."
                    );

                }


                /* =====================================
                   BERHASIL
                ===================================== */

                alert(
                    "✅ Kegiatan berhasil ditambahkan!"
                );


                /* Kosongkan form */

                kegiatanForm.reset();


                /* Tutup form */

                formKegiatan.style.display =
                    "none";


                /* Tampilkan data terbaru */

                await tampilkanKegiatan();


            } catch (error) {

                console.error(
                    "Gagal menyimpan kegiatan:",
                    error
                );

                alert(
                    "❌ Kegiatan gagal disimpan.\n\n" +
                    "Pastikan Google Apps Script sudah menggunakan doPost() dan deployment sudah diperbarui."
                );

            } finally {

                if (btnSimpan) {

                    btnSimpan.disabled = false;

                    btnSimpan.innerHTML =
                        teksAwal ||
                        "💾 Simpan Kegiatan";

                }

            }

        }
    );

}


/* =====================================================
   JALANKAN DATABASE SAAT HALAMAN DIMUAT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        tampilkanKegiatan();

    }
);
