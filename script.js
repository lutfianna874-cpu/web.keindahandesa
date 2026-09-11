/* =====================================================
   DESA SEPINGGAN GELIK
   SCRIPT.JS
===================================================== */


/* =====================================================
   DARK MODE
===================================================== */

const themeToggle =
    document.getElementById("themeToggle");

const savedTheme =
    localStorage.getItem("desaTheme");

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

        music.currentTime =
            parseFloat(savedTime);

    }

    const wasPlaying =
        localStorage.getItem("musicPlaying");

    if (wasPlaying === "true") {

        music.play()
            .catch(() => {

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
   JIKA USER MENEKAN LINK HALAMAN
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

            music.play()
                .catch(() => {});

        }

    },
    {
        once: true
    }
);


/* =====================================================
   DATABASE KEGIATAN DESA
===================================================== */

const DATABASE_URL =
    "https://script.google.com/macros/s/AKfycbzE-SlHBHIZhP6cX6MnZpdM5zauirTyDIJ8ANa0i230Vrr4_o_n6eKJgroouCRW3cvXVQ/exec";


async function tampilkanKegiatan() {

    const container =
        document.getElementById("kegiatanContainer");

    if (!container) return;

    try {

        const response =
            await fetch(DATABASE_URL);

        const data =
            await response.json();

        container.innerHTML = "";

        data.forEach(kegiatan => {

            const card =
                document.createElement("div");

            card.className =
                "activity-card";

            card.innerHTML = `

                <img
                    src="${kegiatan.Gambar}"
                    alt="${kegiatan.Judul}"
                >

                <div>

                    <span>🌿</span>

                    <h2>
                        ${kegiatan.Judul}
                    </h2>

                    <p>
                        ${kegiatan.Deskripsi}
                    </p>

                    <small>
                        📅 ${new Date(kegiatan.Tanggal)
                            .toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            })}
                    </small>

                    <small>
                        📍 ${kegiatan.Lokasi}
                    </small>

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
            <p>
                Data kegiatan belum dapat dimuat.
            </p>
        `;

    }

}


/* =====================================================
   JALANKAN DATABASE SETELAH HALAMAN SELESAI DIMUAT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    tampilkanKegiatan
);
