let selectedSegmentIndex = -1;
let theWheel;
const messageModal = document.querySelector('#messageModal');
const messageText = document.querySelector('#messageText');
let segments = [
  { fillStyle: '#ee1c24', text: '1', message: 'this is message 01' },
  { fillStyle: '#3cb878', text: '2', message: 'this is message 02' },
  { fillStyle: '#f6989d', text: '3', message: 'this is message 03' },
  { fillStyle: '#00aef0', text: '4', message: 'this is message 04' },
  { fillStyle: '#f26522', text: '5', message: 'this is message 05' },
  { fillStyle: '#e70697', text: '6', message: 'this is message 06' },
  { fillStyle: '#fff200', text: '7', message: 'this is message 07' },
  { fillStyle: '#f6985c', text: '8', message: 'this is message 08' },
  { fillStyle: '#ee1c74', text: '9', message: 'this is message 09' },
  { fillStyle: '#3cb887', text: '10', message: 'this is message 10' },
  { fillStyle: '#f26225', text: '11', message: 'this is message 11' },
  { fillStyle: '#a186be', text: '12', message: 'this is message 12' },
  { fillStyle: '#fff2cc', text: '13', message: 'this is message 13' },
  { fillStyle: '#00ae1b', text: '14', message: 'this is message 14' },
  { fillStyle: '#ee1c49', text: '15', message: 'this is message 15' },
  { fillStyle: '#f6982c', text: '16', message: 'this is message 16' },
  { fillStyle: '#f265bb', text: '17', message: 'this is message 17' },
  { fillStyle: '#3cb8aa', text: '18', message: 'this is message 18' },
  { fillStyle: '#a18689', text: '19', message: 'this is message 19' },
  { fillStyle: '#fff2a8', text: '20', message: 'this is message 20' },
];
// Create new wheel object specifying the parameters at creation time.
theWheel = new Winwheel({
  outerRadius: 212, // Set outer radius so wheel fits inside the background.
  innerRadius: 75, // Make wheel hollow so segments don't go all way to center.
  textFontSize: 24, // Set default font size for the segments.
  textOrientation: 'vertical', // Make text vertial so goes down from the outside of wheel.
  textAlignment: 'outer', // Align text to outside of wheel.
  numSegments: segments.length, // Specify number of segments.
  // Define segments including colour and text.
  segments: segments,
  // Specify the animation to use.
  animation: {
    type: 'spinToStop',
    duration: 10, // Duration in seconds.
    spins: 3, // Default number of complete spins.
    callbackFinished: alertPrize,
    callbackSound: playSound, // Function to call when the tick sound is to be triggered.
    soundTrigger: 'pin', // Specify pins are to trigger the sound, the other option is 'segment'.
  },
  // Turn pins on.
  pins: {
    number: segments.length,
    fillStyle: 'silver',
    outerRadius: 4,
  },
});

// Loads the tick audio sound in to an audio object.
let audio = new Audio('sounds/tick.mp3');
let clappingSound = new Audio('sounds/claping_sms.mp3');
// This function is called when the sound is to be played.
function playSound() {
  // Stop and rewind the sound if it already happens to be playing.
  audio.pause();
  audio.currentTime = 0;

  // Play the sound.
  audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower = 0;
let wheelSpinning = false;
// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
  // Ensure that spinning can't be clicked again while already running.
  if (wheelSpinning == false) {
    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
    // to rotate with the duration of the animation the quicker the wheel spins.
    if (wheelPower == 1) {
      theWheel.animation.spins = 3;
    } else if (wheelPower == 2) {
      theWheel.animation.spins = 6;
    } else if (wheelPower == 3) {
      theWheel.animation.spins = 10;
    }

    // Disable the spin button so can't click again while wheel is spinning.
    document.getElementById('spin_button').src = 'images/spin_off.png';
    document.getElementById('spin_button').className = '';

    // Begin the spin animation by calling startAnimation on the wheel object.
    theWheel.startAnimation();

    // Set to true so that power can't be changed and spin button re-enabled during
    // the current animation. The user will have to reset before spinning again.
    wheelSpinning = true;
  }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
  theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
  if (theWheel.numSegments == 1) {
    window.location = './result.html';
  }
  hideMessage();
  theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.r

  theWheel.deleteSegment(selectedSegmentIndex);
  theWheel.pins.number = theWheel.numSegments;
  theWheel.draw(); // Call draw to render changes to the wheel.
  wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
  selectedSegmentIndex = theWheel.segments.findIndex(
    (s) => s?.text == indicatedSegment.text
  );
  showMessage(indicatedSegment.message);
}

function showMessage(message) {
  messageText.innerHTML = message;
  messageModal.style = 'display: block;';
  clappingSound.play();
}

function hideMessage() {
  messageModal.style = 'display: none;';
  clappingSound.pause();
  clappingSound.currentTime = 0;
}
