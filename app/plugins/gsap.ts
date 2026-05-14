// plugins/gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.client) {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
  }

  // Register Directive
  nuxtApp.vueApp.directive("gsap-reveal", {
    mounted(el, binding) {
      const { revealOnScroll } = useGsap();
      revealOnScroll(el, binding.value || 0);
    },
    getSSRProps() {
      // Return empty props for SSR to avoid errors
      return {};
    },
  });

  return {
    provide: {
      gsap: import.meta.client ? gsap : null,
      ScrollTrigger: import.meta.client ? ScrollTrigger : null,
    },
  };
});
