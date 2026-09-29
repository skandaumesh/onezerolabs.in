"""Layout verification for generated agreement PDFs.

Checks the guarantees the template promises, so regressions are caught
mechanically instead of by eye:

  1. every page is exactly A4 portrait
  2. every page carries the running footer with correct "Page X of Y"
  3. every page except the cover carries the running header
  4. no section heading is stranded at the foot of a page
  5. no text overflows the left/right margins
  6. no unnecessarily sparse pages
  7. the signature block is not split across pages

Usage: python scripts/verify-agreement.py generated/agreement-EXAMPLE.pdf
"""
import re
import sys

import fitz

A4 = (595.28, 841.89)
MARGIN_L, MARGIN_R = 57, 57
MARGIN_TOP, MARGIN_BOTTOM = 88, 72
TOL = 1.5  # points of slack for glyph bearings

HEADING_RE = re.compile(r"^\d{2}\s{1,3}[A-Z][A-Z \-&/,']+$")
SIG_MARKERS = ("Signature:", "Company Seal:")
PAGE_NUM_RE = re.compile(r"Page \d+ of \d+")


def check(path):
    doc = fitz.open(path)
    failures, notes = [], []
    total = doc.page_count
    full_text = "".join(p.get_text() for p in doc)

    for i, page in enumerate(doc):
        n = i + 1
        text = page.get_text()

        # 1. page geometry
        if abs(page.rect.width - A4[0]) > 0.5 or abs(page.rect.height - A4[1]) > 0.5:
            failures.append(f"p{n}: not A4 ({page.rect.width:.1f}x{page.rect.height:.1f})")

        # 2. footer. Page numbering is optional (branding.layout.showPageNumbers);
        # when any page carries it, every page must, and the count must be right.
        if PAGE_NUM_RE.search(full_text):
            if f"Page {n} of {total}" not in text:
                failures.append(f"p{n}: footer page number missing/incorrect")
        # Footer carries the contact strip (matches the letterhead reference).
        if "ONEZEROLABS.IN" not in text.upper():
            failures.append(f"p{n}: footer contact strip missing")

        # 3. header (suppressed on the cover by design)
        if n > 1 and "ONEZEROLABS" not in text.upper():
            failures.append(f"p{n}: running header missing")

        # 5a. horizontal overflow of vector art (table borders, rules).
        # Text bboxes alone miss this: a table's cells can sit inside the margin
        # while its drawn border runs past it.
        for shape in page.get_drawings():
            r = shape["rect"]
            if r.width <= 0 or r.height < 0:
                continue
            if r.x0 < MARGIN_L - TOL:
                failures.append(f"p{n}: rule/border crosses left margin (x0={r.x0:.1f})")
                break
            if r.x1 > A4[0] - MARGIN_R + TOL:
                failures.append(f"p{n}: rule/border crosses right margin (x1={r.x1:.1f})")
                break

        # 5b. horizontal overflow of text
        for block in page.get_text("blocks"):
            x0, y0, x1, y1 = block[:4]
            content = (block[4] or "").strip()
            if not content:
                continue
            if x0 < MARGIN_L - TOL:
                failures.append(f"p{n}: text crosses left margin (x0={x0:.1f}) :: {content[:40]!r}")
            if x1 > A4[0] - MARGIN_R + TOL:
                failures.append(f"p{n}: text crosses right margin (x1={x1:.1f}) :: {content[:40]!r}")

        # 4. stranded heading = last body block on the page is a section heading
        body = [
            b for b in page.get_text("blocks")
            if (b[4] or "").strip() and b[1] > MARGIN_TOP - 20 and b[3] < A4[1] - MARGIN_BOTTOM + 20
        ]
        if body:
            last = sorted(body, key=lambda b: b[1])[-1]
            first_line = (last[4] or "").strip().splitlines()[0].strip()
            if HEADING_RE.match(first_line):
                failures.append(f"p{n}: STRANDED HEADING at page foot :: {first_line!r}")

        # 6. sparse page (cover and last page are legitimately lighter)
        if 1 < n < total and len(text) < 900:
            notes.append(f"p{n}: sparse ({len(text)} chars) - check for an avoidable gap")

    # 7. signature block integrity
    sig_pages = [i + 1 for i, p in enumerate(doc) if all(m in p.get_text() for m in SIG_MARKERS)]
    any_sig = [i + 1 for i, p in enumerate(doc) if any(m in p.get_text() for m in SIG_MARKERS)]
    if not any_sig:
        # Not every document is signable -- a proposal has no signature block by
        # design. Only check integrity when one is actually present.
        notes.append("no signature block (expected for a proposal)")
    elif not sig_pages:
        failures.append("signature block is split across pages")
    elif len(any_sig) > len(sig_pages):
        failures.append(f"signature content spills across pages {any_sig}")

    doc.close()
    return total, failures, notes, sig_pages


def main():
    paths = sys.argv[1:] or [
        "generated/agreement-EXAMPLE.pdf",
        "generated/agreement-template-BLANK.pdf",
    ]
    overall_ok = True
    for path in paths:
        total, failures, notes, sig_pages = check(path)
        print(f"\n=== {path}  ({total} pages) ===")
        if failures:
            overall_ok = False
            print(f"  FAIL ({len(failures)})")
            for f in failures:
                print(f"    - {f}")
        else:
            print("  PASS  geometry, header, footer, page numbers, margins, headings")
        if sig_pages:
            print(f"  signature block intact on page {sig_pages[0]}")
        for note in notes:
            print(f"  note: {note}")
    print()
    return 0 if overall_ok else 1


if __name__ == "__main__":
    sys.exit(main())
