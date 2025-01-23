from transformers import GPT2LMHeadModel, GPT2Tokenizer
import sys

def generate_text(prompt):
    model_name = "gpt2"  # Or "distilgpt2" for a lighter model
    model = GPT2LMHeadModel.from_pretrained(model_name)
    tokenizer = GPT2Tokenizer.from_pretrained(model_name)
    
    # Encode input prompt
    input_ids = tokenizer.encode(prompt, return_tensors="pt")
    
    # Generate text
    output = model.generate(input_ids, max_length=150, num_return_sequences=1)
    
    # Decode the output
    generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
    
    return generated_text

if __name__ == "__main__":
    prompt = sys.argv[1]
    print(generate_text(prompt))
