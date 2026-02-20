"use client";

import { useState } from "react";

export function AboutModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost text-sm underline underline-offset-2"
      >
        About this board
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-park-cream border-2 border-park-sepia/40 rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-park-sepia hover:text-park-brown"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="font-serif text-2xl font-bold text-park-green-dark mb-5">
              About this board
            </h2>

            <div className="space-y-4 text-sm text-park-brown leading-relaxed">
              <section>
                <h3 className="font-serif font-semibold text-base text-park-green mb-1">
                  What this is
                </h3>
                <p>
                  A neighborhood board for Lawndale Park where neighbors share
                  pet sightings, post missing pet reports, and keep tabs on the
                  familiar park regulars we all recognize. Think of it as a
                  community bulletin board — digital, but still neighborly.
                </p>
              </section>

              <section>
                <h3 className="font-serif font-semibold text-base text-park-green mb-1">
                  When to post
                </h3>
                <p>
                  Post when you spot an unfamiliar dog or cat in the park, when
                  your pet goes missing, or when you have a quick &ldquo;I&rsquo;m here
                  now&rdquo; update that could help someone find their pet faster.
                  Every sighting counts.
                </p>
              </section>

              <section>
                <h3 className="font-serif font-semibold text-base text-park-green mb-1">
                  Regulars
                </h3>
                <p>
                  Some pets are known park regulars — friendly faces that roam
                  the grounds on their own schedule. Tracking them here helps
                  reduce panic when someone spots a &ldquo;stray&rdquo; that&rsquo;s actually
                  just Old Gus from across the street doing his rounds.
                </p>
              </section>

              <section>
                <h3 className="font-serif font-semibold text-base text-park-green mb-1">
                  Safety first
                </h3>
                <p>
                  Do not chase, corner, or try to grab animals — even if they
                  look lost. A scared pet can bolt into traffic or bite. If an
                  animal seems injured or aggressive, call{" "}
                  <strong>Houston BARC Animal Shelter</strong> or your local
                  animal services instead.
                </p>
              </section>

              <section>
                <h3 className="font-serif font-semibold text-base text-park-green mb-1">
                  Privacy
                </h3>
                <p>
                  Please don&rsquo;t post exact street addresses. Stick to
                  landmarks everyone knows — the bridge, the tennis courts, the
                  pavilion, the trail by the creek. This keeps things helpful
                  without oversharing.
                </p>
              </section>

              <section>
                <h3 className="font-serif font-semibold text-base text-park-green mb-1">
                  Be a good neighbor
                </h3>
                <p>
                  Keep updates kind, calm, and factual. A post like &ldquo;Seen 15
                  min ago near the tennis courts; I can wait 20 min&rdquo; is worth
                  more than a dozen frantic messages. We&rsquo;re all here to help.
                </p>
              </section>

              <div className="pt-3 border-t border-park-sepia/20 text-center text-park-sepia text-xs italic">
                Built for Lawndale Park — by neighbors who want pets home safe.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
