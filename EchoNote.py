from flask import Flask, render_template, request, redirect, url_for, flash
from werkzeug.utils import secure_filename
import note_summary
import whisper
import os

app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'static/audio'

@app.route('/')
def index():
    return render_template("index.html", summary="", transcription="")

@app.route("/summary", methods=["POST"])
def summary():
    transcript = request.form['transcript'] 
    summary = note_summary.get_summary(transcript) 
    return render_template("index.html", summary=summary, transcription="")

@app.route("/summaryVoice", methods=["POST"])
def summaryVoice():
    transcript = request.form['transcriptVoice'] 
    summary = note_summary.get_summary(transcript) 
    return render_template("index.html", summary=summary, transcription="")

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audioFileInput' not in request.files:
        flash('No file part')
        return redirect(request.url)

    file = request.files['audioFileInput']

    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)

    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        model = whisper.load_model("base")
        transcript = model.transcribe(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        return render_template("index.html", summary="", transcription=transcript["text"])

    flash('Invalid file type. Please upload an MP3 file.')
    return redirect(request.url)


if __name__ == '__main__':
    app.run(debug=True)