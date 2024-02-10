process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fetchQuoteFromGemini() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "Generate a random quote."

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log("text", text);
  return text;
}


async function fetchRandomQuoteFromTheySaidSo() {
  try {
    const response = await fetch(`https://quotes.rest/quote/random.json?api_key=${process.env.THEY_SAID_SO_API_KEY}`);
    const data = await response.json();
    return data.contents.quotes[0].quote;
  } catch (error) {
    console.error('Error fetching quote:', error);
  }
};

async function fetchRandomQuotes() {
  const url = 'http://quotes.rest/quote/random.json';
  const headers = new Headers({
    'X-TheySaidSo-Api-Secret': process.env.THEY_SAID_SO_API_KEY
  });

  return fetch(url, {
    method: 'GET',
    headers: headers
  })
    .then(response => {
      console.log(response);
      console.log(response.json);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data.contents;
    })
    .catch(error => {
      console.error('There was a problem fetching the quote:', error);
    });
}

async function fetchQuotesFromQuotable() {
  const url = 'https://api.quotable.io/random';
  const options = { method: 'GET' };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error(error);
  }
}


async function fetchQuotesfromOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = "Generate a random quote.";
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 50,
      temperature: 0.7,
      stop: '\n'
    })
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);
    const data = await response.json();
    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating quote:', error);
    return null;
  }
}


export default async function QuotesPage() {
  const quote = await fetchQuotesFromQuotable();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md px-4 py-8 bg-white shadow-lg rounded-lg">
        <p className="text-lg font-medium text-gray-800">{quote}</p>
      </div>
    </div>
  )

}