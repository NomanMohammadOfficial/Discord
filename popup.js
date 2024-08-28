const dateInput = document.getElementById('d');
const timeInput = document.getElementById('hm');
const typeInput = document.getElementById('t');
const output = document.getElementById('code');
const copy = document.getElementById('copy');
const current = document.getElementById('current');
const preview = document.getElementById('preview');
const alertBox = document.createElement('div');

// Create and style the alert box
alertBox.id = 'dtg-alert';
alertBox.textContent = 'Timestamp copied to clipboard!';
document.body.appendChild(alertBox);

function showCopyAlert() {
    alertBox.classList.add('show');
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 2000);
}

function updateOutput() {
    const dateValue = dateInput.value; // YYYY-MM-DD format
    const timeValue = timeInput.value; // HH:MM format

    // Combine date and time into a Date object
    const dateTimeString = `${dateValue}T${timeValue}:00`;
    const selectedDate = new Date(dateTimeString);

    // Check if the selectedDate is valid
    if (isNaN(selectedDate.getTime())) {
        preview.textContent = 'Invalid Date or Time';
        output.value = '';
        return;
    }

    // Convert to UNIX timestamp
    const unixTimestamp = Math.floor(selectedDate.getTime() / 1000);
    const formattedCode = `<t:${unixTimestamp}:${typeInput.value}>`;
    output.value = formattedCode;

    // Update preview text
    if (typeInput.value === 'R') {
        const now = new Date();
        const diff = Math.round((now - selectedDate) / 1000);
        preview.textContent = diff > 0 ? `${diff} seconds ago` : `in ${-diff} seconds`;
    } else {
        preview.textContent = new Intl.DateTimeFormat('en', {
            dateStyle: ['D', 'f', 'F'].includes(typeInput.value) ? 'long' : 'short',
            timeStyle: ['T', 'f', 'F'].includes(typeInput.value) ? 'short' : undefined,
        }).format(selectedDate);
    }
}

function setCurrentTime() {
    const now = new Date();
    dateInput.value = now.toISOString().slice(0, 10); // YYYY-MM-DD
    timeInput.value = now.toISOString().slice(11, 16); // HH:MM
    updateOutput();
}

function promptForReview() {
    // Check if the user has already been prompted
    const reviewPromptKey = 'reviewPromptShown';
    const promptShown = localStorage.getItem(reviewPromptKey);

    // Only show the prompt if not already shown
    if (!promptShown) {
        // Display a review prompt with a confirmation dialog
        if (confirm("If you like this extension, please consider leaving a rating and review on the Chrome Web Store. It helps us a lot!")) {
            window.open('https://chrome.google.com/webstore/detail/', '_blank');
        }
        // Mark as shown
        localStorage.setItem(reviewPromptKey, 'true');
    }
}

// Update output and show the review prompt after successful copy
copy.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(output.value);
        showCopyAlert(); // Show the alert when copied
        promptForReview(); // Show the review prompt after copying
    } catch (error) {
        console.error('Failed to copy text:', error);
    }
});

dateInput.addEventListener('input', updateOutput);
timeInput.addEventListener('input', updateOutput);
typeInput.addEventListener('change', updateOutput);
current.addEventListener('click', setCurrentTime);

window.onload = setCurrentTime;
