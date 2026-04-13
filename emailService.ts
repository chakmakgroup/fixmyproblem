interface SendLetterEmailRequest {
  to: string;
  customerName: string;
  letterText: string;
  pdfBase64: string;
}

export const emailService = {
  async sendLetterEmail(request: SendLetterEmailRequest): Promise<{ success: boolean; emailId?: string }> {
    console.log('=== EMAIL SERVICE: Calling Supabase Edge Function ===');

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-letter-email`;
    console.log('URL:', url);
    console.log('Request payload:', {
      to: request.to,
      customerName: request.customerName,
      letterTextLength: request.letterText.length,
      pdfBase64Length: request.pdfBase64.length,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(request),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('=== EMAIL SERVICE ERROR ===');
      console.error('Status:', response.status);
      console.error('Error text:', errorText);
      throw new Error(`Failed to send email: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('=== EMAIL SERVICE SUCCESS ===');
    console.log('Response data:', result);

    return result;
  },
};
