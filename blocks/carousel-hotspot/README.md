# carousel-hotspot

Custom **carousel** block. Purpose: horizontal carousel of fixed-size product photos with (+) hotspot buttons that open product info cards (name, color, View product link) beside the button, kept inside the slide; the first hotspot starts open; prev/next arrows and a progress bar.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One row per slide. Cell 1: product photo. Cell 2: one group per hotspot, each starting with a heading (H5 product name), followed by an optional position paragraph giving the hotspot centre as x/y percentages of the slide, measured from its top-left (e.g. "40% 60%", "40, 60" or "x: 40, y: 60"), a color paragraph and a "View product" link. Hotspots without a position get default positions. Slides are fixed-size like the source (315x464 mobile, 410x516 desktop), so positions stay on the same spot of the photo.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
