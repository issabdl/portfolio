document.addEventListener("DOMContentLoaded", function() {
    const year = document.getElementById("year");
    if (year) {
        year.textContent = String(new Date().getFullYear());
    }

    const currentTime = document.getElementById("current-time");
    if (currentTime) {
        const formatTime = () => {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, "0");
            const mm = String(now.getMinutes()).padStart(2, "0");
            currentTime.textContent = `${hh}:${mm}`;
        };

        formatTime();
        setInterval(formatTime, 1000);
    }

    const imageElement = document.getElementById("photoAccueil");
    if (imageElement) {
        const imagePaths = [
            "piece/image00001.jpeg",
            "piece/image00002.jpeg",
            "piece/IMG_0635.jpeg",
        ];

        imagePaths.forEach((src) => {
            const img = new Image();
            img.src = src;
        });

        let currentImageIndex = 0;

        function changeImage() {
            const nextIndex = (currentImageIndex + 1) % imagePaths.length;
            let swapped = false;

            const swapToNext = () => {
                if (swapped) return;
                swapped = true;

                currentImageIndex = nextIndex;
                const nextSrc = imagePaths[currentImageIndex];

                const reveal = () => {
                    imageElement.style.opacity = "1";
                };

                imageElement.src = nextSrc;

                if (imageElement.complete) {
                    reveal();
                } else {
                    imageElement.addEventListener("load", reveal, { once: true });
                }
            };

            const onFadeOutEnd = (e) => {
                if (!(e instanceof TransitionEvent)) return;
                if (e.propertyName !== "opacity") return;
                imageElement.removeEventListener("transitionend", onFadeOutEnd);
                swapToNext();
            };

            imageElement.addEventListener("transitionend", onFadeOutEnd);
            imageElement.style.opacity = "0";

            window.setTimeout(() => {
                imageElement.removeEventListener("transitionend", onFadeOutEnd);
                swapToNext();
            }, 1300);
        }

        setInterval(changeImage, 4000);
    }

    const printBtn = document.getElementById("print-cv");
    if (printBtn) {
        printBtn.addEventListener("click", () => {
            window.print();
        });
    }

    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-div");
    if (menuToggle && menu) {
        menuToggle.addEventListener("click", () => {
            const isOpen = menu.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        menu.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener("click", () => {
                menu.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", (e) => {
            const target = e.target;
            if (!(target instanceof Element)) return;
            if (menu.contains(target) || menuToggle.contains(target)) return;
            if (!menu.classList.contains("open")) return;
            menu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    }

    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    if (revealEls.length > 0) {
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("is-visible");
                            io.unobserve(entry.target);
                        }
                    });
                },
                { root: null, threshold: 0.12 }
            );

            revealEls.forEach((el) => io.observe(el));
        } else {
            revealEls.forEach((el) => el.classList.add("is-visible"));
        }
    }

    const spyLinks = Array.from(document.querySelectorAll('#menu-div a[href^="#"]'));
    const spySections = spyLinks
        .map((a) => {
            const id = a.getAttribute("href")?.slice(1) || "";
            const section = id ? document.getElementById(id) : null;
            return { a, section };
        })
        .filter((x) => Boolean(x.section));

    if (spySections.length > 0) {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                const y = window.scrollY;
                let current = spySections[0];
                spySections.forEach((item) => {
                    const sec = item.section;
                    if (!sec) return;
                    const top = sec.offsetTop - 140;
                    if (y >= top) current = item;
                });

                spySections.forEach((item) => item.a.classList.remove("active"));
                current.a.classList.add("active");
                ticking = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }
});
