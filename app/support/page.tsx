import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Support & Help</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Creating Your Account</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Click &quot;Sign Up&quot; in the navigation menu</li>
                  <li>Enter your email address and create a strong password</li>
                  <li>Verify your email address (check your inbox)</li>
                  <li>Log in and start writing!</li>
                </ol>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Writing Your First Entry</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>After logging in, you&apos;ll see today&apos;s date displayed</li>
                  <li>Click in the text area and start writing</li>
                  <li>Your entry auto-saves every 2 seconds</li>
                  <li>Click &quot;Save Entry&quot; to manually save</li>
                </ol>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">How secure is my diary?</h3>
                <p>
                  Extremely secure! All diary entries are encrypted with AES-GCM 256-bit encryption 
                  before being saved. This means even we cannot read your entries. Your encryption 
                  keys are stored only on your device.
                </p>
                <Link href="/about" className="text-accent hover:underline text-sm">
                  Learn more about our security →
                </Link>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">Can I edit past entries?</h3>
                <p>
                  You can view past entries, but they are read-only to maintain the integrity of your 
                  journal. Only today&apos;s entry can be edited. Use the calendar or navigation arrows 
                  to view previous days.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">What happens if I clear my browser data?</h3>
                <p>
                  ⚠️ Important: Your encryption keys are stored in your browser&apos;s localStorage. 
                  If you clear browser data, you may lose access to encrypted entries. We recommend 
                  regularly backing up your salt key (see Backup section below).
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">Can I access my diary on multiple devices?</h3>
                <p>
                  Currently, encryption keys are device-specific. You can log in on multiple devices, 
                  but you&apos;ll need to manually transfer your encryption salt to decrypt old entries. 
                  Cross-device sync is planned for a future update.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">How do streaks work?</h3>
                <p>
                  Write at least one entry each day to build your streak! The streak counter shows 
                  how many consecutive days you&apos;ve written. Missing a day will reset your current 
                  streak, but your longest streak is always saved.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">Is there a word limit?</h3>
                <p>
                  No! Write as much or as little as you want. We track word count to help you see 
                  your progress, but there&apos;s no maximum limit.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">Can I export my diary?</h3>
                <p>
                  Export functionality is coming soon! You&apos;ll be able to download all your entries 
                  in a standard format. For now, you can copy and paste entries manually.
                </p>
              </div>

              <div className="border-l-4 border-accent pl-4">
                <h3 className="text-lg font-semibold mb-2">How do I delete my account?</h3>
                <p>
                  Contact us at support@dailydiary.app to request account deletion. All your data 
                  will be permanently deleted within 30 days.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Backup Your Encryption Keys</h2>
            <p className="text-amber-600 dark:text-amber-400 font-semibold">
              ⚠️ Important: Follow these steps to protect your data
            </p>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">How to Backup Your Salt</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Open your diary app</li>
                <li>Open browser Developer Tools (Press F12)</li>
                <li>Go to the Console tab</li>
                <li>Type this command (replace with your user ID):
                  <pre className="bg-background p-3 rounded mt-2 text-sm overflow-x-auto">
                    <code>localStorage.getItem(&apos;diary_salt_YOUR_USER_ID&apos;)</code>
                  </pre>
                </li>
                <li>Save the returned value in a secure location (password manager, encrypted file)</li>
              </ol>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">How to Restore Your Salt</h3>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Open your diary app on the new device/browser</li>
                <li>Open browser Developer Tools (Press F12)</li>
                <li>Go to the Console tab</li>
                <li>Type this command:
                  <pre className="bg-background p-3 rounded mt-2 text-sm overflow-x-auto">
                    <code>localStorage.setItem(&apos;diary_salt_YOUR_USER_ID&apos;, &apos;YOUR_SALT_VALUE&apos;)</code>
                  </pre>
                </li>
                <li>Refresh the page</li>
                <li>Your old entries should now be readable!</li>
              </ol>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Troubleshooting</h2>
            
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">I can&apos;t see my old entries</h3>
                <p className="mb-3">Possible causes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browser data was cleared (encryption salt lost)</li>
                  <li>Accessing from a different device without transferring salt</li>
                  <li>Using a different browser</li>
                </ul>
                <p className="mt-3 font-semibold">Solution:</p>
                <p>If you have a backup of your encryption salt, restore it using the steps above. 
                   If not, unfortunately the encrypted data cannot be recovered.</p>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Auto-save isn&apos;t working</h3>
                <p className="mb-3">Try these steps:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Check your internet connection</li>
                  <li>Refresh the page</li>
                  <li>Clear browser cache and reload</li>
                  <li>Try a different browser</li>
                  <li>Contact support if issue persists</li>
                </ol>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">I forgot my password</h3>
                <p className="mb-3">Steps to reset:</p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Go to the login page</li>
                  <li>Click &quot;Forgot Password?&quot;</li>
                  <li>Enter your email address</li>
                  <li>Check your email for reset instructions</li>
                  <li>Create a new password</li>
                </ol>
                <p className="mt-3 text-sm text-muted-foreground">
                  Note: Your diary entries remain encrypted with your original encryption keys, 
                  so changing your password won&apos;t affect access to your entries.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Best Practices</h2>
            <div className="bg-accent/10 border border-accent p-6 rounded-lg">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Write regularly to build a habit and maintain your streak</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Backup your encryption salt before clearing browser data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Use a strong, unique password for your account</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Log out from shared or public computers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Write honestly - your entries are completely private</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent font-bold">✓</span>
                  <span>Use the calendar to reflect on your progress over time</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Support</h2>
            <p>
              Still need help? We&apos;re here for you!
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-3">
              <p><strong>📧 Email Support:</strong> support@dailydiary.app</p>
              <p><strong>⏱️ Response Time:</strong> Within 24-48 hours</p>
              <p><strong>🔒 Security Issues:</strong> security@dailydiary.app</p>
              <p><strong>💬 General Questions:</strong> hello@dailydiary.app</p>
            </div>
            <p className="text-sm text-muted-foreground">
              When contacting support, please include:
            </p>
            <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
              <li>Your email address (for account-related issues)</li>
              <li>Browser and device type</li>
              <li>Description of the issue</li>
              <li>Steps to reproduce (if applicable)</li>
              <li>Screenshots (if relevant)</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
