import { Component, OnInit, signal } from '@angular/core';

interface Scripture {
  quote: string;
  reference: string;
}

@Component({
  selector: 'app-daily-scripture',
  template: `
    <section class="daily-scripture">
      <div class="scripture-container" [class.visible]="isVisible()">
        <div class="scripture-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-icon"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
          <span>Daily Scripture</span>
        </div>
        <blockquote class="scripture-quote">
          "{{ currentScripture().quote }}"
        </blockquote>
        <p class="scripture-reference">— {{ currentScripture().reference }}</p>
      </div>
    </section>
  `,
  styles: [`
    .daily-scripture {
      background-color: #fafaf8;
      padding: 6rem 1.5rem;
      text-align: center;
      min-height: 400px;
      display: flex;
      align-items: center;
    }

    .scripture-container {
      max-width: 900px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      opacity: 0;
      transform: translateY(10px);
      transition: all 1s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .scripture-container.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .scripture-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #f1f0eb;
      padding: 0.5rem 1.25rem;
      border-radius: 9999px;
      margin-bottom: 2.5rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #334155;
      border: 1px solid #e5e0d5;
    }

    .badge-icon {
      color: #c9a84c;
    }

    .scripture-quote {
      font-family: 'Playfair Display', serif;
      font-size: 2.8rem;
      line-height: 1.2;
      color: #1e293b;
      margin-bottom: 2rem;
      font-weight: 700;
      font-style: italic;
    }

    .scripture-reference {
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #c9a84c;
    }

    @media (max-width: 768px) {
      .scripture-quote {
        font-size: 1.8rem;
      }
      .daily-scripture { padding: 4rem 1.5rem; }
    }
  `]
})
export class DailyScriptureComponent implements OnInit {
  private scriptures: Scripture[] = [
    { quote: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", reference: "Jeremiah 29:11" },
    { quote: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.", reference: "Psalm 23:1-2" },
    { quote: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", reference: "Proverbs 3:5-6" },
    { quote: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary.", reference: "Isaiah 40:31" },
    { quote: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
    { quote: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", reference: "Joshua 1:9" },
    { quote: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", reference: "Romans 8:28" },
    { quote: "Commit to the Lord whatever you do, and he will establish your plans.", reference: "Proverbs 16:3" },
    { quote: "The Lord is close to the brokenhearted and saves those who are crushed in spirit.", reference: "Psalm 34:18" },
    { quote: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", reference: "Philippians 4:6" },
    { quote: "Give thanks to the Lord, for he is good; his love endures forever.", reference: "Psalm 107:1" },
    { quote: "As for me and my house, we will serve the Lord.", reference: "Joshua 24:15" },
    { quote: "Rejoice always, pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.", reference: "1 Thessalonians 5:16-18" },
    { quote: "The Lord is my light and my salvation—whom shall I fear? The Lord is the stronghold of my life—of whom shall I be afraid?", reference: "Psalm 27:1" },
    { quote: "Let everything that has breath praise the Lord.", reference: "Psalm 150:6" },
    { quote: "He heals the brokenhearted and binds up their wounds.", reference: "Psalm 147:3" },
    { quote: "The name of the Lord is a fortified tower; the righteous run to it and are safe.", reference: "Proverbs 18:10" },
    { quote: "Casting all your anxieties on him, because he cares for you.", reference: "1 Peter 5:7" },
    { quote: "Great is your faithfulness.", reference: "Lamentations 3:23" },
    { quote: "In the same way, let your light shine before others, that they may see your good deeds and glorify your Father in heaven.", reference: "Matthew 5:16" },
    { quote: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", reference: "Matthew 6:33" },
    { quote: "I have hidden your word in my heart that I might not sin against you.", reference: "Psalm 119:11" },
    { quote: "God is our refuge and strength, an ever-present help in trouble.", reference: "Psalm 46:1" },
    { quote: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.", reference: "Ephesians 4:32" },
    { quote: "The Lord our God, the Lord is one. Love the Lord your God with all your heart and with all your soul and with all your mind and with all your strength.", reference: "Mark 12:29-30" },
    { quote: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.", reference: "Colossians 3:23" },
    { quote: "Blessed are the peacemakers, for they will be called children of God.", reference: "Matthew 5:9" },
    { quote: "Your word is a lamp for my feet, a light on my path.", reference: "Psalm 119:105" },
    { quote: "Draw near to God, and he will draw near to you.", reference: "James 4:8" },
    { quote: "Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.", reference: "Galented 6:9" },
    { quote: "This is the day the Lord has made; let us rejoice and be glad in it.", reference: "Psalm 118:24" }
  ];

  currentScripture = signal<Scripture>(this.scriptures[0]);
  isVisible = signal(false);

  ngOnInit() {
    this.selectDailyScripture();
    
    // Smooth entrance
    setTimeout(() => {
      this.isVisible.set(true);
    }, 100);
  }

  private selectDailyScripture() {
    const today = new Date();
    // Get day of year to ensure same scripture all day
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Select from list based on day
    const index = dayOfYear % this.scriptures.length;
    this.currentScripture.set(this.scriptures[index]);
  }
}
