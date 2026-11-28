#!/usr/bin/env bash
# ============================================================
# 42Bet accounts - end-to-end test
# ============================================================
#
# Checks, through nginx, the account rules added for the final version:
#   - the username must be 3 to 20 letters, digits, "_", "." or "-"
#   - the login accepts the username or the email
#   - the avatar must be a PNG, JPEG, GIF or WebP image
#
# Usage:  bash scripts/tests/test-users.sh           (with the stack started by make)
#         BASE_URL=https://localhost:8443 bash scripts/tests/test-users.sh
# Needs:  curl and python3. Logs in 4 times (nginx allows 10 logins a minute).
#
# ============================================================

BASE_URL="${BASE_URL:-https://localhost}"
PASSWORD='Password123!'
PASS=0
FAIL=0

check() { # NAME EXPECTED ACTUAL
  if [ "$2" = "$3" ]; then
    PASS=$((PASS + 1)); printf '  PASS  %-58s %s\n' "$1" "$3"
  else
    FAIL=$((FAIL + 1)); printf '  FAIL  %-58s expected [%s], got [%s]\n' "$1" "$2" "$3"
  fi
}

# call METHOD PATH [TOKEN] [JSON] -> sets CODE (HTTP status) and BODY
call() {
  local args=(-sk -w '\n%{http_code}' -X "$1" "$BASE_URL$2")
  [ -n "$3" ] && args+=(-H "Authorization: Bearer $3")
  [ -n "$4" ] && args+=(-H 'Content-Type: application/json' --data "$4")
  local response
  response=$(curl "${args[@]}")
  CODE=${response##*$'\n'}
  BODY=${response%$'\n'*}
}

# refused CODE -> "refused" when the request was refused by the backend (400)
# or, before reaching it, by the WAF (403)
refused() { { [ "$1" = 400 ] || [ "$1" = 403 ]; } && echo refused || echo "$1"; }

# field KEY -> value of KEY in the JSON BODY
field() {
  printf '%s' "$BODY" | python3 -I -c 'import json, sys; print(json.load(sys.stdin)[sys.argv[1]])' "$1"
}

# png_data_url SIZE -> a VALID PNG as a data URL, of about SIZE bytes.
# The pixels are random, so the picture does not compress. The server decodes
# the avatar, so random bytes labelled "image/jpeg" are not a picture and are refused.
png_data_url() {
  python3 -I -c '
import base64, os, struct, sys, zlib
def chunk(kind, data):
    return struct.pack(">I", len(data)) + kind + data + struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
width = 20
rows = max(1, (int(sys.argv[1]) - 100) // (1 + width * 3))
pixels = b"".join(b"\x00" + os.urandom(width * 3) for _ in range(rows))
png = (b"\x89PNG\r\n\x1a\n"
       + chunk(b"IHDR", struct.pack(">IIBBBBB", width, rows, 8, 2, 0, 0, 0))
       + chunk(b"IDAT", zlib.compress(pixels, 0))
       + chunk(b"IEND", b""))
print("data:image/png;base64," + base64.b64encode(png).decode())
' "$1"
}

USER="acct$RANDOM$RANDOM"
EMAIL="$USER@example.com"
# A valid 1 x 1 PNG picture (the CRC of every chunk and the zlib stream were checked).
PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGP4z8DwHwAFAAH/iZk9HQAAAABJRU5ErkJggg=='

echo "== Registration refuses bad usernames (400)"
for name in '' 'ab' 'with space' 'bob@home' 'abcdefghijklmnopqrstu' 'josé'; do
  call POST /users "" "{\"username\":\"$name\",\"email\":\"x$RANDOM@example.com\",\"password\":\"$PASSWORD\"}"
  check "username '$name'" 400 "$CODE"
done

echo "== Registration refuses an avatar that is not an image (400)"
call POST /users "" "{\"username\":\"${USER}b\",\"email\":\"b$EMAIL\",\"password\":\"$PASSWORD\",\"avatar\":\"data:text/plain;base64,aGVsbG8=\"}"
check "text file as avatar (400 backend or 403 WAF)" refused "$(refused "$CODE")"

echo "== Registration and login"
call POST /users "" "{\"username\":\"$USER\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
check "valid registration -> 201" 201 "$CODE"
call POST /auth/login "" "{\"username\":\"$USER\",\"password\":\"$PASSWORD\"}"
check "login with the username -> 200" 200 "$CODE"
call POST /auth/login "" "{\"username\":\"$EMAIL\",\"password\":\"$PASSWORD\"}"
check "login with the email -> 200" 200 "$CODE"
TOKEN=$(field access_token)
call POST /auth/login "" "{\"username\":\"$EMAIL\",\"password\":\"wrong-password\"}"
check "wrong password -> 401" 401 "$CODE"
call POST /auth/login "" "{\"username\":\"nobody$RANDOM@example.com\",\"password\":\"$PASSWORD\"}"
check "unknown email -> 401" 401 "$CODE"

echo "== Profile update (PATCH /users/me)"
call PATCH /users/me "$TOKEN" '{"username":"me@example.com"}'
check "username with @ -> 400" 400 "$CODE"
call PATCH /users/me "$TOKEN" '{"avatar":"data:text/plain;base64,aGVsbG8="}'
check "text file as avatar -> 400" 400 "$CODE"
call PATCH /users/me "$TOKEN" '{"avatar":"javascript:alert(1)"}'
check "script URL as avatar (400 backend or 403 WAF)" refused "$(refused "$CODE")"
call PATCH /users/me "$TOKEN" "{\"username\":\"${USER}x\",\"avatar\":\"$PNG\"}"
check "new username and PNG avatar -> 200" 200 "$CODE"
check "  username saved" "${USER}x" "$(field username)"
# The server re-encodes the avatar before saving it (normalizeAvatar): a PNG goes in
# and comes out as a JPEG data URL. So the test does not expect the same bytes, nor the
# same format: the saved avatar must be an image data URL.
check "  avatar saved (an image data URL)" "data:image/" "$(field avatar | cut -c1-11)"

echo "== 30 pictures of different sizes are all accepted (none blocked by the WAF)"
CODES=""
for size in $(seq 3000 997 31913); do
  call PATCH /users/me "$TOKEN" "{\"avatar\":\"$(png_data_url "$size")\"}"
  CODES="$CODES $CODE"
done
ACCEPTED=$(grep -o 200 <<< "$CODES" | wc -l)
check "pictures accepted (200)" 30 "$ACCEPTED"
[ "$ACCEPTED" -eq 30 ] || echo "        status codes:$(tr ' ' '\n' <<< "$CODES" | sort | uniq -c | tr -s ' \n' ' ')"

echo
echo "Result: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]