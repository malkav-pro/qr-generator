# Static QR codes are supposed to be permanent.

A QR code is a data container, not a lease. It should encode exactly what it points to and continue to work for as long as the destination itself exists. This tool generates truly static QR codes: what you enter is what gets encoded. There are no redirects, no link shorteners, no vendor-controlled resolution layer, and no mechanism to deactivate a code after it has been printed.

This project exists to restore that simplicity.
It deliberately avoids accounts, tracking, analytics, and dynamic behavior, because those features introduce control where none is needed. QR codes are often printed onto physical objects, and once printed, failure is irreversible. This generator is designed to produce QR codes that remain valid, verifiable, and independent of any third-party service, now and in the future.