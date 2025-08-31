from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)  # Allow requests from frontend

# Dictionary of services with their corresponding URLs and a brief description for the user
services_with_urls = {
    "1": {"name": "🧠 Track My Feelings", "url": "mood-tracker.html", "description": "Helps you log and understand your emotional state."},
    "2": {"name": "📓 My Safe Journal", "url": "journal.html", "description": "A private space for your thoughts and reflections."},
    "3": {"name": "💕 Self-Care Dashboard", "url": "selfcare.html", "description": "Tools and activities to help you relax and recharge."},
    "4": {"name": "📖 Mindful Guidance", "url": "therapists.html", "description": "Guidance and information on mental well-being."},
    "5": {"name": "🔢 Mental Health Check", "url": "test-depression.html", "description": "A quick self-assessment for depression."},
    "6": {"name": "⚡ Test Anxiety", "url": "test-anxiety.html", "description": "Assess your anxiety levels and get tips to cope."},
    "7": {"name": "🎶 Soothing Sounds", "url": "relax.html", "description": "A collection of calming sounds to help you relax."},
    "8": {"name": "🚀 Motivational Boost", "url": "motivational-boost.html", "description": "Get a dose of motivation to lift your spirits."}
}

# The initial options presented to the user
initial_options = [
    {"name": "See Services", "action": "show_services"},
    {"name": "Talk to Elpis", "action": "show_talk_options"}
]

# Options for the "Talk to Elpis" path
talk_options_with_urls = [
    {"name": "🌍 Nearby Therapists", "url": "#footer"},
    {"name": "☎️ Talk Helpline", "url": "#footer"}
]

@app.route("/")
def serve_homepage():
    # This route will serve your main homepage.html file
    return send_from_directory('.', 'homepage.html')

@app.route("/<path:path>")
def serve_static(path):
    # This route serves all other static files like CSS, JS, etc.
    if not os.path.isfile(path):
        return "File not found", 404
    return send_from_directory('.', path)

@app.route("/chat", methods=["POST"])
def chat():
    """
    Handles chatbot conversation flow.
    The frontend sends a 'message' and a 'state'.
    The 'state' is used to track the conversation.
    """
    data = request.json
    user_message = data.get("message", "").lower()
    session_state = data.get("state", {})
    
    # Simple state machine to manage conversation
    current_state = session_state.get("current_state", "start")

    if current_state == "start":
        return jsonify({
            "reply": "Hello! I am Elpis. How can I help you today?",
            "options": [opt["name"] for opt in initial_options],
            "state": {"current_state": "awaiting_initial_choice"}
        })

    elif current_state == "awaiting_initial_choice":
        if "see services" in user_message:
            services = [{"name": s["name"], "description": s["description"], "url": s["url"]} for s in services_with_urls.values()]
            return jsonify({
                "reply": "Here are the services I can help you with:",
                "options": [s["name"] for s in services],
                "services": services,
                "state": {"current_state": "awaiting_service_choice"}
            })
        elif "talk to elpis" in user_message:
            return jsonify({
                "reply": "I can connect you to resources.",
                "options": [item["name"] for item in talk_options_with_urls],
                "services": talk_options_with_urls, # use 'services' key to be consistent with frontend logic
                "state": {"current_state": "awaiting_talk_choice"}
            })
        else:
            return jsonify({
                "reply": "Sorry, I didn't understand. Please choose from the options.",
                "options": [opt["name"] for opt in initial_options],
                "state": {"current_state": "awaiting_initial_choice"}
            })
    
    elif current_state in ["awaiting_service_choice", "awaiting_talk_choice"]:
        all_options = services_with_urls.values()
        if current_state == "awaiting_talk_choice":
            all_options = talk_options_with_urls
        
        for option in all_options:
            if option["name"].lower() == user_message:
                return jsonify({
                    "reply": f"Redirecting you to {option['name']}...",
                    "redirect": option["url"],
                    "state": {}  # Reset state after redirection
                })
        
        return jsonify({
            "reply": "Sorry, I didn't find that option. Please try again.",
            "state": session_state
        })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
