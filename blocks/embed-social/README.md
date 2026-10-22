# embed-social

Custom **embed** block. Purpose: Sprinklr social (Instagram) gallery; the Sprinklr script is loaded lazily only when the block is scrolled near the viewport. A placeholder reserves space until posts render; if the script cannot run (CSP, network, timeout) the block collapses and the section's default-content Follow link remains the fallback.

## Authoring (Document Authoring)

Model: `standalone`

Single block table. Content: One cell: link to the Sprinklr embed script (https://gallery.sprinklr.com/clients/CLIENT_ID/embeds/EMBED_ID/script.js). A bare embed id is also accepted and uses client 24392. Gallery posts are rendered by Sprinklr at runtime.

## Supported variations

No variations.

## Universal Editor fields

N/A (Document Authoring project)
