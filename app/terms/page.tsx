export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground">
          <p className="text-muted-foreground">
            <strong>Last Updated:</strong> January 14, 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              Welcome to Daily Diary. By accessing or using our service, you
              agree to be bound by these Terms of Service ("Terms"). If you do
              not agree to these Terms, please do not use our service.
            </p>
            <p>
              These Terms constitute a legally binding agreement between you and
              Daily Diary. We may update these Terms from time to time, and your
              continued use of the service constitutes acceptance of any
              changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              2. Description of Service
            </h2>
            <p>
              Daily Diary is a personal diary application that allows you to
              create, store, and manage encrypted diary entries. Key features
              include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>End-to-end encrypted diary entries</li>
              <li>Calendar view of your entries</li>
              <li>Streak tracking and statistics</li>
              <li>Auto-save functionality</li>
              <li>Historical entry viewing</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>

            <h3 className="text-xl font-semibold">3.1 Account Creation</h3>
            <p>To use Daily Diary, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 13 years old (or 16 in the EU)</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized account access</li>
            </ul>

            <h3 className="text-xl font-semibold">3.2 Account Security</h3>
            <p>
              You are responsible for all activities that occur under your
              account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use a strong, unique password</li>
              <li>Not share your account credentials with others</li>
              <li>
                Keep your encryption keys secure (stored in your browser's
                localStorage)
              </li>
              <li>Log out from shared or public devices</li>
            </ul>

            <h3 className="text-xl font-semibold">3.3 Account Termination</h3>
            <p>
              You may delete your account at any time. We reserve the right to
              suspend or terminate accounts that violate these Terms or for any
              other reason at our discretion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              4. User Content and Conduct
            </h2>

            <h3 className="text-xl font-semibold">4.1 Your Content</h3>
            <p>
              You retain all rights to the content you create in your diary
              entries. However, by using our service, you grant us a limited
              license to store and process your encrypted content to provide the
              service.
            </p>

            <h3 className="text-xl font-semibold">4.2 Content Restrictions</h3>
            <p>
              While your diary is private and encrypted, you agree not to use
              the service to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Store illegal content or plan illegal activities</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Store malware, viruses, or malicious code</li>
              <li>Attempt to breach our security measures</li>
              <li>Reverse engineer or decompile the service</li>
            </ul>

            <h3 className="text-xl font-semibold">4.3 Monitoring</h3>
            <p>
              <strong>Important:</strong> Due to end-to-end encryption, we{" "}
              <strong>cannot</strong> read your diary content. However, we may
              monitor metadata and usage patterns to detect abuse, ensure
              security, and improve the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              5. Encryption and Data Security
            </h2>

            <h3 className="text-xl font-semibold">5.1 Encryption Disclaimer</h3>
            <p>
              While we implement strong encryption (AES-GCM 256-bit), you
              acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption keys are stored in your browser's localStorage</li>
              <li>
                If you clear browser data, you may lose access to encrypted
                entries
              </li>
              <li>
                We cannot recover your encrypted data if you lose your
                encryption keys
              </li>
              <li>
                Encryption is device-specific and does not currently sync across
                devices
              </li>
            </ul>

            <h3 className="text-xl font-semibold">5.2 Data Backup</h3>
            <p>
              It is your responsibility to back up your diary entries. We
              recommend regularly exporting your entries. While we maintain
              backups, these are for disaster recovery and may not be available
              for individual data recovery.
            </p>

            <h3 className="text-xl font-semibold">5.3 Security Incidents</h3>
            <p>
              In the event of a security breach that may affect your data, we
              will notify you in accordance with applicable laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p>
              The Daily Diary service, including its design, functionality,
              code, and branding, is owned by Daily Diary and is protected by
              copyright, trademark, and other intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Copy, modify, or distribute our code or design</li>
              <li>Use our trademarks without permission</li>
              <li>Create derivative works based on our service</li>
              <li>Use automated tools to scrape or access our service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Service Availability</h2>
            <p>
              We strive to provide reliable service, but we do not guarantee
              that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The service will be uninterrupted or error-free</li>
              <li>All features will work on all devices or browsers</li>
              <li>The service will be available at all times</li>
              <li>All data will be preserved indefinitely</li>
            </ul>
            <p>
              We may perform maintenance, updates, or modifications that
              temporarily affect service availability. We will attempt to
              provide notice of scheduled maintenance when possible.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              8. Disclaimers and Limitations of Liability
            </h2>

            <h3 className="text-xl font-semibold">8.1 Service "As Is"</h3>
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT
              NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>

            <h3 className="text-xl font-semibold">
              8.2 Limitation of Liability
            </h3>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DAILY DIARY SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS
              OF PROFITS, OR LOSS OF GOODWILL, ARISING OUT OF OR IN CONNECTION
              WITH YOUR USE OF THE SERVICE.
            </p>

            <h3 className="text-xl font-semibold">8.3 Maximum Liability</h3>
            <p>
              Our total liability to you for all claims arising from your use of
              the service shall not exceed the amount you paid us in the 12
              months prior to the claim, or $100, whichever is greater.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Daily Diary and
              its officers, directors, employees, and agents from any claims,
              liabilities, damages, losses, and expenses, including reasonable
              attorneys' fees, arising out of or in any way connected with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of the service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Privacy</h2>
            <p>
              Your use of the service is also governed by our Privacy Policy.
              Please review our
              <a href="/privacy" className="text-accent hover:underline">
                {" "}
                Privacy Policy
              </a>{" "}
              to understand our data practices.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              11. Modifications to Service
            </h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the
              service (or any part thereof) at any time, with or without notice.
              We will not be liable to you or any third party for any
              modification, suspension, or discontinuation of the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the service
              immediately, without prior notice or liability, for any reason,
              including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Breach of these Terms</li>
              <li>Fraudulent, abusive, or illegal activity</li>
              <li>Extended period of inactivity</li>
              <li>Request by law enforcement or government agency</li>
            </ul>
            <p>
              Upon termination, your right to use the service will immediately
              cease. You may request an export of your data within 30 days of
              termination.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">
              13. Governing Law and Dispute Resolution
            </h2>

            <h3 className="text-xl font-semibold">13.1 Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of [Your State/Country], without regard to its conflict
              of law provisions.
            </p>

            <h3 className="text-xl font-semibold">13.2 Dispute Resolution</h3>
            <p>
              Any disputes arising out of or relating to these Terms or the
              service shall be resolved through:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Good faith negotiation between the parties</li>
              <li>Mediation, if negotiation fails</li>
              <li>
                Binding arbitration, if mediation fails (except where prohibited
                by law)
              </li>
            </ol>

            <h3 className="text-xl font-semibold">13.3 Class Action Waiver</h3>
            <p>
              You agree that any proceedings to resolve disputes will be
              conducted on an individual basis and not as a class, consolidated,
              or representative action.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">14. Miscellaneous</h2>

            <h3 className="text-xl font-semibold">14.1 Entire Agreement</h3>
            <p>
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and Daily Diary regarding the
              service.
            </p>

            <h3 className="text-xl font-semibold">14.2 Severability</h3>
            <p>
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will continue in full force and effect.
            </p>

            <h3 className="text-xl font-semibold">14.3 Waiver</h3>
            <p>
              No waiver of any provision of these Terms shall be deemed a
              further or continuing waiver of such provision or any other
              provision.
            </p>

            <h3 className="text-xl font-semibold">14.4 Assignment</h3>
            <p>
              You may not assign or transfer these Terms or your rights under
              them without our prior written consent. We may assign these Terms
              without restriction.
            </p>

            <h3 className="text-xl font-semibold">14.5 Force Majeure</h3>
            <p>
              We shall not be liable for any failure to perform due to causes
              beyond our reasonable control, including but not limited to acts
              of God, war, riot, terrorism, natural disasters, or failures of
              third-party services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">15. Contact Information</h2>
            <p>If you have questions about these Terms, please contact us:</p>
            <div className="bg-muted p-4 rounded-lg">
              <p>
                <strong>Email:</strong> legal@dailydiary.app
              </p>
              <p>
                <strong>Website:</strong> https://dailydiary.app
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">16. Acknowledgment</h2>
            <p>
              BY USING DAILY DIARY, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE
              TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            These Terms of Service were last updated on January 14, 2026.
          </p>
        </div>
      </div>
    </main>
  );
}
