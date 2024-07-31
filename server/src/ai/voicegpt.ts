import fetch from "node-fetch";

export async function answerQuestion(input: string): Promise<string> {
  try {
    console.log("Sending request to Hugging Face API...");
    const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Q: ${input}\nA:`,
        parameters: {
          max_length: 500,
          num_return_sequences: 1,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    if (Array.isArray(result) && result.length > 0) {
      let answer = result[0].generated_text.split("A:")[1].trim();
      // Clean up the answer by removing any additional Q: or subsequent text
      answer = answer.split("Q:")[0].trim();
      return answer || "I'm sorry, I couldn't generate a response.";
    } else if (result.error) {
      throw new Error(`API Error: ${result.error}`);
    } else {
      throw new Error("Unexpected API response format");
    }
  } catch (error: any) {
    console.error("Error generating AI response:", error);
    return `Error: ${error.message}`;
  }
}

// We can remove the isQuestion function as it's no longer needed