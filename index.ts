import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ExtractionRequest {
  fileData?: string;
  category: string;
  fileName: string;
  mimeType?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { fileData, category, fileName, mimeType }: ExtractionRequest = await req.json();

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not configured");
    }

    // Build extraction prompt based on category
    const extractionPrompt = buildExtractionPrompt(category, fileName);

    // For image files, use GPT-4o vision capability
    const isImage = mimeType && mimeType.startsWith('image/');

    let messages: any[];

    if (isImage && fileData) {
      messages = [
        {
          role: "system",
          content: "You are a document extraction assistant. Extract structured data from documents and return ONLY valid JSON. Never hallucinate data. If a field cannot be determined, leave it empty.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: extractionPrompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${fileData}`,
              },
            },
          ],
        },
      ];
    } else {
      // For PDFs or when no file data, just use the prompt
      messages = [
        {
          role: "system",
          content: "You are a document extraction assistant. Extract structured data from documents and return ONLY valid JSON. Never hallucinate data. If a field cannot be determined, leave it empty.",
        },
        {
          role: "user",
          content: extractionPrompt,
        },
      ];
    }

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: messages,
        temperature: 0.1,
        response_format: { type: "json_object" },
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI error:", errorText);
      throw new Error("Failed to extract data from document");
    }

    const openaiData = await openaiResponse.json();
    const extractedText = openaiData.choices[0]?.message?.content;

    if (!extractedText) {
      throw new Error("No extraction result from OpenAI");
    }

    // Parse the JSON response
    const extractedData = JSON.parse(extractedText);

    return new Response(
      JSON.stringify({
        success: true,
        extractedData: extractedData,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Extraction error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        extractedData: {},
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function buildExtractionPrompt(category: string, fileName: string): string {
  const baseInstructions = `
You are analyzing a document for a UK-based complaint/appeal letter service.
Document name: ${fileName}
Category: ${category}

Extract the following fields if they are clearly visible in the document.
NEVER guess or hallucate. If unsure, leave the field empty.
Return ONLY valid JSON with the extracted fields.
`;

  const categoryFields: Record<string, string> = {
    parking: `
{
  "full_name": "",
  "email": "",
  "phone": "",
  "address": "",
  "postcode": "",
  "pcn_number": "",
  "vehicle_registration": "",
  "incident_date": "",
  "issue_date": "",
  "location": "",
  "issuing_authority": "",
  "deadline_date": ""
}

Extract: PCN number, vehicle registration, dates, location, issuing authority/council name, person's contact details.`,

    refund: `
{
  "full_name": "",
  "email": "",
  "phone": "",
  "address": "",
  "postcode": "",
  "company_name": "",
  "order_number": "",
  "purchase_date": "",
  "product_name": "",
  "amount_paid": "",
  "payment_method": "",
  "refund_requested_date": ""
}

Extract: Company name, order number, purchase date, product/service name, amount paid, payment method, person's contact details.`,

    landlord: `
{
  "full_name": "",
  "email": "",
  "phone": "",
  "address": "",
  "postcode": "",
  "rental_address": "",
  "landlord_name": "",
  "tenancy_start_date": "",
  "issue_start_date": "",
  "main_issue_type": ""
}

Extract: Rental property address, landlord/agent name, tenancy dates, issue dates, person's contact details.`,

    utility: `
{
  "full_name": "",
  "email": "",
  "phone": "",
  "address": "",
  "postcode": "",
  "utility_provider": "",
  "account_number": "",
  "bill_reference": "",
  "issue_date": "",
  "amount_disputed": ""
}

Extract: Utility provider name, account number, bill reference, dates, disputed amount, person's contact details.`,

    employer: `
{
  "full_name": "",
  "email": "",
  "phone": "",
  "address": "",
  "postcode": "",
  "employer_name": "",
  "job_title": "",
  "manager_name": "",
  "employment_start_date": "",
  "incident_date": ""
}

Extract: Employer/company name, job title, manager/HR name, employment dates, incident date, person's contact details.`,

    consumer: `
{
  "full_name": "",
  "email": "",
  "phone": "",
  "address": "",
  "postcode": "",
  "trader_name": "",
  "order_reference": "",
  "purchase_date": "",
  "item_service": "",
  "amount_paid": ""
}

Extract: Trader/business name, order reference, purchase date, item/service description, amount paid, person's contact details.`,
  };

  const categoryPrompt = categoryFields[category] || categoryFields.consumer;

  return baseInstructions + categoryPrompt;
}
