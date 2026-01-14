export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-foreground">
          <p className="text-muted-foreground">
            <strong>Last Updated:</strong> January 14, 2026
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              Welcome to Daily Diary ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring the security of your personal information. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you use our diary application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold">2.1 Account Information</h3>
            <p>When you create an account, we collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email address</li>
              <li>Password (encrypted and hashed)</li>
              <li>Account creation date</li>
            </ul>

            <h3 className="text-xl font-semibold">2.2 Diary Content</h3>
            <p>
              <strong>Important:</strong> All diary entries you create are <strong>end-to-end encrypted</strong> 
              using AES-GCM 256-bit encryption before being stored. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your diary content is encrypted on your device before being sent to our servers</li>
              <li>We cannot read, access, or decrypt your diary entries</li>
              <li>Even database administrators cannot view your diary content</li>
              <li>Only you can decrypt and read your entries</li>
            </ul>

            <h3 className="text-xl font-semibold">2.3 Usage Data</h3>
            <p>We collect metadata about your usage, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Entry dates (not the content)</li>
              <li>Word counts per entry</li>
              <li>Login timestamps</li>
              <li>Streak statistics</li>
            </ul>

            <h3 className="text-xl font-semibold">2.4 Technical Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type and version</li>
              <li>Device type</li>
              <li>IP address (for security purposes)</li>
              <li>Session information</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Providing the Service:</strong> To enable you to create, store, and access your diary entries</li>
              <li><strong>Authentication:</strong> To verify your identity and maintain account security</li>
              <li><strong>Statistics:</strong> To show you streak counts and writing statistics</li>
              <li><strong>Security:</strong> To detect and prevent fraud, abuse, and unauthorized access</li>
              <li><strong>Improvements:</strong> To analyze usage patterns and improve our service (using aggregated, anonymized data only)</li>
              <li><strong>Communications:</strong> To send you important service updates and security notifications</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p>We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>End-to-End Encryption:</strong> AES-GCM 256-bit encryption for all diary content</li>
              <li><strong>Key Derivation:</strong> PBKDF2 with 100,000 iterations for encryption keys</li>
              <li><strong>Secure Authentication:</strong> Industry-standard authentication protocols via Supabase</li>
              <li><strong>HTTPS:</strong> All data transmission is encrypted using TLS/SSL</li>
              <li><strong>Database Security:</strong> Encrypted at rest with restricted access controls</li>
              <li><strong>Regular Backups:</strong> Automated backups (your encrypted data remains encrypted in backups)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Storage and Location</h2>
            <p>
              Your data is stored on secure servers provided by Supabase. The data is encrypted at rest 
              and in transit. Your diary content is additionally encrypted end-to-end, meaning it remains 
              encrypted even on our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Data Sharing and Disclosure</h2>
            <p>
              We do <strong>not</strong> sell, trade, or rent your personal information to third parties.
            </p>
            <p>We may share information only in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party service providers (e.g., Supabase for hosting) who are contractually obligated to protect your data</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or legal process</li>
              <li><strong>Safety:</strong> To protect the rights, property, or safety of Daily Diary, our users, or the public</li>
              <li><strong>Business Transfer:</strong> In connection with a merger, acquisition, or sale of assets (users will be notified)</li>
            </ul>
            <p className="font-semibold">
              Note: Even in these circumstances, your diary content remains encrypted and unreadable by us or third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Your Rights and Choices</h2>
            <p>You have the following rights regarding your data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Update or correct your account information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and all associated data</li>
              <li><strong>Export:</strong> Export your diary entries in a standard format</li>
              <li><strong>Opt-Out:</strong> Opt out of non-essential communications</li>
            </ul>
            <p>
              To exercise these rights, please contact us at <strong>privacy@dailydiary.app</strong> 
              (replace with your actual email).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Data Retention</h2>
            <p>We retain your data as follows:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Active Accounts:</strong> Data is retained while your account is active</li>
              <li><strong>Deleted Accounts:</strong> Data is permanently deleted within 30 days of account deletion</li>
              <li><strong>Backups:</strong> Encrypted backups may be retained for up to 90 days for disaster recovery</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Cookies and Tracking</h2>
            <p>We use essential cookies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Authentication and session management</li>
              <li>Security and fraud prevention</li>
              <li>Storing encryption keys locally (localStorage)</li>
            </ul>
            <p>
              We do not use third-party tracking cookies or advertising cookies. You can control cookie 
              preferences through your browser settings, but disabling essential cookies may affect 
              functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Children's Privacy</h2>
            <p>
              Daily Diary is not intended for users under the age of 13 (or 16 in the EU). We do not 
              knowingly collect personal information from children. If you believe we have collected 
              information from a child, please contact us immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. International Users</h2>
            <p>
              If you are accessing Daily Diary from outside the United States, please be aware that your 
              information may be transferred to, stored, and processed in the United States. By using our 
              service, you consent to this transfer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
              Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Email:</strong> privacy@dailydiary.app</p>
              <p><strong>Website:</strong> https://dailydiary.app</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">14. GDPR Compliance (EU Users)</h2>
            <p>For users in the European Union, we comply with GDPR requirements:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Legal Basis:</strong> We process your data based on consent and contractual necessity</li>
              <li><strong>Data Protection Officer:</strong> Contact dpo@dailydiary.app</li>
              <li><strong>Right to Complaint:</strong> You have the right to lodge a complaint with your local data protection authority</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">15. California Privacy Rights (CCPA)</h2>
            <p>California residents have additional rights under the CCPA:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Right to know what personal information is collected</li>
              <li>Right to know if personal information is sold or disclosed</li>
              <li>Right to opt-out of sale of personal information (we do not sell your information)</li>
              <li>Right to deletion of personal information</li>
              <li>Right to non-discrimination for exercising your rights</li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            By using Daily Diary, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
