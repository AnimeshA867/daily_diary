import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Daily Diary
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your private, encrypted personal journal. Write freely, knowing
              your thoughts are secure.
            </p>
            <p className="text-xs text-muted-foreground">
              🔒 End-to-end encrypted
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Support & FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/diary"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="mailto:legal@dailydiary.app"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Legal Inquiries
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:hello@dailydiary.app"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  General: hello@dailydiary.app
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@dailydiary.app"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Support: support@dailydiary.app
                </a>
              </li>
              <li>
                <a
                  href="mailto:security@dailydiary.app"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Security: security@dailydiary.app
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@dailydiary.app"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Privacy: privacy@dailydiary.app
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Daily Diary. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/yourusername/daily_diary"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://twitter.com/dailydiaryapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Twitter
              </a>
              <Link
                href="/support"
                className="text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Protected by AES-GCM 256-bit encryption • Your diary is private
            and secure • We cannot read your entries
          </p>
        </div>
      </div>
    </footer>
  );
}
