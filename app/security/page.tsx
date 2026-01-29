export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Security</h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="bg-accent/10 border border-accent p-6 rounded-lg">
            <p className="text-lg font-semibold">
              🔒 Your diary is protected by military-grade encryption. We take
              security seriously, and we&apos;ve built our platform with privacy
              as the foundation.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">End-to-End Encryption</h2>
            <p>
              All diary entries are encrypted on your device before being sent
              to our servers. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Your diary content is <strong>never</strong> transmitted in
                plaintext
              </li>
              <li>We cannot read your diary entries - even if we wanted to</li>
              <li>Database administrators cannot access your diary content</li>
              <li>
                Even in the event of a server breach, your entries remain
                encrypted and unreadable
              </li>
            </ul>

            <div className="bg-muted p-6 rounded-lg mt-4">
              <h3 className="text-xl font-semibold mb-3">Technical Details</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <strong>Encryption Algorithm:</strong> AES-GCM (Advanced
                  Encryption Standard - Galois/Counter Mode)
                </li>
                <li>
                  <strong>Key Size:</strong> 256 bits
                </li>
                <li>
                  <strong>Key Derivation:</strong> PBKDF2 (Password-Based Key
                  Derivation Function 2)
                </li>
                <li>
                  <strong>KDF Iterations:</strong> 100,000 (NIST recommended)
                </li>
                <li>
                  <strong>Hash Algorithm:</strong> SHA-256
                </li>
                <li>
                  <strong>IV Size:</strong> 96 bits (12 bytes), randomly
                  generated per entry
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">How It Works</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">
                  1. Key Generation
                </h3>
                <p>
                  When you create an account, a unique encryption key is derived
                  from your user ID and a randomly generated salt. This salt is
                  stored securely in your browser&apos;s localStorage.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">
                  2. Writing an Entry
                </h3>
                <p>
                  As you write, your content remains in plaintext on your
                  device. When you save:
                </p>
                <ol className="list-decimal pl-6 space-y-1 mt-2">
                  <li>A random initialization vector (IV) is generated</li>
                  <li>
                    Your content is encrypted using your unique key and the IV
                  </li>
                  <li>The encrypted data is converted to base64 format</li>
                  <li>Only the encrypted data is sent to our servers</li>
                </ol>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">
                  3. Reading an Entry
                </h3>
                <p>When you view a diary entry:</p>
                <ol className="list-decimal pl-6 space-y-1 mt-2">
                  <li>Encrypted data is fetched from our servers</li>
                  <li>The IV is extracted from the encrypted data</li>
                  <li>
                    Your unique key is derived again from your user ID and salt
                  </li>
                  <li>The content is decrypted on your device</li>
                  <li>You see your plaintext diary entry</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What We Can See</h2>
            <p>
              Transparency is important to us. Here&apos;s exactly what we can
              and cannot see:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">
                  ❌ We CANNOT See:
                </h3>
                <ul className="space-y-2">
                  <li>✗ Your diary content</li>
                  <li>✗ What you write about</li>
                  <li>✗ Your thoughts and feelings</li>
                  <li>✗ Any text in your entries</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400">
                  ✓ We CAN See:
                </h3>
                <ul className="space-y-2">
                  <li>✓ Your email address</li>
                  <li>✓ Entry dates (when you wrote)</li>
                  <li>✓ Word counts</li>
                  <li>✓ Encrypted (unreadable) content</li>
                  <li>✓ Login times</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Additional Security Measures
            </h2>

            <div className="space-y-4">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  🔐 Secure Authentication
                </h3>
                <p>
                  We use Supabase Auth, which implements industry-standard
                  authentication protocols:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Bcrypt password hashing with salt</li>
                  <li>JWT tokens for session management</li>
                  <li>Email verification</li>
                  <li>Password reset with secure tokens</li>
                </ul>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  🌐 HTTPS/TLS Encryption
                </h3>
                <p>
                  All communication between your device and our servers is
                  encrypted using TLS 1.3, preventing man-in-the-middle attacks
                  and eavesdropping.
                </p>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  💾 Encrypted Backups
                </h3>
                <p>
                  Database backups remain encrypted. Your diary content is never
                  stored in plaintext, even in backups.
                </p>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">
                  🛡️ Protection Against Attacks
                </h3>
                <p>Our encryption implementation protects against:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>
                    <strong>Brute Force:</strong> 100,000 PBKDF2 iterations make
                    key guessing impractical
                  </li>
                  <li>
                    <strong>Rainbow Tables:</strong> Unique salts prevent
                    precomputed attacks
                  </li>
                  <li>
                    <strong>Replay Attacks:</strong> Unique IVs prevent reuse of
                    encrypted data
                  </li>
                  <li>
                    <strong>Tampering:</strong> AES-GCM provides authenticated
                    encryption
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Responsibilities</h2>
            <p>
              While we provide strong encryption, security is a shared
              responsibility:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Strong Password:</strong> Use a unique, complex password
                for your account
              </li>
              <li>
                <strong>Backup Your Salt:</strong> Save your encryption salt in
                a secure location
              </li>
              <li>
                <strong>Secure Device:</strong> Keep your device secure with a
                password/PIN
              </li>
              <li>
                <strong>Log Out:</strong> Always log out on shared or public
                computers
              </li>
              <li>
                <strong>Browser Security:</strong> Keep your browser updated
              </li>
              <li>
                <strong>Be Careful:</strong> Don&apos;t share your account
                credentials
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Limitations and Considerations
            </h2>
            <p>It&apos;s important to understand the current limitations:</p>

            <div className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  ⚠️ Device-Specific Encryption
                </h3>
                <p>
                  Encryption keys are stored in your browser&apos;s
                  localStorage, making them device-specific. To access your
                  entries on a new device, you&apos;ll need to manually transfer
                  your salt.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  ⚠️ No Password Recovery for Content
                </h3>
                <p>
                  If you lose your encryption salt (by clearing browser data),
                  we cannot recover your encrypted diary entries. Always backup
                  your salt!
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">
                  ⚠️ Client-Side Vulnerabilities
                </h3>
                <p>
                  While content is encrypted at rest and in transit, it&apos;s
                  plaintext while you&apos;re writing. Malware or keyloggers on
                  your device could capture content before encryption.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Compliance & Standards</h2>
            <p>Our security practices align with industry standards:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>NIST Guidelines:</strong> Following NIST recommendations
                for cryptographic algorithms
              </li>
              <li>
                <strong>OWASP:</strong> Implementing OWASP security best
                practices
              </li>
              <li>
                <strong>GDPR:</strong> Compliant with EU data protection
                regulations
              </li>
              <li>
                <strong>CCPA:</strong> Compliant with California privacy laws
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Security Audits & Updates
            </h2>
            <p>We continuously work to improve our security:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Regular security reviews and updates</li>
              <li>Monitoring for vulnerabilities in dependencies</li>
              <li>Staying current with cryptographic best practices</li>
              <li>Responding promptly to security reports</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              Reporting Security Issues
            </h2>
            <p>
              If you discover a security vulnerability, please report it
              responsibly:
            </p>
            <div className="bg-muted p-6 rounded-lg">
              <p>
                <strong>📧 Security Email:</strong> security@dailydiary.app
              </p>
              <p className="mt-4">Please include:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Description of the vulnerability</li>
                <li>Steps to reproduce</li>
                <li>Potential impact</li>
                <li>Your contact information</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                We appreciate responsible disclosure and will respond within 48
                hours.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Transparency</h2>
            <p>We believe in transparency about our security practices:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Our encryption implementation is open for review</li>
              <li>We document our security measures publicly</li>
              <li>We disclose any security incidents as required by law</li>
              <li>We maintain detailed technical documentation</li>
            </ul>
            <p className="mt-4">
              Want to learn more? Check our{" "}
              <a href="/support" className="text-accent hover:underline">
                Support page
              </a>{" "}
              or review our{" "}
              <a
                href="https://github.com/yourusername/daily_diary"
                className="text-accent hover:underline"
              >
                source code
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
