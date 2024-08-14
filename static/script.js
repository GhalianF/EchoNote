


  //runs();

  

function printDiv(contents){
    let originalContents = document.body.innerHTML;
    let textContents = document.getElementById(contents).value;

    document.body.innerHTML = document.getElementById(contents).value;

    window.print();

    document.body.innerHTML = originalContents;
    document.getElementById(contents).value = textContents;

    console.log(document.getElementById(contents).value);

}



function copyOutput(contents, id){
    console.log("copied!");
    var copyText = document.getElementById(contents);
    copyText.select();
    copyText.setSelectionRange(0, 9999999);
    navigator.clipboard.writeText(copyText.value);
    document.getElementById(id).innerText = "Copied!"
    setTimeout(() => (document.getElementById(id).innerText = "Copy to clipboard"), 3000);
}

var resultText = document.getElementById('resultTextbox');
var startButton = document.getElementById('start-button');
var stopButton = document.getElementById('stop-button');
var recognition;



function startRecognition() {
    recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', function (e) {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join(' ');

        resultText.value = transcript;
        console.log("hi " + resultText.value);
    });

    recognition.addEventListener('end', function () {
        // Restart recognition after a short delay
        setTimeout(() => {
            if (!recognition.aborted) {
                recognition.start();
            }
        }, 50000);
    });

    recognition.addEventListener('error', function (e) {
        console.error('Speech recognition error:', e.error);
        // Handle error gracefully, you can choose to restart recognition here if needed
    });

    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.aborted = true; // Flag to prevent automatic restart
        recognition.stop();
    }
}

startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);
