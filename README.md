# Item Researcher

Research appliances and electronics — get specifications, estimated age, original pricing, and current replacement costs from major retailers.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Anthropic API key:
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your API key
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## How It Works

Enter any combination of brand, model number, serial number, category, or description. The system uses AI-powered research to provide:

- **Item description** and key specifications
- **Estimated age** with sourcing methodology (serial number decoding, release date research, etc.)
- **Original MSRP** when the item was introduced
- **Current replacement costs** from major retailers (Best Buy, Lowe's, Home Depot, Walmart, Amazon, manufacturer stores)

When insufficient information is provided, results are marked with confidence levels and suggestions for improving accuracy.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anthropic Claude API](https://docs.anthropic.com/) for item research
