export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">About Daily Diary</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-lg">
              Daily Diary is built on the belief that everyone deserves a private, secure space to 
              express their thoughts, track their personal growth, and reflect on their experiences.
            </p>
            <p>
              In an age where data privacy is increasingly important, we provide a journaling platform 
              that puts security first. Your thoughts are yours alone, and they should stay that way.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What Makes Us Different</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  🔒 End-to-End Encryption
                </h3>
                <p>
                  Your diary entries are encrypted on your device before being sent to our servers. 
                  We literally cannot read your diary - and that&apos;s by design.
                </p>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  🎯 Focus on Writing
                </h3>
                <p>
                  Clean, distraction-free interface that lets you focus on what matters: writing and 
                  reflecting on your day.
                </p>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  📊 Progress Tracking
                </h3>
                <p>
                  Track your writing streaks, word counts, and build a consistent journaling habit 
                  over time.
                </p>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  📅 Calendar View
                </h3>
                <p>
                  Visualize your journaling journey with an intuitive calendar that shows when you&apos;ve 
                  written and lets you revisit past entries.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Technology</h2>
            <p>
              Daily Diary is built with modern, secure technologies:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>AES-GCM 256-bit Encryption:</strong> Military-grade encryption for your diary content</li>
              <li><strong>PBKDF2 Key Derivation:</strong> 100,000 iterations to protect your encryption keys</li>
              <li><strong>Next.js:</strong> Fast, modern web framework for optimal performance</li>
              <li><strong>Supabase:</strong> Reliable, secure database infrastructure</li>
              <li><strong>Web Crypto API:</strong> Browser-native encryption for maximum security</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Privacy First</h2>
            <p>
              We believe your diary should be yours alone. That&apos;s why we:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Never read your diary entries (we can&apos;t - they&apos;re encrypted!)</li>
              <li>Never sell your data to third parties</li>
              <li>Never use your content for advertising or marketing</li>
              <li>Only collect minimal metadata necessary for the app to function</li>
              <li>Keep your encryption keys on your device, not our servers</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">The Benefits of Journaling</h2>
            <p>
              Research shows that regular journaling can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Reduce stress and anxiety</li>
              <li>Improve mental clarity and focus</li>
              <li>Help process emotions and experiences</li>
              <li>Track personal growth over time</li>
              <li>Boost creativity and problem-solving skills</li>
              <li>Improve memory and comprehension</li>
              <li>Enhance self-awareness and emotional intelligence</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Commitment</h2>
            <p>
              We are committed to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Security:</strong> Continuously improving our security measures and staying up-to-date with best practices</li>
              <li><strong>Privacy:</strong> Never compromising on user privacy, even if pressured</li>
              <li><strong>Transparency:</strong> Being open about our practices and how we handle data</li>
              <li><strong>Simplicity:</strong> Keeping the app focused and easy to use</li>
              <li><strong>Reliability:</strong> Maintaining high uptime and data integrity</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Open Source</h2>
            <p>
              We believe in transparency. Our encryption implementation and core security features are 
              open for review. Security researchers and developers can examine our code to verify our 
              security claims.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              We love hearing from our users. Whether you have questions, feedback, or just want to 
              share your journaling journey, we&apos;re here to listen.
            </p>
            <div className="bg-muted p-6 rounded-lg space-y-2">
              <p><strong>General Inquiries:</strong> hello@dailydiary.app</p>
              <p><strong>Support:</strong> support@dailydiary.app</p>
              <p><strong>Privacy Questions:</strong> privacy@dailydiary.app</p>
              <p><strong>Security Issues:</strong> security@dailydiary.app</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Start Your Journey</h2>
            <p className="text-lg">
              Ready to start journaling? <a href="/auth/sign-up" className="text-accent hover:underline font-semibold">Create your account</a> and 
              begin your private, encrypted diary today. Your thoughts deserve a safe home.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
