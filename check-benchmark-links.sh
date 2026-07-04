#!/usr/bin/env bash
# Definitive benchmark-link checker for Nairobi 2055.
# Runs REAL HTTP requests from your machine (unrestricted network) and reports
# every benchmark URL that does NOT return a healthy status.
#
# Usage:
#   cd ~/nairobi2055.org
#   ./check-benchmark-links.sh              # re-extracts URLs from index.html and checks them
#   ./check-benchmark-links.sh urls.txt     # or check a specific URL list
#
# Output: a table of URL + HTTP status. Anything not 2xx/3xx (or "000" = no
# response / timeout / dead domain) is flagged with >>> so it's easy to spot.

set -uo pipefail
SRC="${1:-}"
HTML="index.html"
TMP="$(mktemp)"

if [[ -n "$SRC" && -f "$SRC" ]]; then
  cp "$SRC" "$TMP"
elif [[ -f "$HTML" ]]; then
  # Extract hrefs from benchmark link classes (bench-link / also-link / bench-item)
  grep -oE '<a [^>]*class="[^"]*(bench-link|also-link|bench-item)[^"]*"[^>]*>' "$HTML" \
    | grep -oE 'href="[^"]+"' | sed 's/href="//;s/"//' \
    | grep -E '^https?://' | sort -u > "$TMP"
else
  echo "No URL list given and no index.html found." >&2; exit 1
fi

total=$(wc -l < "$TMP" | tr -d ' ')
echo "Checking $total benchmark URLs..."
echo "-------------------------------------------------------------------"
bad=0
while IFS= read -r url; do
  [[ -z "$url" ]] && continue
  # HEAD first; some servers reject HEAD, so fall back to a ranged GET.
  code=$(curl -A "Mozilla/5.0 (link-check)" -s -o /dev/null -L \
              --connect-timeout 12 --max-time 25 -w '%{http_code}' -I "$url")
  if [[ "$code" == "000" || "$code" -ge 400 ]]; then
    code=$(curl -A "Mozilla/5.0 (link-check)" -s -o /dev/null -L \
                --connect-timeout 12 --max-time 25 -w '%{http_code}' \
                -r 0-0 "$url")
  fi
  if [[ "$code" == "000" || "$code" -ge 400 ]]; then
    printf '>>> %-4s  %s\n' "$code" "$url"; bad=$((bad+1))
  else
    printf '    %-4s  %s\n' "$code" "$url"
  fi
done < "$TMP"
echo "-------------------------------------------------------------------"
echo "Done. $bad of $total need attention (status 4xx/5xx or 000)."
echo "Note: 403 can be bot-blocking on a live page; open those in a browser to confirm."
rm -f "$TMP"
