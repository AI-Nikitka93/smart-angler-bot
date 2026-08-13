import subprocess
import os
import time

print("Installing npm dependencies...")
subprocess.run(["npm", "install"], check=True)

print("Building the bot...")
subprocess.run(["npm", "run", "build"], check=True)

print("Starting the Node.js bot in the background...")
# Run the node app in the background
bot_process = subprocess.Popen(["npm", "run", "start"])

# Start a minimal Gradio UI on port 7860 to satisfy Hugging Face's requirement
import gradio as gr

def status():
    return "Smart Angler Bot 2026 is RUNNING 24/7!"

with gr.Blocks() as demo:
    gr.Markdown("# 🎣 Smart Angler Bot 2026")
    gr.Markdown("The Telegram bot is currently running in the background.")
    status_btn = gr.Button("Check Status")
    status_out = gr.Textbox()
    status_btn.click(status, outputs=status_out)

# Launch Gradio on the port expected by Hugging Face
demo.launch(server_name="0.0.0.0", server_port=7860)
