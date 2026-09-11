/* =====================================================
   DATABASE GOOGLE SHEETS
===================================================== */

const DATABASE_URL =
"https://script.google.com/macros/s/AKfycbwFrLgk1951I9nztG0bTE9ngL-iI6dODmTiWKYVTddyRLRQQsS3qXtd5sGt6hrP8YkO/exec";


/* =====================================================
   SAAT HALAMAN SELESAI DIMUAT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       DARK MODE
    ================================================= */

    const themeToggle =
        document.getElementById("themeToggle");

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        if (themeToggle) {
            themeToggle.textContent = "☀️";
        }

    }


    if (themeToggle) {

        themeToggle.addEventListener("click", function () {

            document.body.classList.toggle("dark");

            const isDark =
                document.body.classList.contains("dark");

            localStorage.setItem(
                "theme",
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

        menuToggle.addEventListener("click", function () {

            navMenu.classList.toggle("show");

        });


        const navLinks =
            navMenu.querySelectorAll("a");

        navLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                navMenu.classList.remove("show");

            });

        });

    }


    /* =================================================
       TAMPILKAN DATA KEGIATAN
    ================================================= */

    if (
        document.getElementById(
            "kegiatanContainer"
        )
    ) {

        tampilkanKegiatan();

    }


    /* =================================================
       TOMBOL TAMBAH KEGIATAN
    ================================================= */

    const btnTambah =
        document.getElementById(
            "btnTambahKegiatan"
        );

    const formKegiatan =
        document.getElementById(
            "formKegiatan"
        );


    if (btnTambah && formKegiatan) {

        btnTambah.addEventListener(
            "click",
            function () {

                if (
                    formKegiatan.style.display ===
                    "none" ||
                    formKegiatan.style.display === ""
                ) {

                    formKegiatan.style.display =
                        "block";


                    setTimeout(function () {

                        formKegiatan.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });


                        const judul =
                            document.getElementById(
                                "judul"
                            );

                        if (judul) {

                            judul.focus();

                        }

                    }, 100);

                } else {

                    formKegiatan.style.display =
                        "none";

                }

            }
        );

    }


    /* =================================================
       TOMBOL BATAL
    ================================================= */

    const btnBatal =
        document.getElementById(
            "btnBatal"
        );

    const kegiatanForm =
        document.getElementById(
            "kegiatanForm"
        );


    if (
        btnBatal &&
        formKegiatan &&
        kegiatanForm
    ) {

        btnBatal.addEventListener(
            "click",
            function () {

                kegiatanForm.reset();

                formKegiatan.style.display =
                    "none";

            }
        );

    }


    /* =================================================
       SUBMIT / SIMPAN KEGIATAN
    ================================================= */

    if (kegiatanForm) {

        kegiatanForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const btnSimpan =
                    document.getElementById(
                        "btnSimpan"
                    );


                /* -------------------------------------
                   AMBIL DATA FORM
                ------------------------------------- */

                const judul =
                    document
                        .getElementById("judul")
                        .value
                        .trim();


                const deskripsi =
                    document
                        .getElementById("deskripsi")
                        .value
                        .trim();


                const tanggal =
                    document
                        .getElementById("tanggal")
                        .value;


                const lokasi =
                    document
                        .getElementById("lokasi")
                        .value
                        .trim();


                const gambar =
                    document
                        .getElementById("gambar")
                        .value
                        .trim();


                /* -------------------------------------
                   VALIDASI
                ------------------------------------- */

                if (!judul) {

                    alert(
                        "Judul kegiatan belum diisi."
                    );

                    document
                        .getElementById("judul")
                        .focus();

                    return;

                }


                if (!deskripsi) {

                    alert(
                        "Deskripsi kegiatan belum diisi."
                    );

                    document
                        .getElementById("deskripsi")
                        .focus();

                    return;

                }


                if (!tanggal) {

                    alert(
                        "Tanggal kegiatan belum dipilih."
                    );

                    document
                        .getElementById("tanggal")
                        .focus();

                    return;

                }


                if (!lokasi) {

                    alert(
                        "Lokasi kegiatan belum diisi."
                    );

                    document
                        .getElementById("lokasi")
                        .focus();

                    return;

                }


                /* -------------------------------------
                   DATA YANG DIKIRIM
                ------------------------------------- */

                const dataKegiatan = {

                    judul: judul,

                    deskripsi: deskripsi,

                    tanggal: tanggal,

                    lokasi: lokasi,

                    gambar: gambar

                };


                console.log(
                    "Data yang dikirim:",
                    dataKegiatan
                );


                /* -------------------------------------
                   UBAH BUTTON MENJADI LOADING
                ------------------------------------- */

                if (btnSimpan) {

                    btnSimpan.disabled = true;

                    btnSimpan.textContent =
                        "⏳ Menyimpan...";

                }


                /* -------------------------------------
                   KIRIM KE GOOGLE APPS SCRIPT
                ------------------------------------- */

                fetch(
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
                )

                .then(function (response) {

                    return response.text();

                })


                .then(function (text) {

                    console.log(
                        "RESPON APPS SCRIPT:",
                        text
                    );


                    let result;


                    try {

                        result =
                            JSON.parse(text);

                    } catch (error) {

                        throw new Error(
                            "Respons Google Sheets tidak valid."
                        );

                    }


                    if (
                        result.success === true
                    ) {

                        alert(
                            "✅ Kegiatan berhasil ditambahkan!"
                        );


                        /* RESET FORM */

                        kegiatanForm.reset();


                        /* TUTUP FORM */

                        formKegiatan.style.display =
                            "none";


                        /* REFRESH DATA */

                        tampilkanKegiatan();

                    } else {

                        throw new Error(
                            result.message ||
                            "Gagal menyimpan kegiatan."
                        );

                    }

                })


                .catch(function (error) {

                    console.error(
                        "ERROR:",
                        error
                    );


                    alert(
                        "❌ Gagal menyimpan kegiatan.\n\n" +
                        error.message
                    );

                })


                .finally(function () {

                    if (btnSimpan) {

                        btnSimpan.disabled =
                            false;

                        btnSimpan.textContent =
                            "💾 Simpan Kegiatan";

                    }

                });

            }
        );

    }


    /* =================================================
       MUSIK DESA
    ================================================= */

    jalankanMusik();

});


/* =====================================================
   FUNGSI MENAMPILKAN KEGIATAN
===================================================== */

function tampilkanKegiatan() {

    const container =
        document.getElementById(
            "kegiatanContainer"
        );


    if (!container) {

        return;

    }


    container.innerHTML = `

        <p class="loading-kegiatan">
            🌿 Memuat kegiatan desa...
        </p>

    `;


    fetch(DATABASE_URL)

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                "Gagal mengambil data dari database."
            );

        }


        return response.json();

    })


    .then(function (data) {

        console.log(
            "DATA DARI GOOGLE SHEETS:",
            data
        );


        container.innerHTML = "";


        if (
            !Array.isArray(data) ||
            data.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-kegiatan">

                    <div class="empty-icon">
                        🌿
                    </div>

                    <h3>
                        Belum Ada Kegiatan
                    </h3>

                    <p>
                        Belum ada kegiatan desa yang ditambahkan.
                    </p>

                </div>

            `;

            return;

        }


        /* ---------------------------------------------
           DATA TERBARU DI ATAS
        --------------------------------------------- */

        data.reverse();


        data.forEach(function (item) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "activity-card";


            /* -----------------------------------------
               GAMBAR
            ----------------------------------------- */

            let gambarHTML = "";


            if (
                item.gambar &&
                String(item.gambar).trim() !== ""
            ) {

                gambarHTML = `

                    <div class="activity-image">

                        <img
                            src="${escapeHTML(
                                String(
                                    item.gambar
                                ).trim()
                            )}"
                            alt="${escapeHTML(
                                item.judul ||
                                "Kegiatan Desa"
                            )}"
                            onerror="
                                this.parentElement.style.display='none';
                            "
                        >

                    </div>

                `;

            }


            /* -----------------------------------------
               TANGGAL
            ----------------------------------------- */

            let tanggalText =
                item.tanggal || "-";


            if (item.tanggal) {

                const tanggal =
                    new Date(
                        item.tanggal
                    );


                if (!isNaN(tanggal)) {

                    tanggalText =
                        tanggal.toLocaleDateString(
                            "id-ID",
                            {

                                day: "numeric",

                                month: "long",

                                year: "numeric"

                            }
                        );

                }

            }


            /* -----------------------------------------
               ISI CARD
            ----------------------------------------- */

            card.innerHTML = `

                ${gambarHTML}

                <div class="activity-content">

                    <span class="activity-date">

                        📅
                        ${escapeHTML(
                            tanggalText
                        )}

                    </span>


                    <h3>

                        ${escapeHTML(
                            item.judul ||
                            "Kegiatan Desa"
                        )}

                    </h3>


                    <p>

                        ${escapeHTML(
                            item.deskripsi ||
                            "Tidak ada deskripsi."
                        )}

                    </p>


                    <div class="activity-location">

                        📍
                        ${escapeHTML(
                            item.lokasi ||
                            "Desa Sepinggan Gelik"
                        )}

                    </div>

                </div>

            `;


            container.appendChild(card);

        });

    })


    .catch(function (error) {

        console.error(
            "Gagal mengambil data:",
            error
        );


        container.innerHTML = `

            <div class="empty-kegiatan">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h3>
                    Data Tidak Dapat Dimuat
                </h3>

                <p>
                    Periksa koneksi Google Sheets
                    atau Apps Script.
                </p>

            </div>

        `;

    });

}


/* =====================================================
   KEAMANAN HTML
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   MUSIK
===================================================== */

function jalankanMusik() {

    const musik =
        document.getElementById(
            "musikDesa"
        );


    if (!musik) {

        return;

    }


    const posisi =
        localStorage.getItem(
            "posisiMusik"
        );


    if (posisi) {

        musik.currentTime =
            parseFloat(posisi);

    }


    musik.volume = 0.35;


    function mulaiMusik() {

        musik.play()

        .then(function () {

            console.log(
                "Musik berhasil diputar."
            );

        })

        .catch(function () {

            console.log(
                "Browser menunggu interaksi pengguna."
            );

        });

    }


    mulaiMusik();


    /* Jika autoplay diblokir,
       musik akan mulai setelah user
       melakukan klik pertama */

    document.addEventListener(
        "click",
        mulaiMusik,
        {
            once: true
        }
    );


    /* Simpan posisi musik */

    musik.addEventListener(
        "timeupdate",
        function () {

            localStorage.setItem(
                "posisiMusik",
                musik.currentTime
            );

        }
    );

}
