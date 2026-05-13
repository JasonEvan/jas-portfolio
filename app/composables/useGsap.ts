// composables/useGsap.ts
import SplitType from "split-type";

export const useGsap = () => {
  const { $gsap, $ScrollTrigger } = useNuxtApp();

  // Use a getter to ensure we have the instance when called (especially on client)
  const getGsap = () => $gsap as any;

  /** Reveal elemen dari bawah dengan blur saat scroll */
  const revealOnScroll = (targets: string | Element | Element[], delay = 0) => {
    const gsap = getGsap();
    if (!gsap) return;

    return gsap.fromTo(
      targets,
      { opacity: 0, y: 56, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.1,
        delay,
        scrollTrigger: {
          trigger: targets as Element,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      },
    );
  };

  /** Teks terpecah per karakter, muncul berputar dari bawah */
  const splitTextReveal = (el: HTMLElement) => {
    const gsap = getGsap();
    if (!gsap || !import.meta.client) return;

    const split = new SplitType(el, { types: "chars,words" });
    
    // Gunakan fromTo agar lebih pasti elemen berakhir di opacity 1
    return gsap.fromTo(split.chars, 
      {
        opacity: 0,
        y: 60,
        rotationX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.02,
        duration: 1.2,
        ease: "power4.out",
        // Force visibility at the end
        onComplete: () => {
          gsap.set(split.chars, { clearProps: "all" });
        }
      }
    );
  };

  /** Counter angka dari 0 ke nilai target */
  const animateCounter = (el: HTMLElement, endValue: number, suffix = "") => {
    const gsap = getGsap();
    if (!gsap) return;

    const obj = { val: 0 };
    return gsap.to(obj, {
      val: endValue,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = Math.round(obj.val) + suffix;
      },
      scrollTrigger: { trigger: el, start: "top 80%" },
    });
  };

  /** Parallax lembut background */
  const parallax = (el: HTMLElement, speed = 0.25) => {
    const gsap = getGsap();
    if (!gsap) return;

    return gsap.to(el, {
      yPercent: -25 * speed,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  };

  /** Efek magnetic tombol CTA saat hover */
  const magneticHover = (el: HTMLElement, strength = 0.35) => {
    const gsap = getGsap();
    if (!gsap || !process.client) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      gsap.to(el, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.35,
        ease: "power2.out",
      });
    };
    const onLeave = () =>
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.45)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  };

  /** Garis timeline tumbuh mengikuti scroll */
  const timelineGrow = (lineEl: Element) => {
    const gsap = getGsap();
    if (!gsap) return;

    return gsap.fromTo(
      lineEl,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: lineEl,
          start: "top 75%",
          end: "bottom 25%",
          scrub: true,
        },
      },
    );
  };

  return {
    revealOnScroll,
    splitTextReveal,
    animateCounter,
    parallax,
    magneticHover,
    timelineGrow,
  };
};
