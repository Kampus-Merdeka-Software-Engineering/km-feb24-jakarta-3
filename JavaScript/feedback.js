document.querySelector('.feedbackContent').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get feedback value
    const feedback = document.getElementById('feedback').value;

    // Ensure feedback is not empty
    if (feedback.trim() === "") {
        alert("Please provide feedback before submitting.");
        return;
    }

    // Save feedback to local storage
    let feedbackList = JSON.parse(localStorage.getItem('feedbackList')) || [];
    feedbackList.push(feedback);
    localStorage.setItem('feedbackList', JSON.stringify(feedbackList));

    // Show popup and overlay
    document.getElementById('popup').classList.add('show');
    document.getElementById('overlay').classList.add('show');

    // Hide popup after 2 seconds
    setTimeout(() => {
        document.getElementById('popup').classList.remove('show');
        document.getElementById('overlay').classList.remove('show');
    }, 2000);

    // Clear textarea
    document.getElementById('feedback').value = '';
});