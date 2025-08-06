import os
import json
from unittest import result
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from pydantic import BaseModel, Field
from typing import List
import asyncio
import concurrent.futures
from func.image_gen import generate_images
app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

class generatedResponse(BaseModel):
    answer: str
    image_prompts: List[str] = Field(..., description="List of image prompts related to the answer")
    image_paths: List[str] = Field(default=[], description="List of paths to generated images")
    educational_fact: str = Field(..., description="A short educational fact about the answer")
    
client = Groq(
    api_key= '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'
)
@app.route('/generation', methods=['POST'])
def gen():
    print("Received request for generation")
    
    incomingData = request.get_json()
    print("Received data:", incomingData)
    
    topic = incomingData.get('topic')
    difficulty = incomingData.get('difficulty')
    
    print("Sending request to Groq model")
    
    if not topic:
        return jsonify({"error": "Topic required"}), 400
    
    prompt = (
        f"You are helping with a 4-Pics-1-Word-type game.\n"
        f"Think of a single English word(which will be the answer) relating to the topic '{topic}' and difficulty '{difficulty}'.\n"
        f"Generate four very distinct image prompts that hint at that word but do not say it directly.\n"
        f"Also provide a short educational fact about the word (1-2 sentences) that teaches something interesting.\n\n"
        f"Produce an output JSON Object format ; for example:\n"
        f'{{"answer": "apple", "image_prompts": ["prompt1", "prompt2", "prompt3", "prompt4"], "educational_fact": "Apples belong to the rose family and there are over 7,500 varieties worldwide. They float in water because they are 25% air!"}}'
    )

    llm_response = client.chat.completions.create(
        model="moonshotai/kimi-k2-instruct",
        messages=[
            {
                "role": "system",
                "content": "You are an AI assistant helping with with a 4-Pics-1-Word-type game."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "generated_response",
                "schema": generatedResponse.model_json_schema()
            }
        }
    )
    print("Received response from Groq model")
    
    print("Response content:", llm_response.choices[0].message.content)
    content = llm_response.choices[0].message.content
    
    if content is None:
        return jsonify({"error": "No content returned from model"}), 500

    raw_result = json.loads(content)
    result = generatedResponse.model_validate(raw_result)
    print(result.model_dump_json(indent=2))

    # Generate images in parallel
    print("Generating images for prompts...")
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        # Submit all image generation tasks
        future_to_prompt = {}
        for i, prompt in enumerate(result.image_prompts):
            filename = f"{result.answer}_{i+1}.png"
            future = executor.submit(generate_images, prompt, filename)
            future_to_prompt[future] = prompt
        
        # Collect results
        image_paths = []
        for future in concurrent.futures.as_completed(future_to_prompt):
            prompt = future_to_prompt[future]
            try:
                filename = future.result()
                if filename:
                    image_paths.append(filename)
                    print(f"Generated image for prompt: {prompt[:50]}...")
                else:
                    print(f"Failed to generate image for prompt: {prompt[:50]}...")
            except Exception as e:
                print(f"Error generating image for prompt '{prompt[:50]}...': {e}")
    
    # Update the result with image paths
    result.image_paths = image_paths

    if not result:
        return jsonify({"error": "Unknown topic"}), 400
    

    return jsonify(result.model_dump())

if __name__ == '__main__':
    app.run(debug=True)