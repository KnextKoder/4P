import os
import json
from unittest import result
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
from pydantic import BaseModel, Field
from typing import List
app = Flask(__name__)
CORS(app)

class generatedResponse(BaseModel):
    answer: str
    image_prompts: List[str] = Field(..., description="List of image prompts related to the answer")
    
@app.route('/generation', methods=['POST'])
def gen():
    print("Received request for generation")
    client = Groq(
        # api_key= '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'
    )
    
    print("Sending request to Groq model")
    chat_completion = client.chat.completions.create(
        messages=[
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }
        ],
        model="llama-3.3-70b-versatile",
    )

    print("Received response from Groq model")
    print("Response content:", chat_completion.choices[0].message.content)

    incomingData = request.get_json()
    print("Received data:", incomingData)
    topic = incomingData.get('topic')
    difficulty = incomingData.get('difficulty')

    if not topic:
        return jsonify({"error": "Topic required"}), 400
    
    
    prompt = (
        f"You are helping with a 4-Pics-1-Word-type game.\n"
        f"Think of a single English word(which will be the answer) relating to the topic '{topic}' and difficulty '{difficulty}'.\n"
        f"Generate four very distinct image prompts that hint at that word but do not say it directly.\n\n"
        f"Produce an output JSON Object format ; for example:\n"
        f'{{"answer": "apple", "image_prompts": ["prompt1", "prompt2", "prompt3", "prompt4"]}}'
    )

    llm_response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
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


    raw_result = json.loads(llm_response.choices[0].message.content)
    result = generatedResponse.model_validate(raw_result)
    print(result.model_dump_json(indent=2))



    if not result:
        return jsonify({"error": "Unknown topic"}), 400
    

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)