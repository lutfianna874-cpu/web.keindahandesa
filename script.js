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
    /*
        Ambil posisi musik terakhir.
    */
    const savedTime =
        localStorage.getItem("musicTime");
    if (savedTime) {
        music.currentTime =
            parseFloat(savedTime);
    }
    /*
        Cek apakah musik sebelumnya sedang aktif.
    */
    const wasPlaying =
        localStorage.getItem("musicPlaying");
    /*
        Coba autoplay.
    */
    if (wasPlaying === "true") {
        music.play()
            .catch(() => {
                console.log(
                    "Browser memblokir autoplay."
                );
            });
    }
    /*
        Simpan posisi musik.
    */
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
    /*
        Simpan posisi setiap beberapa detik.
    */
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
        /*
            Simpan posisi sebelum pindah halaman.
        */
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