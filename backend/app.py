from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/generation', methods=['POST'])
def gen():
    incomingData = request.get_json()
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

    llm_response = {}

    result = llm_response.get(topic.capitalize())

    if not result:
        return jsonify({"error": "Unknown topic"}), 400
    

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)