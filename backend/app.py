import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
app = Flask(__name__)
CORS(app)

@app.route('/generation', methods=['POST'])
def gen():
    print("Received request for generation")
    client = Groq(
        api_key= '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'
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
        f"Produce an output JSON format ; for example:\n"
        f'{{"answer": "apple", "image_prompts": ["prompt1", "prompt2", "prompt3", "prompt4"]}}'
    )

    #llm logic here? -Busayo
    # ode -Marvel
    
    # Integrate AI model response by using groq, not grok from XAI, https://console.groq.com/docs/overview || https://console.groq.com/docs/models
    # Install the groq sdk, instantiate a new client, add your api_key and use the client to send the prompt to the model.

    llm_response = {
        topic.capitalize(): {
            "hint": "EXAMPLE",
            "prompts": [
                "A red fruit on a tree branch",
                "A basket of assorted fruits",
                "A teacher's desk with a shiny fruit",
                "A logo with a bite taken out"
            ]
        }
    }

    result = llm_response.get(topic.capitalize())

    if not result:
        return jsonify({"error": "Unknown topic"}), 400
    

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)