# TODO: Fix admin login/dashboard access issue

- [x] Ensure NextAuth options include `secret` (and optionally `debug`) so JWT decoding works.
- [ ] Check NextAuth token/session persistence (why login returns to /admin -> 3000 => actually redirects to /login).
- [ ] Fix NextAuth middleware protection: ensure matcher and authorized logic correct.
- [ ] Implement robust auth gating by using token presence + role (optional).

- [ ] Rebuild and test:
  - [ ] Login with username `admin` and given password.
  - [ ] Verify /admin shows dashboard.
  - [ ] Verify one admin API call returns 200.

