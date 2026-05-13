// plugins/gsap.client.ts
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin }    from 'gsap/TextPlugin'

// SplitText is a GSAP Premium plugin. If the user doesn't have it, we might need to fallback or use a free alternative like SplitType.
// For now, I'll assume the user has access to it or I'll provide a simplified version if it fails.
// Actually, since I'm building this, I'll try to stick to what's available.
// If SplitText is not available, I'll just skip that part or use a different approach.

gsap.registerPlugin(ScrollTrigger, TextPlugin)

export default defineNuxtPlugin(() => ({
  provide: { gsap, ScrollTrigger },
}))
